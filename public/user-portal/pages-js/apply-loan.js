import '/user-portal/Services/sessionGuard.js'; // Production auth guard

window.consentGiven = false;

const REQUIRED_DOCUMENTS = ['tillslip', 'bankstatement'];
const documentState = {
  tillslip: 'pending',
  bankstatement: 'pending',
  kyc: 'pending'
};

const documentButtonRefs = {
  tillslip: { button: null, chip: null },
  bankstatement: { button: null, chip: null }
};

let moduleStatusRef = null;
let nextBtnRef = null;
let loginRequired = false;
let activeUserId = null;
let refreshDocumentsHandler = null;
let documentServices = null;
let supabaseClientInstance = null;
let kycButtonRef = null;
let kycStatusRef = null;
let isKycLaunching = false;
let kycStatusInterval = null;

const APPLY_LOAN_PAGE = 'apply-loan';

async function getSupabaseClient() {
  if (supabaseClientInstance) {
    return supabaseClientInstance;
  }
  const { supabase } = await import('/Services/supabaseClient.js');
  supabaseClientInstance = supabase;
  return supabaseClientInstance;
}

function resetDocumentStateFlags() {
  Object.keys(documentState).forEach(key => {
    documentState[key] = 'pending';
  });
}

function resetDocumentReferences() {
  moduleStatusRef = null;
  nextBtnRef = null;
  Object.keys(documentButtonRefs).forEach(key => {
    documentButtonRefs[key].button = null;
    documentButtonRefs[key].chip = null;
  });
}

function detachDocumentUploadedListener() {
  if (refreshDocumentsHandler) {
    window.removeEventListener('document:uploaded', refreshDocumentsHandler);
    refreshDocumentsHandler = null;
  }
}

function cacheKycReferences() {
  kycButtonRef = document.getElementById('kycBtn');
  kycStatusRef = document.getElementById('kycBtnStatus');
}

function setKycStatus(variant, label) {
  if (!kycStatusRef) {
    return;
  }
  kycStatusRef.className = 'document-status';
  if (variant) {
    kycStatusRef.classList.add(variant);
  }
  kycStatusRef.textContent = label || '';
}

function formatKycStatusLabel(status) {
  if (!status) {
    return '';
  }
  return status
    .toString()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

async function refreshKycStatus() {
  cacheKycReferences();
  if (!kycButtonRef || !kycStatusRef) {
    return;
  }

  try {
    const supabase = await getSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.id) {
      setKycStatus('partial', 'Log in to start');
      kycButtonRef.disabled = true;
      return;
    }

    kycButtonRef.disabled = false;

    const response = await fetch(`/api/kyc/user/${session.user.id}/status`);
    if (!response.ok) {
      throw new Error('Unable to check status');
    }

    const data = await response.json();
    console.log('📋 KYC status response:', data);

    const normalizedStatus = (data.normalizedStatus || data.status || '').toString().toLowerCase().trim();
    const normalizedEventType = (data.eventType || '').toString().toLowerCase().trim();
    const completionTokens = ['approved', 'complete', 'completed', 'verified', 'success', 'successful', 'passed', 'done'];
    const completionByStatus = completionTokens.some(token =>
      normalizedStatus === token || normalizedStatus.includes(token) || normalizedEventType.includes(token)
    );
    
    // Treat approved/completed/verified/successful statuses as complete
    if (data.verified || completionByStatus) {
      setKycStatus('ready', 'Approved');
      kycButtonRef.disabled = true;
      kycButtonRef.classList.add('completed');
      kycButtonRef.setAttribute('aria-disabled', 'true');
      documentState.kyc = 'complete';
      
      // Stop polling once approved
      if (kycStatusInterval) {
        clearInterval(kycStatusInterval);
        kycStatusInterval = null;
      }
      
      // Update next button state
      updateNextButtonState();
      renderModuleStatus();
      return;
    }
    
    // Show intermediate statuses (Started, In Progress, etc.)
    if (normalizedStatus) {
      const statusMap = {
        'started': 'Verification Started',
        'in progress': 'Verification In Progress',
        'in_progress': 'Verification In Progress',
        'pending': 'Pending Review',
        'rejected': 'Verification Failed',
        'expired': 'Session Expired'
      };
      
      const displayStatus = statusMap[normalizedStatus] || data.status || 'Pending';
      
      if (normalizedStatus === 'rejected' || normalizedStatus === 'expired') {
        setKycStatus('partial', displayStatus);
        documentState.kyc = 'pending';
      } else if (normalizedStatus === 'started' || normalizedStatus.includes('progress') || normalizedStatus === 'pending') {
        setKycStatus('partial', displayStatus);
        documentState.kyc = 'partial';
      }
      
      updateNextButtonState();
      renderModuleStatus();
      return;
    }

    const statusLabel = formatKycStatusLabel(data.status);
    if (statusLabel) {
      setKycStatus('partial', statusLabel);
      documentState.kyc = 'partial';
    } else {
      setKycStatus(null, 'Start');
      documentState.kyc = 'pending';
    }

    updateNextButtonState();
    renderModuleStatus();
  } catch (err) {
    console.error('Failed to refresh KYC status:', err);
    setKycStatus('partial', 'Status unavailable');
  }
}

