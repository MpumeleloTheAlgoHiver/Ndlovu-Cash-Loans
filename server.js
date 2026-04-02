const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const crypto = require('crypto');
// Your .env config is correct
require('dotenv').config({ path: path.join(__dirname, 'public', 'user', '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({
    verify: (req, res, buf) => {
        const url = req.originalUrl || '';
        if (
            url.startsWith('/api/docuseal/webhook') ||
            url.startsWith('/api/kyc/webhook') ||
            url.startsWith('/api/didit/webhook') ||
            url.startsWith('/api/webhooks/didit')
        ) {
            req.rawBody = Buffer.from(buf);
        }
    }
}));

// --- User Portal API routes (Your code) ---
const tillSlipRoute = require('./public/user/routes/tillSlipRoute');
const bankStatementRoute = require('./public/user/routes/bankStatementRoute');
const idcardRoute = require('./public/user/routes/idcardRoute');
const kyc = require(path.join(__dirname, 'public', 'user-portal', 'Services', 'kycService'));
const truidClient = require('./services/truidClient');
const creditCheckService = require('./services/creditCheckService');
const { supabase, supabaseService } = require('./config/supabaseServer');
const { startNotificationScheduler } = require('./services/notificationScheduler');

const DOCUSEAL_API_KEY = process.env.DOCUSEAL_API_KEY;
const DOCUSEAL_TEMPLATE_ID = process.env.DOCUSEAL_TEMPLATE_ID;
const DOCUSEAL_API_URL = process.env.DOCUSEAL_API_URL || 'https://api.docuseal.com';

const isDocuSealReady = () => Boolean(DOCUSEAL_API_KEY && DOCUSEAL_TEMPLATE_ID);

const docuSealHeaders = {
    'Content-Type': 'application/json',
    'X-Auth-Token': DOCUSEAL_API_KEY || ''
};

const DEFAULT_AUTH_OVERLAY_COLOR = '#EA580C';
const DEFAULT_COMPANY_NAME = 'Your Company';

const DEFAULT_CAROUSEL_SLIDES = [
    {
        title: 'A Leap to\nFinancial Freedom',
        text: 'We offer credit of up to R200,000, with repayment terms extending up to a maximum of 36 months.'
    },
    {
        title: 'Flexible Repayments',
        text: "Repayment terms are tailored to each client's cash flow, risk profile, and agreed-upon conditions."
    },
    {
        title: 'Save on Interest',
        text: 'Our interest rates and fees are highly competitive, ensuring great value for our clients.'
    }
];

const DEFAULT_SYSTEM_SETTINGS = {
    id: 'global',
    company_name: DEFAULT_COMPANY_NAME,
    primary_color: '#E7762E',
    secondary_color: '#F97316',
    tertiary_color: '#FACC15',
    theme_mode: 'light',
    company_logo_url: null,
    auth_background_url: null,
    auth_background_flip: false,
    auth_overlay_color: DEFAULT_AUTH_OVERLAY_COLOR,
    auth_overlay_enabled: true,
    carousel_slides: DEFAULT_CAROUSEL_SLIDES.map((slide) => ({ ...slide }))
};

const normalizeBoolean = (value, fallback = false) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        const lower = value.toLowerCase();
        if (lower === 'true') return true;
        if (lower === 'false') return false;
    }
    if (typeof value === 'number') {
        if (value === 1) return true;
        if (value === 0) return false;
    }
    return fallback;
};

const normalizeHexColor = (value, fallback) => {
    if (!value) return fallback;
    let hex = `${value}`.trim().replace('#', '');
    if (hex.length === 3) {
        hex = hex.split('').map((char) => char + char).join('');
    }
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
        return fallback;
    }
    return `#${hex.toUpperCase()}`;
};

const normalizeCompanyName = (value) => {
    const name = typeof value === 'string' ? value.trim() : '';
    return name || DEFAULT_SYSTEM_SETTINGS.company_name;
};

const sanitizeSlide = (slide = {}, fallback = {}) => {
    const safeTitle = typeof slide.title === 'string' ? slide.title.trim() : '';
    const safeText = typeof slide.text === 'string' ? slide.text.trim() : '';
    return {
        title: safeTitle || fallback.title,
        text: safeText || fallback.text
    };
};

const normalizeCarouselSlides = (slides) => {
    const incoming = Array.isArray(slides) ? slides : [];
    return DEFAULT_CAROUSEL_SLIDES.map((fallback, index) => sanitizeSlide(incoming[index] || {}, fallback));
};

const hydrateSystemSettings = (settings = {}) => ({
    ...DEFAULT_SYSTEM_SETTINGS,
    ...settings,
    company_name: normalizeCompanyName(settings?.company_name),
    auth_background_flip: normalizeBoolean(settings?.auth_background_flip, DEFAULT_SYSTEM_SETTINGS.auth_background_flip),
    auth_overlay_color: normalizeHexColor(settings?.auth_overlay_color, DEFAULT_SYSTEM_SETTINGS.auth_overlay_color),
    auth_overlay_enabled: normalizeBoolean(settings?.auth_overlay_enabled, DEFAULT_SYSTEM_SETTINGS.auth_overlay_enabled),
    carousel_slides: normalizeCarouselSlides(settings.carousel_slides)
});

const THEME_CACHE_TTL_MS = 60 * 1000;
let cachedSystemSettings = {
    data: hydrateSystemSettings(),
    timestamp: 0
};

async function loadSystemSettings(forceRefresh = false) {
    const now = Date.now();
    const isCacheFresh = now - cachedSystemSettings.timestamp < THEME_CACHE_TTL_MS;
    if (!forceRefresh && isCacheFresh) {
        return cachedSystemSettings.data;
    }

    try {
        const { data, error } = await supabaseService
            .from('system_settings')
            .select('*')
            .eq('id', 'global')
            .maybeSingle();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        const theme = hydrateSystemSettings(data);
        cachedSystemSettings = { data: theme, timestamp: now };
        return theme;
    } catch (error) {
        console.error('System settings fetch failed:', error.message || error);
        return cachedSystemSettings.data;
    }
}

