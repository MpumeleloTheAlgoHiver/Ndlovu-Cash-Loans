// services/truidClient.js — TruID Connect bank-statement API client
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

  /** Validates all required env vars are present before any API call */
  validateSetup() {
    const missing = ['TRUID_API_KEY', 'COMPANY_ID', 'BRAND_ID', 'REDIRECT_URL', 'WEBHOOK_URL']
      .filter(k => !readEnv(k));
    if (missing.length) throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }

  /** Resolves the consumer URL from multiple possible response shapes */
  resolveConsumerUrl(data, consentId, locationHeader) {
    const raw = data?.consumerUrl || data?.links?.consumer || data?.inviteUrl || locationHeader || null;
    if (raw) return raw;
    if (consentId) return `https://www.truidconnect.io/consents/${consentId}`;
    return null;
  }

  /**
   * STEP 1: Create a TruID collection.
   * @param {string} name   – user's full name
   * @param {string} idNumber – SA ID number (13-digit string)
   * @param {string} [idType='id']
   * @param {string} [email]
   * @param {string} [mobile]
   * @param {string[]} [services] – TruID product IDs
   */
  async createCollection({ name, idNumber, idType = 'id', email, mobile, services = [] }) {
    this.validateSetup();
    if (!name || !idNumber) throw new Error('name and idNumber are required');

    const defaultServices = [
      'eeh03fzauckvj8u982dbeq1d8', // 90 days transactions history
      'amqfuupe00xk3cfw3dergvb9n', // 3 months bank statements
      's8d7f67de8w9iekjrfu',       // Personal categorisation
      'mk2weodif8gutjre4kwsdfd',   // Income verification
      '12wsdofikgjtm5k4eiduy',     // Affordability
      'apw99w0lj1nwde4sfxd0'       // Pay date indicators (90 days)
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
      const response = await this.consultantClient.post('/collections', payload);
      const locationHeader = response.headers['location'];
      const consentHeader = response.headers['x-consent'];
      const data = typeof response.data === 'object' ? response.data : null;

      // Extract collectionId — prefer body.id, fall back to last segment of Location header
      let collectionId = data?.id || null;
      if (!collectionId && locationHeader) {
        const parts = locationHeader.split('/');
        collectionId = parts[parts.length - 1] || null;
      }

      const consumerUrl = this.resolveConsumerUrl(data, consentHeader, locationHeader);

      return { success: true, collectionId, consumerUrl, consentId: consentHeader, data };
    } catch (error) {
      const status = error.response?.status || 500;
      const details = JSON.stringify(error.response?.data || error.message);
      const err = new Error(`TruID createCollection failed: ${details}`);
      err.status = status;
      throw err;
    }
  }

  /** STEP 2: Check collection status */
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

  /** STEP 3: Download completed bank statement data */
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