async function handleKycButtonClick() {
  if (isKycLaunching) {
    return;
  }

  cacheKycReferences();
  if (!kycButtonRef || !kycStatusRef) {
    return;
  }

  try {
    isKycLaunching = true;
    kycButtonRef.disabled = true;
    setKycStatus('partial', 'Launching verification...');

    const supabase = await getSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      setKycStatus('partial', 'Log in to start');
      return;
    }

    const payload = {
      userId: session.user.id,
      email: session.user.email,
      metadata: {
        full_name: session.user.user_metadata?.full_name
      }
    };

    const phone = session.user.phone || session.user.user_metadata?.phone || session.user.user_metadata?.phone_number;
    if (phone) {
      payload.phone = phone;
    }

    const response = await fetch('/api/kyc/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok || !data.verification_url) {
      throw new Error(data.error || 'Unable to start verification');
    }

    window.open(data.verification_url, '_blank', 'width=900,height=700');
    setKycStatus('partial', 'Verification started');

    // Start polling for status updates every 5 seconds
    if (kycStatusInterval) {
      clearInterval(kycStatusInterval);
    }
    kycStatusInterval = setInterval(async () => {
      await refreshKycStatus();
    }, 5000);
  } catch (err) {
    console.error('Failed to start KYC verification:', err);
    setKycStatus('partial', err.message || 'Unable to start verification');
  } finally {
    isKycLaunching = false;
    if (kycButtonRef && !kycStatusRef?.classList.contains('ready')) {
      kycButtonRef.disabled = false;
    }
  }
}

async function initKycButton() {
  cacheKycReferences();
  if (!kycButtonRef || !kycStatusRef) {
    return;
  }

  if (!kycButtonRef.dataset.bound) {
    kycButtonRef.addEventListener('click', handleKycButtonClick);
    kycButtonRef.dataset.bound = 'true';
  }

  await refreshKycStatus();
}