async function docuSealRequest(method, endpoint, data) {
    if (!isDocuSealReady()) {
        throw new Error('DocuSeal configuration missing');               
    }

    return axios({
        method,
        url: `${DOCUSEAL_API_URL}${endpoint}`,
        headers: docuSealHeaders,
        data
    });
}

function buildDocuSealSubmission(applicationData = {}, profileData = {}) {
    return {
        template_id: parseInt(DOCUSEAL_TEMPLATE_ID, 10),
        send_email: true,
        submitters: [
            {
                role: 'Borrower',
                email: profileData.email,
                name: profileData.full_name,
                values: {
                    borrower_name: profileData.full_name,
                    borrower_email: profileData.email,
                    borrower_phone: profileData.contact_number || '',
                    borrower_id: profileData.id,
                    loan_amount: applicationData.requested_amount?.toString() || '0',
                    interest_rate: applicationData.interest_rate?.toString() || '20',
                    loan_term: applicationData.term_months?.toString() || '1',
                    monthly_payment: applicationData.monthly_payment?.toString() || '0',
                    total_repayment: applicationData.total_repayment?.toString() || '0',
                    application_id: applicationData.id,
                    application_date: applicationData.created_at
                        ? new Date(applicationData.created_at).toLocaleDateString('en-ZA')
                        : '',
                    contract_date: new Date().toLocaleDateString('en-ZA'),
                    first_payment_date: applicationData.repayment_start_date
                        ? new Date(applicationData.repayment_start_date).toLocaleDateString('en-ZA')
                        : ''
                },
                metadata: {
                    application_id: applicationData.id,
                    user_id: profileData.id,
                    loan_amount: applicationData.requested_amount
                }
            }
        ],
        metadata: {
            application_id: applicationData.id,
            user_id: profileData.id,
            loan_amount: applicationData.requested_amount,
            status: 'sent'
        }
    };
}

function handleDocuSealError(error, res) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error
        || error.response?.data?.message
        || error.message
        || 'DocuSeal request failed';

    console.error('DocuSeal API error:', message, error.response?.data || '');
    return res.status(status).json({ error: message, details: error.response?.data });
}

app.use('/api/tillslip', tillSlipRoute);
app.use('/api/bankstatement', bankStatementRoute);
app.use('/api/idcard', idcardRoute);

app.get('/api/system-settings', async (req, res) => {
    try {
        const forceRefresh = ['true', '1'].includes((req.query.refresh || '').toString());
        const theme = await loadSystemSettings(forceRefresh);
        return res.json({
            data: theme,
            updated_at: cachedSystemSettings.timestamp,
            cache_ttl_ms: THEME_CACHE_TTL_MS
        });
    } catch (error) {
        console.error('System settings API error:', error);
        return res.status(200).json({
            data: cachedSystemSettings.data,
            fallback: true
        });
    }
});

// ── Branding Upload (logo / wallpaper) ────────────────────────────────────
// The browser Supabase client is restricted by RLS on the avatars bucket.
// Route requests through the server so the service-role key bypasses RLS.
const multer = require('multer');
const brandingUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 8 * 1024 * 1024 } // 8 MB cap
});

app.post('/api/upload/branding', brandingUpload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file provided' });

        const { type = 'logo' } = req.body; // 'logo' | 'wallpaper'
        const ext = (req.file.originalname.split('.').pop() || 'bin').toLowerCase();
        const filename = type === 'wallpaper'
            ? `system/wallpaper_${Date.now()}.${ext}`
            : `system/logo_${Date.now()}.${ext}`;

        const { error: uploadError } = await supabaseService.storage
            .from('avatars')
            .upload(filename, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: true
            });

        if (uploadError) throw uploadError;

        const { data } = supabaseService.storage
            .from('avatars')
            .getPublicUrl(filename);

        return res.json({ url: data.publicUrl });
    } catch (err) {
        console.error('Branding upload error:', err);
        return res.status(500).json({ error: err.message || 'Upload failed' });
    }
});

// KYC API routes
app.post('/api/kyc/create-session', async (req, res) => {
    try {
        const result = await kyc.createSession(req.body);
        return res.json(result);
    } catch (error) {
        console.error('KYC session error:', error);
        return res.status(500).json({ error: error.message || 'Unable to create KYC session' });
    }
});

async function handleDiditWebhook(req, res) {
    try {
        const signature =
            req.headers['x-signature'] ||
            req.headers['x-didit-signature'] ||
            req.headers['didit-signature'] ||
            req.headers['x-webhook-signature'];

        const payload = req.body;
        const rawBody = req.rawBody;

        const hasWebhookSecret = Boolean(process.env.DIDIT_WEBHOOK_SECRET_KEY);

        if (hasWebhookSecret) {
            if (!signature || !kyc.verifyWebhookSignature(payload, signature, rawBody)) {
                return res.status(401).json({ error: 'Invalid signature' });
            }
        } else {
            console.warn('⚠️ DIDIT_WEBHOOK_SECRET_KEY is not set. Accepting Didit webhook without signature verification.');
        }

        await kyc.updateSessionFromWebhook(payload);
        return res.status(200).json({ received: true });
    } catch (error) {
        console.error('KYC webhook error:', error);
        return res.status(500).json({ error: 'Webhook processing failed' });
    }
}

app.post('/api/kyc/webhook', handleDiditWebhook);
app.post('/api/didit/webhook', handleDiditWebhook);
app.post('/api/webhooks/didit', handleDiditWebhook);

app.get('/api/kyc/session/:sessionId', async (req, res) => {
    try {
        const result = await kyc.getSessionStatus(req.params.sessionId);
        return res.json(result);
    } catch (error) {
        console.error('KYC session lookup error:', error);
        return res.status(404).json({ error: 'Session not found' });
    }
});

