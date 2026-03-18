// services/truidClient.js
const axios = require('axios');

const readEnv = (key) => process.env[key];

class TruIDClient {
  constructor() {
    this.apiKey = readEnv('TRUID_API_KEY');
    this.subscriptionKey = readEnv('TRUID_SUBSCRIPTION_KEY') || this.apiKey;
    this.baseURL = (readEnv('TRUID_API_BASE') || 'https://api.truidconnect.io').replace(/\/$/, '');
    this.companyId = readEnv('COMPANY_ID');
    this.brandId = readEnv('BRAND_ID');
    this.redirectUrl = readEnv('REDIRECT_URL');
    this.webhookUrl = readEnv('WEBHOOK_URL');

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'Ocp-Apim-Subscription-Key': this.subscriptionKey
    };

    this.consultantClient = axios.create({
      baseURL: `${this.baseURL}/consultant-api`,
      headers,
      timeout: 10000
    });

    this.deliveryClient = axios.create({
      baseURL: `${this.baseURL}/delivery-api`,
      headers,
      timeout: 10000
    });
  }

  // Validates all required env vars are present before any API call
  validateSetup() {
    const missing = ['TRUID_API_KEY','COMPANY_ID','BRAND_ID','REDIRECT_URL','WEBHOOK_URL']
      .filter(k => !readEnv(k));
    if (missing.length) throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }

  // Resolves the consumer URL from multiple possible response shapes
  resolveConsumerUrl(data, consentId) {
    // Check body fields first — never use locationHeader (it's the API resource URL, not consumer-facing)
    const fromBody = data?.consumerUrl || data?.links?.consumer || data?.inviteUrl || null;
    if (fromBody) return fromBody;
    // Fallback: build consent URL from x-consent header
    if (consentId) return `https://www.truidconnect.io/consents/${consentId}`;
    return null;
  }

  // STEP 1: Create a TruID collection.
  // name = user's full name, idNumber = SA ID number (13-digit string)
  // services = array of TruID service/product IDs
  async createCollection({ name, idNumber, idType = 'id', email, mobile, services = [] }) {
    this.validateSetup();
    if (!name || !idNumber) throw new Error('name and idNumber are required');

    const defaultServices = [
      'eeh03fzauckvj8u982dbeq1d8',
      'amqfuupe00xk3cfw3dergvb9n',
      's8d7f67de8w9iekjrfu',
      'mk2weodif8gutjre4kwsdfd',
      '12wsdofikgjtm5k4eiduy',
      'apw99w0lj1nwde4sfxd0'
    ];

    const payload = {
      name,
      idNumber,
      idType,
      brandId: this.brandId,
      companyId: this.companyId,
      redirectUrl: this.redirectUrl,
      webhookUrl: this.webhookUrl,
      services: services.length ? services : defaultServices,
      ...(email && { email }),
      ...(mobile && { mobile })
    };

    try {
      const start = Date.now();
      const response = await this.consultantClient.post('/collections', payload);
      const headers = response.headers || {};
      const locationHeader = headers['location'] || null;
      const consentHeader = headers['x-consent'] || null;
      const data = typeof response.data === 'object' ? response.data : null;
      const rawBody = response.data;

      // Extract collectionId — prefer body.id, fall back to last segment of Location header
      let collectionId = data?.id || null;
      if (!collectionId && locationHeader) {
        const parts = locationHeader.split('/');
        collectionId = parts[parts.length - 1] || null;
      }

      const consumerUrl = this.resolveConsumerUrl(data, consentHeader);

      // Build ALL candidate URLs so we can diagnose which one works
      const candidateUrls = {
        fromBody: data?.consumerUrl || data?.links?.consumer || data?.inviteUrl || null,
        consentPath: consentHeader ? `https://www.truidconnect.io/consents/${consentHeader}` : null,
        credentialsPath: consentHeader ? `https://www.truidconnect.io/credentials/${consentHeader}` : null,
        locationDirect: locationHeader || null,
        collectionConsents: collectionId ? `https://www.truidconnect.io/consents/${collectionId}` : null,
        collectionCredentials: collectionId ? `https://www.truidconnect.io/credentials/${collectionId}` : null,
        selected: consumerUrl
      };

      // ── FULL Vercel debug logging ──
      console.log('[TruID createCollection FULL DEBUG]', JSON.stringify({
        elapsedMs: Date.now() - start,
        httpStatus: response.status,
        allHeaders: Object.fromEntries(
          Object.entries(headers).filter(([k]) => typeof headers[k] === 'string')
        ),
        rawBody: typeof rawBody === 'string' ? rawBody.substring(0, 500) : rawBody,
        bodyKeys: data ? Object.keys(data) : [],
        collectionId,
        consentId: consentHeader,
        candidateUrls
      }, null, 2));

      return { success: true, collectionId, consumerUrl, consentId: consentHeader, data, candidateUrls };
    } catch (error) {
      const status = error.response?.status || 500;
      const details = JSON.stringify(error.response?.data || error.message);
      console.error('[TruID createCollection error]', {
        code: error.code,
        status,
        message: error.message,
        details: error.response?.data || error.message,
        timeoutMs: this.consultantClient.defaults.timeout
      });
      const err = new Error(`TruID createCollection failed: ${details}`);
      err.status = status;
      throw err;
    }
  }

  // STEP 2: Check collection status
  async getCollection(collectionId) {
    this.validateSetup();
    try {
      const response = await this.consultantClient.get(`/collections/${collectionId}`);
      return { success: true, data: response.data };
    } catch (error) {
      const status = error.response?.status || 500;
      const err = new Error(`TruID getCollection failed: ${JSON.stringify(error.response?.data || error.message)}`);
      err.status = status;
      throw err;
    }
  }

  // STEP 3: Download completed bank statement data
  async getCollectionData(collectionId) {
    this.validateSetup();
    try {
      const response = await this.deliveryClient.get(`/collections/${collectionId}/products/summary`);
      return { success: true, data: response.data };
    } catch (error) {
      const status = error.response?.status || 500;
      const err = new Error(`TruID getCollectionData failed: ${JSON.stringify(error.response?.data || error.message)}`);
      err.status = status;
      throw err;
    }
  }
}

module.exports = new TruIDClient();