// --- Profile Guard Modal ---
function showProfileGuardModal(missingFields, profile, supabase, userId) {
  return new Promise((resolve) => {
    // Remove existing modal if any
    const existing = document.getElementById('profile-guard-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'profile-guard-modal';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:10000;display:flex;align-items:center;justify-content:center;animation:fadeIn .25s ease;';

    const card = document.createElement('div');
    card.style.cssText = 'background:#fff;border-radius:16px;padding:28px 28px 20px;max-width:440px;width:92%;box-shadow:0 20px 60px rgba(0,0,0,0.25);position:relative;max-height:90vh;overflow-y:auto;';

    let formFieldsHTML = '';
    missingFields.forEach(f => {
      const existingVal = profile?.[f.key] || (f.fallback ? profile?.[f.fallback] : '') || '';
      if (f.type === 'select') {
        const opts = f.options.map(o => `<option value="${o.value}" ${existingVal === o.value ? 'selected' : ''}>${o.text}</option>`).join('');
        formFieldsHTML += `
          <div style="margin-bottom:14px;">
            <label style="display:block;font-weight:500;margin-bottom:5px;font-size:.9rem;color:#374151;">${f.label} <span style="color:#ef4444;">*</span></label>
            <select data-field="${f.key}" style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:.95rem;background:#fff;" required>${opts}</select>
          </div>`;
      } else {
        formFieldsHTML += `
          <div style="margin-bottom:14px;">
            <label style="display:block;font-weight:500;margin-bottom:5px;font-size:.9rem;color:#374151;">${f.label} <span style="color:#ef4444;">*</span></label>
            <input data-field="${f.key}" type="${f.type}" value="${existingVal}" placeholder="${f.placeholder || ''}" ${f.maxlength ? `maxlength="${f.maxlength}"` : ''} style="width:100%;padding:10px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:.95rem;box-sizing:border-box;" required />
          </div>`;
      }
    });

    card.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;">
        <div style="width:40px;height:40px;border-radius:10px;background:#fef3c7;display:flex;align-items:center;justify-content:center;">
          <i class="fas fa-user-edit" style="color:#d97706;font-size:18px;"></i>
        </div>
        <div>
          <h3 style="margin:0;font-size:1.1rem;color:#111827;">Complete Your Profile</h3>
          <p style="margin:2px 0 0;font-size:.85rem;color:#6b7280;">Fill in the remaining details to proceed.</p>
        </div>
      </div>
      <form id="profile-guard-form">
        ${formFieldsHTML}
        <div style="display:flex;gap:10px;margin-top:18px;">
          <button type="button" id="pgm-cancel" style="flex:1;padding:11px;border-radius:10px;border:1px solid #d1d5db;background:#fff;font-size:.95rem;cursor:pointer;color:#374151;">Later</button>
          <button type="submit" id="pgm-save" style="flex:1;padding:11px;border-radius:10px;border:none;background:#111827;color:#f9fafb;font-size:.95rem;font-weight:500;cursor:pointer;">Save & Continue</button>
        </div>
      </form>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
        resolve(false);
      }
    });

    // Cancel button
    card.querySelector('#pgm-cancel').addEventListener('click', () => {
      overlay.remove();
      resolve(false);
    });

    // Save button
    card.querySelector('#profile-guard-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const saveBtn = card.querySelector('#pgm-save');
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

      const updateData = { updated_at: new Date().toISOString() };
      let valid = true;

      missingFields.forEach(f => {
        const el = card.querySelector(`[data-field="${f.key}"]`);
        const val = el?.value?.trim() || '';
        if (!val) {
          el.style.borderColor = '#ef4444';
          valid = false;
        } else {
          el.style.borderColor = '#d1d5db';
          updateData[f.key] = val;
          // Also sync alternative column names
          if (f.key === 'last_name') updateData.surname = val;
          if (f.key === 'address') updateData.street_address = val;
        }
      });

      if (!valid) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save & Continue';
        return;
      }

      try {
        const { error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', userId);

        if (error) throw error;

        overlay.remove();
        if (typeof window.showToast === 'function') {
          window.showToast('Profile Updated', 'Your details have been saved.', 'success', 2500);
        }
        resolve(true);
      } catch (err) {
        console.error('Profile guard save error:', err);
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save & Continue';
        if (typeof window.showToast === 'function') {
          window.showToast('Save Failed', err.message || 'Please try again.', 'warning');
        } else {
          alert('Failed to save: ' + (err.message || 'Please try again.'));
        }
      }
    });
  });
}