app.get('/api/kyc/user/:userId/status', async (req, res) => {
    try {
        const result = await kyc.getUserKycStatus(req.params.userId);
        return res.json(result);
    } catch (error) {
        console.error('KYC status error:', error);
        return res.status(500).json({ error: 'Unable to fetch KYC status' });
    }
});

// ── TruID Bank Statement API routes ──────────────────────────────────────

const parseTruIDStatus = (payload = {}) => {
    const statusNode = payload.status || payload.current_status;
    const fromStatuses = (() => {
        if (!Array.isArray(payload.statuses) || !payload.statuses.length) return null;
        const sorted = [...payload.statuses].sort((a, b) => Date.parse(b.time || b.created || 0) - Date.parse(a.time || a.created || 0));
        const latest = sorted[0] || {};
        return latest.code || latest.status || latest.state || null;
    })();

    const raw = statusNode?.code || statusNode || payload.state || fromStatuses || 'UNKNOWN';
    return String(raw || 'UNKNOWN').toUpperCase();
};

const isTruIDCompleteStatus = (status) => {
    const normalized = String(status || '').toUpperCase();
    return ['COMPLETED', 'COMPLETE', 'SUCCESS', 'SUCCEEDED', 'READY', 'DONE'].includes(normalized);
};

const normalizeUuid = (value) => {
    const raw = typeof value === 'string' ? value.trim() : '';
    if (!raw) return null;
    const uuidV4Like = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidV4Like.test(raw) ? raw : null;
};

const persistTruIDCollection = async (record = {}) => {
    const now = new Date().toISOString();
    const payload = {
        ...record,
        updated_at: now
    };

    if (!payload.collection_id) {
        throw new Error('collection_id is required for TruID persistence');
    }

    const { error } = await supabaseService
        .from('truid_collections')
        .upsert(payload, { onConflict: 'collection_id' });

    if (error) {
        throw error;
    }
};

const buildTruIDSnapshot = (collectionId, payload = {}) => {
    const statement = payload.statement || {};
    const summaryData = statement.summaryData || [];
    const accounts = statement.accounts || [];
    const transactions = accounts[0]?.transactions || [];

    const toNum = (v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
    };

    const getMode = (vals) => {
        const counts = new Map();
        vals.forEach(v => {
            const k = toNum(v);
            if (k > 0) counts.set(k, (counts.get(k) || 0) + 1);
        });
        if (!counts.size) return null;
        return Number([...counts.entries()].sort((a, b) => b[1] - a[1])[0][0]);
    };

    const monthsCaptured = summaryData.length || toNum(statement.summaries) || 0;
    const divisor = monthsCaptured || 1;

    const totalIncome = summaryData.length
        ? summaryData.reduce((s, m) => s + toNum(m.total_income), 0)
        : toNum(statement.income);

    const totalExpenses = summaryData.length
        ? summaryData.reduce((s, m) => s + toNum(m.total_expenses), 0)
        : toNum(statement.expenses);

    const avgMonthlyIncome = totalIncome / divisor;
    const avgMonthlyExpenses = totalExpenses / divisor;
    const netMonthlyIncome = avgMonthlyIncome - avgMonthlyExpenses;

    const salaryCredits = transactions.filter(tx => {
        const isCreditType = String(tx.type || '').toLowerCase() === 'credit';
        const hasSalaryText = ['description', 'category_two', 'category_three']
            .some(f => String(tx[f] || '').toLowerCase().includes('salary'));
        return isCreditType && hasSalaryText;
    });

    const mainSalary = getMode(salaryCredits.map(tx => toNum(tx.amount)))
        || (salaryCredits.length ? totalIncome / divisor : 0)
        || getMode(summaryData.map(m => toNum(m.main_income)));

    const salaryPaymentDate = salaryCredits.map(tx => tx.date).filter(Boolean).sort().pop() || null;

    return {
        collectionId,
        bankName: statement.customer?.bank || null,
        customerName: statement.customer?.name || null,
        capturedAt: new Date().toISOString(),
        monthsCaptured,
        totalIncome,
        totalExpenses,
        avgMonthlyIncome,
        avgMonthlyExpenses,
        netMonthlyIncome,
        mainSalary,
        salaryPaymentDate,
        summaryData,
        rawStatement: statement
    };
};

// ROUTE 1: Initiate a TruID collection
// Client POSTs: { name, idNumber, email?, mobile? }
// Returns: { success, collectionId, consumerUrl }
app.post('/api/truid/initiate', async (req, res) => {
    const { name, idNumber, email, mobile, services } = req.body || {};
    if (!name || !idNumber) {
        return res.status(400).json({ success: false, error: 'name and idNumber are required' });
    }
    try {
        const start = Date.now();
        console.log('[TruID initiate request]', {
            hasName: Boolean(name),
            hasIdNumber: Boolean(idNumber),
            idNumberLength: String(idNumber || '').replace(/\D/g, '').length,
            hasEmail: Boolean(email),
            hasMobile: Boolean(mobile),
            servicesCount: Array.isArray(services) ? services.length : 0
        });

        const result = await truidClient.createCollection({ name, idNumber, email, mobile, services });

        try {
            await persistTruIDCollection({
                collection_id: result.collectionId,
                user_id: normalizeUuid(req.body?.userId),
                application_id: req.body?.applicationId || null,
                consent_id: result.consentId || null,
                consumer_url: result.consumerUrl || null,
                status: 'INITIATED',
                normalized_status: 'INITIATED',
                correlation: {
                    source: 'api/truid/initiate',
                    candidateUrls: result.candidateUrls || null
                },
                collection_payload: result.data || null,
                capture_attempts: 0,
                last_error: null
            });
        } catch (persistError) {
            console.error('[TruID initiate persistence error]', persistError.message || persistError);
        }

        console.log('[TruID initiate response]', {
            elapsedMs: Date.now() - start,
            collectionId: result.collectionId,
            consentId: result.consentId || null,
            consumerUrl: result.consumerUrl || null,
            candidateUrls: result.candidateUrls || null
        });

        return res.status(201).json({
            success: true,
            collectionId: result.collectionId,
            consumerUrl: result.consumerUrl,
            candidateUrls: result.candidateUrls || null
        });
    } catch (err) {
        console.error('[TruID initiate error]', {
            message: err.message,
            status: err.status || 500,
            code: err.code || null
        });
        return res.status(err.status || 500).json({ success: false, error: err.message });
    }
});

