// -------------------------------------------------------
// SureSystems Service – Stub / Placeholder
// Replace with real implementation when SureSystems
// integration credentials and docs are available.
// -------------------------------------------------------

const SURESYSTEMS_BASE_URL = process.env.SURESYSTEMS_BASE_URL || '';
const SURESYSTEMS_API_KEY  = process.env.SURESYSTEMS_API_KEY  || '';

function isConfigured() {
  return !!(SURESYSTEMS_BASE_URL && SURESYSTEMS_API_KEY);
}

function getConfigStatus() {
  return {
    configured: isConfigured(),
    baseUrl: SURESYSTEMS_BASE_URL ? '(set)' : '(not set)',
    apiKey: SURESYSTEMS_API_KEY ? '(set)' : '(not set)',
  };
}

function getToday() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function _notConfigured() {
  return { success: false, error: 'SureSystems is not configured. Set SURESYSTEMS_BASE_URL and SURESYSTEMS_API_KEY env vars.' };
}

async function loadMandate(payload) {
  if (!isConfigured()) return _notConfigured();
  // TODO: real implementation
  console.log('[SureSystems] loadMandate called with:', JSON.stringify(payload).slice(0, 200));
  return { success: false, error: 'loadMandate not yet implemented' };
}

async function checkFinalFate(payload) {
  if (!isConfigured()) return _notConfigured();
  console.log('[SureSystems] checkFinalFate called');
  return { success: false, error: 'checkFinalFate not yet implemented' };
}

async function downloadPayments(payload) {
  if (!isConfigured()) return _notConfigured();
  console.log('[SureSystems] downloadPayments called');
  return { success: false, error: 'downloadPayments not yet implemented' };
}

async function mandateEnquiry(payload) {
  if (!isConfigured()) return _notConfigured();
  console.log('[SureSystems] mandateEnquiry called');
  return { success: false, error: 'mandateEnquiry not yet implemented' };
}

async function cancelMandate(payload) {
  if (!isConfigured()) return _notConfigured();
  console.log('[SureSystems] cancelMandate called');
  return { success: false, error: 'cancelMandate not yet implemented' };
}

async function createInstallmentRequest(payload) {
  if (!isConfigured()) return _notConfigured();
  console.log('[SureSystems] createInstallmentRequest called');
  return { success: false, error: 'createInstallmentRequest not yet implemented' };
}

async function updateInstallmentRequest(payload) {
  if (!isConfigured()) return _notConfigured();
  console.log('[SureSystems] updateInstallmentRequest called');
  return { success: false, error: 'updateInstallmentRequest not yet implemented' };
}

async function cancelInstallment(payload) {
  if (!isConfigured()) return _notConfigured();
  console.log('[SureSystems] cancelInstallment called');
  return { success: false, error: 'cancelInstallment not yet implemented' };
}

module.exports = {
  getConfigStatus,
  getToday,
  loadMandate,
  checkFinalFate,
  downloadPayments,
  mandateEnquiry,
  cancelMandate,
  createInstallmentRequest,
  updateInstallmentRequest,
  cancelInstallment,
};