window.toggleConsent = async function () {
  window.consentGiven = !window.consentGiven;
  const btn = document.getElementById('consentBtn');
  const icon = btn?.querySelector('i');
  const documentList = document.getElementById('documentList');

  if (!btn || !icon || !documentList) {
    return;
  }

  if (window.consentGiven) {
    btn.classList.add('active');
    icon.classList.remove('fa-square');
    icon.classList.add('fa-check-square');
    documentList.classList.remove('hidden-consent');

    // --- Profile completeness guard modal (fires once on consent) ---
    try {
      const supabase = await getSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('identity_number, id_number, first_name, surname, last_name, gender, date_of_birth, street_address, address, postal_code, suburb_area, contact_number, cell_tel_no')
          .eq('id', session.user.id)
          .maybeSingle();

        const fieldDefs = [
          { key: 'identity_number', fallback: 'id_number', label: 'ID Number', type: 'text', maxlength: 13, placeholder: '0213211234083' },
          { key: 'first_name', label: 'First Name', type: 'text', placeholder: 'John' },
          { key: 'last_name', fallback: 'surname', label: 'Last Name / Surname', type: 'text', placeholder: 'Doe' },
          { key: 'gender', label: 'Gender', type: 'select', options: [{ value: '', text: 'Select' }, { value: 'Male', text: 'Male' }, { value: 'Female', text: 'Female' }] },
          { key: 'date_of_birth', label: 'Date of Birth', type: 'date' },
          { key: 'address', fallback: 'street_address', label: 'Street Address', type: 'text', placeholder: '123 Main St' },
          { key: 'postal_code', label: 'Postal Code', type: 'text', maxlength: 4, placeholder: '0123' },
        ];

        const missingFields = fieldDefs.filter(f => {
          const val = profile?.[f.key] || (f.fallback ? profile?.[f.fallback] : null);
          return !val || !String(val).trim();
        });

        if (missingFields.length > 0) {
          await showProfileGuardModal(missingFields, profile, supabase, session.user.id);
        }
      }
    } catch (err) {
      console.warn('Profile guard check failed:', err);
    }
  } else {
    btn.classList.remove('active');
    icon.classList.remove('fa-check-square');
    icon.classList.add('fa-square');
    documentList.classList.add('hidden-consent');
  }

  updateNextButtonState();
}

window.showApplyLoan2 = function() {
  // Use goToStep for validation instead of direct navigation
  window.goToStep(2);
}

function waitForModuleStylesheet(link, timeoutMs = 3000) {
  return new Promise((resolve) => {
    if (!link || link.sheet) {
      resolve(true);
      return;
    }

    let settled = false;
    const cleanup = () => {
      link.removeEventListener('load', onLoad);
      link.removeEventListener('error', onError);
      clearTimeout(timer);
    };

    const finish = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(true);
    };

    const onLoad = () => finish();
    const onError = () => finish();

    const timer = setTimeout(finish, timeoutMs);
    link.addEventListener('load', onLoad, { once: true });
    link.addEventListener('error', onError, { once: true });
  });
}