// ROUTE 2: Poll collection status
// Client GETs: /api/truid/status?collectionId=xxx
// Returns: { success, collectionId, currentStatus }
app.get('/api/truid/status', async (req, res) => {
    const { collectionId } = req.query;
    if (!collectionId) {
        return res.status(400).json({ success: false, error: 'Missing collectionId' });
    }
    try {
        const result = await truidClient.getCollection(collectionId);
        const d = result.data || {};

        const currentStatus = parseTruIDStatus(d);

        try {
            await persistTruIDCollection({
                collection_id: collectionId,
                status: currentStatus,
                normalized_status: currentStatus,
                collection_payload: d,
                correlation: { source: 'api/truid/status' },
                last_error: null
            });
        } catch (persistError) {
            console.error('[TruID status persistence error]', persistError.message || persistError);
        }

        return res.json({ success: true, collectionId, currentStatus, raw: d });
    } catch (err) {
        console.error('[TruID status error]', err.message);
        return res.status(err.status || 500).json({ success: false, error: err.message });
    }
});

// ROUTE 3: Capture (download) completed bank statement data
// Client POSTs: { collectionId }
// Returns: { success, collectionId, snapshot }
app.post('/api/truid/capture', async (req, res) => {
    const { collectionId } = req.body || {};
    if (!collectionId) {
        return res.status(400).json({ success: false, error: 'Missing collectionId' });
    }
    try {
        const result = await truidClient.getCollectionData(collectionId);
        const payload = result.data || {};
        const snapshot = buildTruIDSnapshot(collectionId, payload);

        try {
            const { data: existing, error: existingError } = await supabaseService
                .from('truid_collections')
                .select('capture_attempts')
                .eq('collection_id', collectionId)
                .maybeSingle();

            if (existingError) {
                throw existingError;
            }

            const captureAttempts = Number(existing?.capture_attempts || 0) + 1;

            await persistTruIDCollection({
                collection_id: collectionId,
                status: 'CAPTURED',
                normalized_status: 'CAPTURED',
                verified: true,
                summary_payload: payload,
                captured_at: new Date().toISOString(),
                capture_attempts: captureAttempts,
                correlation: { source: 'api/truid/capture' },
                last_error: null
            });
        } catch (persistError) {
            console.error('[TruID capture persistence error]', persistError.message || persistError);
        }

        console.log('[TruID] Captured snapshot for', collectionId, snapshot);

        return res.status(201).json({ success: true, collectionId, snapshot });
    } catch (err) {
        try {
            await persistTruIDCollection({
                collection_id: collectionId,
                status: 'CAPTURE_FAILED',
                normalized_status: 'CAPTURE_FAILED',
                last_error: err.message || String(err)
            });
        } catch (persistError) {
            console.error('[TruID capture failure persistence error]', persistError.message || persistError);
        }

        console.error('[TruID capture error]', err.message);
        return res.status(err.status || 500).json({ success: false, error: err.message });
    }
});

// TruID webhook (receives async completion notifications)
app.post('/api/truid/webhook', async (req, res) => {
    try {
        const body = req.body || {};
        const collectionId = body.collectionId || body.collection_id || body.id;
        const statusFromWebhook = parseTruIDStatus(body);
        console.log('[TruID Webhook] Received:', collectionId, body);

        if (!collectionId) {
            return res.status(200).json({ success: true, ignored: true, reason: 'No collectionId in webhook payload' });
        }

        try {
            await persistTruIDCollection({
                collection_id: collectionId,
                status: statusFromWebhook,
                normalized_status: statusFromWebhook,
                collection_payload: body,
                correlation: { source: 'api/truid/webhook' },
                last_error: null
            });
        } catch (persistError) {
            console.error('[TruID webhook persistence error]', persistError.message || persistError);
        }

        if (isTruIDCompleteStatus(statusFromWebhook)) {
            try {
                const result = await truidClient.getCollectionData(collectionId);
                const payload = result.data || {};

                const { data: existing, error: existingError } = await supabaseService
                    .from('truid_collections')
                    .select('capture_attempts')
                    .eq('collection_id', collectionId)
                    .maybeSingle();

                if (existingError) {
                    throw existingError;
                }

                const captureAttempts = Number(existing?.capture_attempts || 0) + 1;

                await persistTruIDCollection({
                    collection_id: collectionId,
                    status: 'CAPTURED',
                    normalized_status: 'CAPTURED',
                    verified: true,
                    summary_payload: payload,
                    captured_at: new Date().toISOString(),
                    capture_attempts: captureAttempts,
                    correlation: {
                        source: 'api/truid/webhook',
                        webhookStatus: statusFromWebhook,
                        autoCaptured: true
                    },
                    last_error: null
                });
            } catch (captureError) {
                console.error('[TruID webhook auto-capture error]', captureError.message || captureError);
                try {
                    await persistTruIDCollection({
                        collection_id: collectionId,
                        status: 'CAPTURE_FAILED',
                        normalized_status: 'CAPTURE_FAILED',
                        last_error: captureError.message || String(captureError)
                    });
                } catch (persistError) {
                    console.error('[TruID webhook capture failure persistence error]', persistError.message || persistError);
                }
            }
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('[TruID webhook error]', error.message);
        return res.status(500).json({ error: 'Webhook processing failed' });
    }
});
app.post('/api/webhooks/truid', (req, res) => {
    // Alias for primary webhook path
    req.app.handle(Object.assign(req, { url: '/api/truid/webhook', originalUrl: '/api/truid/webhook' }), res);
});

// Credit Check API endpoint
app.post('/api/credit-check', async (req, res) => {
    try {
        const { applicationId, userData } = req.body;

        if (!applicationId || !userData) {
            return res.status(400).json({ error: 'applicationId and userData are required' });
        }

        const authHeader = req.headers.authorization || '';
        const authToken = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : null;

        let authenticatedUserId = null;
        if (authToken) {
            const { data: authData, error: authError } = await supabaseService.auth.getUser(authToken);
            if (!authError && authData?.user?.id) {
                authenticatedUserId = authData.user.id;
            }
        }

        const requestedUserId = userData?.user_id || null;
        const effectiveUserId = authenticatedUserId || requestedUserId;

        if (!effectiveUserId) {
            return res.status(400).json({ error: 'Unable to resolve user identity for credit check' });
        }

        if (requestedUserId && authenticatedUserId && requestedUserId !== authenticatedUserId) {
            return res.status(403).json({ error: 'Credit check user mismatch' });
        }

        const { data: existingCompletedCheck, error: existingCheckError } = await supabaseService
            .from('credit_checks')
            .select('id, credit_score, score_band, checked_at, application_id')
            .eq('user_id', effectiveUserId)
            .eq('status', 'completed')
            .order('checked_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (existingCheckError) {
            console.error('Credit check duplicate guard query error:', existingCheckError);
        }

        const hasExistingCompletedCheck = Boolean(existingCompletedCheck?.id);

        if (hasExistingCompletedCheck) {
            return res.status(409).json({
                success: false,
                alreadyChecked: true,
                error: 'Credit check already completed for this user',
                existing: {
                    creditScore: existingCompletedCheck.credit_score || null,
                    riskType: existingCompletedCheck.score_band || null,
                    checkedAt: existingCompletedCheck.checked_at || null,
                    applicationId: existingCompletedCheck.application_id || null
                }
            });
        }

        const result = await creditCheckService.performCreditCheck(
            {
                ...userData,
                user_id: effectiveUserId
            },
            applicationId,
            authToken
        );

        return res.json(result);
    } catch (error) {
        console.error('Credit check error:', error);
        return res.status(500).json({ error: error.message || 'Credit check failed' });
    }
});

// Notification testing endpoints (development only)
const notificationScheduler = require('./services/notificationScheduler');

app.post('/api/notifications/check-payments', async (req, res) => {
    try {
        await notificationScheduler.checkPaymentDueNotifications();
        return res.json({ success: true, message: 'Payment due notifications checked' });
    } catch (error) {
        console.error('Error checking payment notifications:', error);
        return res.status(500).json({ error: error.message });
    }
});

app.post('/api/notifications/check-edit-window', async (req, res) => {
    try {
        await notificationScheduler.checkEditWindowNotifications();
        return res.json({ success: true, message: 'Edit window notifications checked' });
    } catch (error) {
        console.error('Error checking edit window notifications:', error);
        return res.status(500).json({ error: error.message });
    }
});

// Loan affordability calculation endpoint
app.post('/api/calculate-affordability', (req, res) => {
    try {
        const {
            monthly_income,
            affordability_percent = 20, // Default 20%
            annual_interest_rate = 30, // Default 30% APR
            loan_term_months = 1, // Default 1 month
            monthly_service_fee = 60,
            initiation_fee_rate = 15, // 15% initiation fee on every loan
        } = req.body;

        const effective_initiation = initiation_fee_rate;

        if (!monthly_income || monthly_income <= 0) {
            return res.status(400).json({ error: 'Valid monthly_income is required' });
        }

        // 1. Maximum monthly repayment (13% of income)
        const max_monthly_payment = monthly_income * (affordability_percent / 100);

        // 2. Convert annual rate from percentage to decimal; interest rate is the full annual rate
        const total_annual_rate = annual_interest_rate / 100;
        const initiation_rate_decimal = effective_initiation / 100;
        const interest_annual_rate = total_annual_rate; // Interest is the full annual rate; initiation is separate
        const monthly_rate = interest_annual_rate / 12;

        // 3. Reducing-balance payment per R1 principal
        const per_rand_monthly = monthly_rate > 0
            ? (monthly_rate * Math.pow(1 + monthly_rate, loan_term_months)) / (Math.pow(1 + monthly_rate, loan_term_months) - 1)
            : (1 / loan_term_months);

        // 4. Principal coefficient includes initiation spread over the term
        const principal_coefficient = per_rand_monthly + (initiation_rate_decimal / loan_term_months);

        // 5. Monthly service fee is a fixed amount, so deduct first
        const available_for_principal = Math.max(max_monthly_payment - Number(monthly_service_fee || 0), 0);
        const loan_amount = principal_coefficient > 0
            ? available_for_principal / principal_coefficient
            : 0;

        return res.json({
            max_monthly_payment: Number(max_monthly_payment.toFixed(2)),
            affordability_threshold: Number(max_monthly_payment.toFixed(2)),
            max_loan_amount: Number(loan_amount.toFixed(2)),
            monthly_rate: Number((monthly_rate * 100).toFixed(4)),
            annual_interest_rate,
            loan_term_months,
            affordability_percent,
            monthly_service_fee: Number(monthly_service_fee || 0),
            initiation_fee_rate
        });
    } catch (error) {
        console.error('Affordability calculation error:', error);
        return res.status(500).json({ error: error.message || 'Calculation failed' });
    }
});

// DocuSeal proxy endpoints
app.get('/api/docuseal/config', (req, res) => {
    return res.json({
        configured: isDocuSealReady(),
        templateId: isDocuSealReady() ? DOCUSEAL_TEMPLATE_ID : null
    });
});

app.post('/api/docuseal/send-contract', async (req, res) => {
    if (!isDocuSealReady()) {
        return res.status(503).json({ error: 'DocuSeal integration is not configured' });
    }

    const { applicationData, profileData } = req.body || {};
    if (!applicationData || !profileData) {
        return res.status(400).json({ error: 'applicationData and profileData are required' });
    }

    try {
        const payload = buildDocuSealSubmission(applicationData, profileData);
        const response = await docuSealRequest('post', '/submissions', payload);
        return res.json(response.data);
    } catch (error) {
        return handleDocuSealError(error, res);
    }
});

app.get('/api/docuseal/submissions/:submissionId', async (req, res) => {
    if (!isDocuSealReady()) {
        return res.status(503).json({ error: 'DocuSeal integration is not configured' });
    }

    try {
        const response = await docuSealRequest('get', `/submissions/${req.params.submissionId}`);
        return res.json(response.data);
    } catch (error) {
        return handleDocuSealError(error, res);
    }
});

app.get('/api/docuseal/submitters/:submitterId', async (req, res) => {
    if (!isDocuSealReady()) {
        return res.status(503).json({ error: 'DocuSeal integration is not configured' });
    }

    try {
        const response = await docuSealRequest('get', `/submitters/${req.params.submitterId}`);
        return res.json(response.data);
    } catch (error) {
        return handleDocuSealError(error, res);
    }
});

app.put('/api/docuseal/submitters/:submitterId', async (req, res) => {
    if (!isDocuSealReady()) {
        return res.status(503).json({ error: 'DocuSeal integration is not configured' });
    }

    try {
        const payload = { send_email: true, ...(req.body || {}) };
        const response = await docuSealRequest('put', `/submitters/${req.params.submitterId}`, payload);
        return res.json(response.data);
    } catch (error) {
        return handleDocuSealError(error, res);
    }
});

app.delete('/api/docuseal/submissions/:submissionId', async (req, res) => {
    if (!isDocuSealReady()) {
        return res.status(503).json({ error: 'DocuSeal integration is not configured' });
    }

    try {
        const response = await docuSealRequest('delete', `/submissions/${req.params.submissionId}`);
        return res.json(response.data);
    } catch (error) {
        return handleDocuSealError(error, res);
    }
});

// DocuSeal Webhook Receiver – updates docuseal_submissions when DocuSeal sends events
app.post('/api/docuseal/webhook', async (req, res) => {
    try {
        // Verify webhook signature if secret is configured
        const secret = process.env.DOCUSEAL_WEBHOOK_SECRET;
        if (secret) {
            const sigHeader = (req.headers['x-docuseal-signature'] || req.headers['x-signature'] || req.headers['x-hub-signature'] || '').toString();
            if (!sigHeader) {
                // Allow a simple test header fallback (not secure) during debugging if configured
                const testHeaderName = process.env.DOCUSEAL_TEST_HEADER_NAME || '';
                const testHeaderValue = process.env.DOCUSEAL_TEST_HEADER_VALUE || '';
                if (testHeaderName && testHeaderValue) {
                    const incoming = req.headers[testHeaderName.toLowerCase()];
                    if (incoming && incoming === testHeaderValue) {
                        console.log('Accepted DocuSeal webhook via custom test header', testHeaderName);
                        // treat as valid and skip HMAC validation
                    } else {
                        console.warn('Missing DocuSeal signature header and test header did not match', {
                            expectedTestHeader: testHeaderName,
                            headers: req.headers,
                            rawBodyLength: req.rawBody ? req.rawBody.length : 0,
                            bodySample: (() => {
                                try { return JSON.stringify(req.body).slice(0, 1000); } catch (e) { return '<non-serializable body>'; }
                            })()
                        });
                        return res.status(401).json({ error: 'Missing signature header' });
                    }
                } else {
                    // Log full headers + small body sample to help debug what DocuSeal is sending
                    console.warn('Missing DocuSeal signature header', {
                        headers: req.headers,
                        rawBodyLength: req.rawBody ? req.rawBody.length : 0,
                        bodySample: (() => {
                            try { return JSON.stringify(req.body).slice(0, 1000); } catch (e) { return '<non-serializable body>'; }
                        })()
                    });
                    return res.status(401).json({ error: 'Missing signature header' });
                }
            }

            // Strip common prefix (e.g. 'sha256=') if present
            let received = sigHeader.startsWith('sha256=') ? sigHeader.slice(7) : sigHeader;

            // Compute expected digests
            const computedHex = crypto.createHmac('sha256', secret).update(req.rawBody || Buffer.from('')).digest('hex');
            const computedBase64 = crypto.createHmac('sha256', secret).update(req.rawBody || Buffer.from('')).digest('base64');

            let valid = false;
            try {
                // Try hex comparison (timing-safe)
                const rec = Buffer.from(received, 'hex');
                const comp = Buffer.from(computedHex, 'hex');
                if (rec.length === comp.length && crypto.timingSafeEqual(rec, comp)) valid = true;
            } catch (e) {}
            try {
                // Try base64 comparison (timing-safe)
                const recB = Buffer.from(received, 'base64');
                const compB = Buffer.from(computedBase64, 'base64');
                if (recB.length === compB.length && crypto.timingSafeEqual(recB, compB)) valid = true;
            } catch (e) {}
            // Fallback string compare for plain header formats
            if (received === computedHex || received === computedBase64) valid = true;

            if (!valid) {
                console.warn('Invalid DocuSeal webhook signature');
                return res.status(401).json({ error: 'Invalid signature' });
            }
        }

        const payload = req.body || {};
        const eventType = payload.event_type || payload.type || '';
        const data = payload.data || payload;

        console.log('DocuSeal webhook received:', eventType, data?.id || data?.submission_id || 'no-id');

        const now = new Date().toISOString();

        const updateBySubmitter = async (fields) => {
            if (!data?.id) return;
            await supabase
                .from('docuseal_submissions')
                .update({ ...fields, updated_at: now })
                .eq('submitter_id', data.id);
        };

        const updateBySubmission = async (fields) => {
            const submissionId = data?.id || data?.submission_id;
            if (!submissionId) return;
            await supabase
                .from('docuseal_submissions')
                .update({ ...fields, updated_at: now })
                .eq('submission_id', submissionId);
        };

        switch (eventType) {
            case 'form.viewed':
                await updateBySubmitter({ status: 'opened', opened_at: data.opened_at || now });
                break;
            case 'form.started':
                await updateBySubmitter({ status: 'started' });
                break;
            case 'form.completed':
                await updateBySubmitter({ status: 'completed', completed_at: data.completed_at || now, metadata: data.values || data.metadata || {} });
                // After a submitter completes the form, mark the related application as Contract Signed (step 5)
                try {
                    const applicationId = data?.metadata?.application_id || data?.application_id || data?.submission?.metadata?.application_id || data?.submission?.application_id || null;
                    if (applicationId) {
                        await supabase
                            .from('loan_applications')
                            .update({ status: 'OFFER_ACCEPTED', contract_signed_at: now })
                            .eq('id', applicationId);
                        console.log('DocuSeal: set application', applicationId, 'to OFFER_ACCEPTED');
                    }
                } catch (err) {
                    console.error('Error updating application status after DocuSeal completed:', err);
                }
                break;
            case 'form.declined':
                try {
                    // Mark the submitter row as declined (use submitter id present in data.id)
                    await updateBySubmitter({ status: 'declined', declined_at: data.declined_at || now, metadata: data.values || data.metadata || {} });

                    // Also update any submission-level rows by submission.id if available
                    const submissionId = data.submission?.id || data.submission_id;
                    if (submissionId) {
                        await supabase
                            .from('docuseal_submissions')
                            .update({ status: 'declined', declined_at: data.declined_at || now, updated_at: now })
                            .eq('submission_id', submissionId);
                    }
                } catch (error) {
                    console.error('DocuSeal form.declined handling error:', error);
                }
                break;
            case 'submission.archived':
                await updateBySubmission({ status: 'archived', archived_at: data.archived_at || now });
                break;
            case 'submission.created':
                try {
                    const submitters = data.submitters || [];
                    for (const submitter of submitters) {
                        await supabase
                            .from('docuseal_submissions')
                            .upsert({
                                application_id: data.metadata?.application_id || data.application_id || null,
                                submission_id: data.id || data.submission_id || null,
                                submitter_id: submitter.id,
                                slug: submitter.slug || null,
                                status: submitter.status || 'pending',
                                email: submitter.email || null,
                                name: submitter.name || null,
                                role: submitter.role || null,
                                embed_src: submitter.embed_src || null,
                                sent_at: submitter.sent_at || now,
                                metadata: submitter.metadata || {},
                                created_at: submitter.created_at || data.created_at || now,
                                updated_at: now
                            }, { onConflict: 'submitter_id' });
                    }
                } catch (error) {
                    console.error('DocuSeal webhook upsert error:', error);
                }
                break;
            // Handle updates where submitter status changes (e.g. declined) or submission metadata updates
            case 'submitter.updated':
            case 'submitter.status_changed':
            case 'submission.updated':
            case 'submission.declined':
            case 'submitter.declined':
            case 'form.declined':
                try {
                    // If submitters array provided, upsert each submitter (status may have changed)
                    const submitters = data.submitters || [];
                    if (submitters.length > 0) {
                        for (const submitter of submitters) {
                            await supabase
                                .from('docuseal_submissions')
                                .upsert({
                                    application_id: data.metadata?.application_id || data.application_id || null,
                                    submission_id: data.id || data.submission_id || null,
                                    submitter_id: submitter.id,
                                    slug: submitter.slug || null,
                                    status: submitter.status || 'pending',
                                    email: submitter.email || null,
                                    name: submitter.name || null,
                                    role: submitter.role || null,
                                    embed_src: submitter.embed_src || null,
                                    sent_at: submitter.sent_at || now,
                                    metadata: submitter.metadata || {},
                                    created_at: submitter.created_at || data.created_at || now,
                                    updated_at: now
                                }, { onConflict: 'submitter_id' });
                        }
                    }

                    // If submission-level status provided, update rows by submission_id
                    const submissionId = data.id || data.submission_id;
                    if (submissionId && data.status) {
                        await supabase
                            .from('docuseal_submissions')
                            .update({ status: data.status, updated_at: now })
                            .eq('submission_id', submissionId);
                    }
                } catch (error) {
                    console.error('DocuSeal webhook update error:', error);
                }
                break;
            default:
                console.log('Unhandled DocuSeal webhook event:', eventType);
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        console.error('DocuSeal webhook processing error:', error);
        return res.status(500).json({ error: error.message || 'DocuSeal webhook failed' });
    }
});


// =================================================================
// --- 5. ADMIN & PUBLIC STATIC FILE SERVING (THE FIX) ---
// =================================================================

// 5a. Define the path to your *BUILT* admin app's 'dist' folder
const adminDistPath = path.join(__dirname, 'public', 'admin', 'dist');
const adminAssetsPath = path.join(adminDistPath, 'assets');
const adminSourcePath = path.join(__dirname, 'public', 'admin');
const adminBuildExists = fs.existsSync(path.join(adminDistPath, 'index.html'));

// Helper to pick the built file when it exists, otherwise fall back to source HTML.
const resolveAdminFile = (fileName) => {
    const builtFile = path.join(adminDistPath, fileName);
    if (adminBuildExists && fs.existsSync(builtFile)) {
        return builtFile;
    }
    return path.join(adminSourcePath, fileName);
};

// Intercept ALL /admin/*.html requests BEFORE static middleware so config is injected
app.get('/admin/:page.html', (req, res, next) => {
    const fileName = req.params.page + '.html';
    const filePath = resolveAdminFile(fileName);
    if (fs.existsSync(filePath)) {
        return sendHtmlWithConfig(filePath, res);
    }
    next();
});

if (adminBuildExists) {
    // ★★★ THIS IS THE FIX YOU NEEDED ★★★
    // This captures requests to /assets/... and points them to public/admin/dist/assets
    app.use('/assets', express.static(adminAssetsPath));

    // Fallback for cached asset names (serves latest hash when old file requested)
    app.get('/assets/:assetName', (req, res, next) => {
        const requestedFile = path.join(adminAssetsPath, req.params.assetName);
        if (fs.existsSync(requestedFile)) {
            return res.sendFile(requestedFile);
        }

        const dotIndex = req.params.assetName.lastIndexOf('.');
        const dashIndex = req.params.assetName.indexOf('-');
        if (dotIndex === -1 || dashIndex === -1) {
            return next();
        }

        const baseName = req.params.assetName.slice(0, dashIndex);
        const extension = req.params.assetName.slice(dotIndex);

        try {
            const files = fs.readdirSync(adminAssetsPath);
            const match = files.find(file => file.startsWith(`${baseName}-`) && file.endsWith(extension));
            if (match) {
                return res.sendFile(path.join(adminAssetsPath, match));
            }
        } catch (err) {
            console.error('Asset fallback error:', err);
        }

        return next();
    });

    // 5b. Serve all static assets (CSS, JS) from the 'dist' folder
    // This uses the '/admin' prefix
    app.use('/admin', express.static(adminDistPath));
} else {
    console.warn('Admin build not found at public/admin/dist. Falling back to source files. Run "npm run build --prefix public/admin" for optimized assets.');
    app.use('/admin', express.static(adminSourcePath));
}

// 5c. HTML config injection — serves any .html file with window.__APP_CONFIG__ injected
const buildConfigScript = () => {
    const cfg = {
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    };
    return `<script>window.__APP_CONFIG__=${JSON.stringify(cfg)};</script>`;
};

const sendHtmlWithConfig = (filePath, res) => {
    try {
        const html = fs.readFileSync(filePath, 'utf8');
        const injected = html.replace('<head>', '<head>\n    ' + buildConfigScript());
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        return res.send(injected);
    } catch (err) {
        return res.status(404).send('Not found');
    }
};

app.use((req, res, next) => {
    const requestPath = req.path || '/';
    const normalizedPath = requestPath.replace(/^\/+/, '');

    const candidateFiles = [];

    if (requestPath === '/') {
        candidateFiles.push(path.join(__dirname, 'public', 'index.html'));
    }

    if (requestPath.endsWith('.html')) {
        candidateFiles.push(path.join(__dirname, 'public', normalizedPath));
    }

    if (requestPath.endsWith('/')) {
        candidateFiles.push(path.join(__dirname, 'public', normalizedPath, 'index.html'));
    }

    candidateFiles.push(path.join(__dirname, 'public', normalizedPath, 'index.html'));

    for (const filePath of candidateFiles) {
        if (filePath && fs.existsSync(filePath)) {
            return sendHtmlWithConfig(filePath, res);
        }
    }

    next();
});

// 5d. Serve the REST of the 'public' folder (JS, CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));


// --- 6. Root Redirect & Auth Helpers ---
app.get('/', (req, res) => {
    res.redirect('/auth/login.html');
});

// Helper routes to catch bad redirects
app.get('/login.html', (req, res) => {
    res.redirect('/auth/login.html');
});
app.get('/auth.html', (req, res) => {
    res.redirect('/auth/login.html');
});


// --- 7. Admin Page Routes (FOR MPA) ---

const sendAdminPage = (fileName, res) => {
    const filePath = resolveAdminFile(fileName);
    if (fs.existsSync(filePath)) {
        return sendHtmlWithConfig(filePath, res);
    }
    return res.status(404).send('Admin page not found. Build the admin app or check the path.');
};

app.get('/admin', (req, res) => {
    sendAdminPage('index.html', res);
});

app.get('/admin/index.html', (req, res) => {
    sendAdminPage('index.html', res);
});

app.get('/admin/auth.html', (req, res) => {
    sendAdminPage('auth.html', res);
});

app.get('/admin/dashboard', (req, res) => {
    sendAdminPage('dashboard.html', res);
});


app.get('/admin/analytics', (req, res) => {
    sendAdminPage('analytics.html', res);
});

app.get('/admin/applications', (req, res) => {
    sendAdminPage('applications.html', res);
});

app.get('/admin/application-detail', (req, res) => {
    sendAdminPage('application-detail.html', res);
});

app.get('/admin/create-application-step1', (req, res) => {
    sendAdminPage('create-application-step1.html', res);
});

app.get('/admin/incoming-payments', (req, res) => {
    sendAdminPage('incoming-payments.html', res);
});

app.get('/admin/outgoing-payments', (req, res) => {
    sendAdminPage('outgoing-payments.html', res);
});

app.get('/admin/users', (req, res) => {
    sendAdminPage('users.html', res);
});

app.get('/admin/settings', (req, res) => {
    sendAdminPage('settings.html', res);
});

app.get('/admin/financials', (req, res) => {
    sendAdminPage('financials.html', res);
});


// --- 8. Start Server ---
app.listen(PORT, () => {
    const companyNameForLog = cachedSystemSettings?.data?.company_name || DEFAULT_SYSTEM_SETTINGS.company_name;
    console.log(`🚀 ${companyNameForLog} server running on http://localhost:${PORT}`);
    console.log(`📁 Serving admin files from: ${adminDistPath}`);
    console.log(`📁 Serving public files from: ${path.join(__dirname, 'public')}`);
    
    // Start notification scheduler
    startNotificationScheduler();
});