async function loadModule(name) {
  const overlay = document.getElementById("module-container");
  const moduleContent = document.getElementById("module-content");
  const cssHref = `/user-portal/modules-css/${name}.css`;

  overlay.classList.remove("hidden");
  moduleContent.innerHTML = "<p>Loading...</p>";

  let moduleCssLink = document.querySelector(`link[data-module-css="${name}"]`);
  if (!moduleCssLink) {
    moduleCssLink = document.createElement("link");
    moduleCssLink.rel = "stylesheet";
    moduleCssLink.href = `${cssHref}?t=${Date.now()}`;
    moduleCssLink.dataset.moduleCss = name;
    document.head.appendChild(moduleCssLink);
  }

  await waitForModuleStylesheet(moduleCssLink);

  try {
    const res = await fetch(`/user-portal/modules/${name}.html?t=${Date.now()}`);
    if (!res.ok) throw new Error(`Module ${name} not found`);
    const html = await res.text();
    moduleContent.innerHTML = html;

    await import(`/user-portal/modules-js/${name}.js?t=${Date.now()}`);
  } catch (err) {
    console.error(`❌ Failed to load ${name} module:`, err);
    moduleContent.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

function closeModule() {
  const overlay = document.getElementById("module-container");
  overlay.classList.add("hidden");
}

function showMinimalNotice(title, message) {
  const existing = document.getElementById('minimalNotice');
  if (existing) {
    existing.remove();
  }

  const notice = document.createElement('div');
  notice.id = 'minimalNotice';
  notice.className = 'minimal-notice';
  notice.innerHTML = `<strong>${title}</strong><span>${message}</span>`;
  document.body.appendChild(notice);

  window.setTimeout(() => notice.classList.add('visible'), 10);
  window.setTimeout(() => {
    notice.classList.remove('visible');
    window.setTimeout(() => notice.remove(), 250);
  }, 2600);
}

// Navigation function for step buttons
window.goToStep = function(step) {
  // Guard: Cannot proceed to step 2+ without consent and all documents
  if (step >= 2) {
    if (!window.consentGiven) {
      if (typeof window.showToast === 'function') {
        window.showToast('Consent Required', 'Please consent to the Privacy Policy first', 'warning');
      } else {
        showMinimalNotice('Consent required', 'Please consent to the Privacy Policy first.');
      }
      return;
    }
    
    const docsComplete = REQUIRED_DOCUMENTS.every(doc => documentState[doc] === 'complete');
    const kycComplete = documentState.kyc === 'complete';
    
    if (!docsComplete || !kycComplete) {
      const pending = [];
      if (!kycComplete) pending.push('KYC Verification');
      REQUIRED_DOCUMENTS.forEach(doc => {
        if (documentState[doc] !== 'complete') {
          if (doc === 'tillslip') pending.push('Payslip');
          if (doc === 'bankstatement') pending.push('Bank Statement');
        }
      });
      
      const pendingNames = pending.join(', ');
      
      if (typeof window.showToast === 'function') {
        window.showToast('Documents Required', `Please complete: ${pendingNames}`, 'warning');
      } else {
        showMinimalNotice('Documents required', `Please complete: ${pendingNames}`);
      }
      return;
    }
  }
  
  const pages = {
    1: 'apply-loan.html',
    2: 'apply-loan-2.html',
    3: 'apply-loan-3.html',
    4: 'confirmation.html'
  };
  
  if (typeof loadPage === 'function') {
    const pageNames = {
      1: 'apply-loan',
      2: 'apply-loan-2',
      3: 'apply-loan-3',
      4: 'confirmation'
    };
    loadPage(pageNames[step]);
  } else {
    window.location.href = pages[step];
  }
}

// Make functions globally accessible
window.loadModule = loadModule;
window.closeModule = closeModule;

function cacheElementReferences() {
  moduleStatusRef = moduleStatusRef || document.getElementById('module-status');
  nextBtnRef = nextBtnRef || document.getElementById('nextBtn');

  documentButtonRefs.tillslip.button = document.getElementById('tillslipBtn');
  documentButtonRefs.tillslip.chip = document.getElementById('tillslipBtnStatus');
  documentButtonRefs.bankstatement.button = document.getElementById('bankstatementBtn');
  documentButtonRefs.bankstatement.chip = document.getElementById('bankstatementBtnStatus');

  if (nextBtnRef) {
    nextBtnRef.disabled = true;
  }
}

function setModuleStatusLoading() {
  if (moduleStatusRef) {
    moduleStatusRef.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Checking your documents...';
  }
}

function showModuleStatusError(message) {
  if (moduleStatusRef) {
    moduleStatusRef.innerHTML = `<i class="fas fa-exclamation-triangle" style="color:#d14343;"></i> ${message}`;
  }
}

function renderModuleStatus() {
  if (!moduleStatusRef) {
    return;
  }

  if (loginRequired) {
    moduleStatusRef.innerHTML = '<i class="fas fa-lock" style="color:#555;"></i> Log in to upload your documents.';
    return;
  }

  const completed = REQUIRED_DOCUMENTS.filter(doc => documentState[doc] === 'complete').length;
  if (completed === REQUIRED_DOCUMENTS.length) {
    moduleStatusRef.innerHTML = '<i class="fas fa-check-circle" style="color:#6b7280;"></i> All required items are complete.';
  } else {
    moduleStatusRef.innerHTML = `<i class="fas fa-info-circle" style="color:#7a7a7a;"></i> ${completed}/${REQUIRED_DOCUMENTS.length} documents ready.`;
  }
}

function updateNextButtonState() {
  nextBtnRef = nextBtnRef || document.getElementById('nextBtn');
  if (!nextBtnRef) {
    return;
  }

  const docsComplete = REQUIRED_DOCUMENTS.every(doc => documentState[doc] === 'complete');
  const kycComplete = documentState.kyc === 'complete';
  const allComplete = docsComplete && kycComplete;
  
  nextBtnRef.disabled = !(window.consentGiven && allComplete);
  
  // Mark step 1 as completed when all documents are ready
  const step1 = document.querySelector('.step.active');
  if (step1 && allComplete && window.consentGiven) {
    step1.classList.add('completed');
  } else if (step1) {
    step1.classList.remove('completed');
  }
}

function updateDocumentButtonState(key, state) {
  const refs = documentButtonRefs[key];
  if (!refs) {
    return;
  }

  const { button, chip } = refs;
  if (!chip) {
    return;
  }

  documentState[key] = state;

  chip.className = 'document-status';
  if (button) {
    button.disabled = false;
    button.classList.remove('completed');
    button.removeAttribute('aria-disabled');
  }

  switch (state) {
    case 'complete':
      chip.textContent = key === 'bankstatement' ? 'Captured' : 'Uploaded';
      chip.classList.add('ready');
      if (button) {
        button.disabled = true;
        button.classList.add('completed');
        button.setAttribute('aria-disabled', 'true');
      }
      break;
    case 'partial':
      chip.textContent = 'Partial';
      chip.classList.add('partial');
      break;
    case 'login':
      chip.textContent = 'Log in first';
      if (button) {
        button.disabled = true;
        button.setAttribute('aria-disabled', 'true');
      }
      break;
    default:
      chip.textContent = 'Pending';
  }
}

function setLoginRequiredState() {
  loginRequired = true;
  Object.keys(documentButtonRefs).forEach(key => updateDocumentButtonState(key, 'login'));
  renderModuleStatus();
  updateNextButtonState();
}

async function refreshDocumentStatuses(showSpinner = false) {
  if (!documentServices || !activeUserId) {
    return;
  }

  if (showSpinner) {
    setModuleStatusLoading();
  }

  const [tillSlipExists, bankStatementExists, truidStatus] = await Promise.all([
    documentServices.checkDocumentExistsByUser(activeUserId, 'till_slip'),
    documentServices.checkDocumentExistsByUser(activeUserId, 'bank_statement'),
    fetch(`/api/truid/user/${activeUserId}/status`)
      .then(async (res) => {
        if (!res.ok) {
          return { verified: false };
        }
        return res.json();
      })
      .catch(() => ({ verified: false }))
  ]);

  const bankStatementReady = bankStatementExists || !!truidStatus?.verified;

  updateDocumentButtonState('tillslip', tillSlipExists ? 'complete' : 'pending');
  updateDocumentButtonState('bankstatement', bankStatementReady ? 'complete' : 'pending');

  renderModuleStatus();
  updateNextButtonState();
}

async function initDocumentChecklist() {
  resetDocumentReferences();
  cacheElementReferences();

  if (!moduleStatusRef) {
    return;
  }

  setModuleStatusLoading();

  try {
    detachDocumentUploadedListener();
    const [supabase, docServiceModule] = await Promise.all([
      getSupabaseClient(),
      import('/user-portal/Services/documentService.js')
    ]);

    documentServices = {
      checkDocumentExistsByUser: docServiceModule.checkDocumentExistsByUser,
      checkIdCardExistsByUser: docServiceModule.checkIdCardExistsByUser
    };

    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      throw error;
    }

    activeUserId = session?.user?.id || null;

    if (!activeUserId) {
      setLoginRequiredState();
      return;
    }

    await refreshDocumentStatuses(true);

    refreshDocumentsHandler = () => {
      refreshDocumentStatuses(false).catch(err => {
        console.error('Failed to refresh document statuses:', err);
      });
    };

    window.addEventListener('document:uploaded', refreshDocumentsHandler);
  } catch (err) {
    console.error('Failed to initialize document checklist:', err);
    showModuleStatusError('Unable to retrieve document status.');
  }
}

function bootApplyLoanPage() {
  initDocumentChecklist();
  initKycButton().catch(err => {
    console.error('Failed to initialize KYC button:', err);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootApplyLoanPage, { once: true });
} else {
  bootApplyLoanPage();
}

window.addEventListener('pageLoaded', (event) => {
  const pageName = event?.detail?.pageName;
  if (pageName === APPLY_LOAN_PAGE) {
    resetDocumentStateFlags();
    initDocumentChecklist();
    initKycButton().catch(err => {
      console.error('Failed to initialize KYC button after SPA navigation:', err);
    });
  } else {
    detachDocumentUploadedListener();
    // Clean up KYC polling when leaving the page
    if (kycStatusInterval) {
      clearInterval(kycStatusInterval);
      kycStatusInterval = null;
    }
  }
});

