import { supabase } from '/Services/supabaseClient.js';

async function initBankStatementModule() {
  const statusEl = document.getElementById('truidStatusMessage');
  const connectBtn = document.getElementById('truidConnectBtn');
  const checkmark = document.getElementById('bankstatementCheckmark');
  const existingInfo = document.getElementById('existingFileInfo');
  const statusChip = document.getElementById('bankstatementStatusChip');

  // --- Tab switching ---
  const tabTruid = document.getElementById('bsTabTruid');
  const tabManual = document.getElementById('bsTabManual');
  const panelTruid = document.getElementById('bsPanelTruid');
  const panelManual = document.getElementById('bsPanelManual');

  if (tabTruid && tabManual && panelTruid && panelManual) {
    tabTruid.addEventListener('click', () => {
      tabTruid.classList.add('active'); tabManual.classList.remove('active');
      panelTruid.style.display = ''; panelManual.style.display = 'none';
    });
    tabManual.addEventListener('click', () => {
      tabManual.classList.add('active'); tabTruid.classList.remove('active');
      panelManual.style.display = ''; panelTruid.style.display = 'none';
    });
  }

  if (!statusEl || !connectBtn) {
    console.warn('⚠️ Bank statement module DOM not ready');
    return;
  }

  if (connectBtn.dataset.bound === 'true') return;
  connectBtn.dataset.bound = 'true';

  const applicationId = sessionStorage.getItem('currentApplicationId') || sessionStorage.getItem('lastApplicationId');
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  const authToken = session?.access_token;

  if (!userId) {
    console.warn('⚠️ User not logged in');
    statusEl.textContent = '⚠️ Please log in first';
    statusEl.style.color = '#ff9800';
    connectBtn.disabled = true;
    connectBtn.textContent = 'Please Log In';
    return;
  }

  // Hide checkmark until verified
  if (checkmark) checkmark.style.display = 'none';

  // ── TruID state ───────────────────────────────────────────────
  let _collectionId = null;
  let _pollingTimer = null;

  function setStatus(text, type) {
    statusEl.textContent = text;
    statusEl.style.color = type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : '#374151';
  }

  function setChip(label, type) {
    if (!statusChip) return;
    statusChip.textContent = label;
    statusChip.style.background = type === 'success' ? '#dcfce7' : type === 'error' ? '#fee2e2' : '#f3f4f6';
    statusChip.style.color = type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#374151';
  }

  function setCheckmark(visible) {
    if (checkmark) checkmark.style.display = visible ? '' : 'none';
  }

  function setBtnState(loading) {
    connectBtn.disabled = loading;
    connectBtn.textContent = loading ? 'Connecting…' : 'Connect Bank via TruID';
  }

  function stopPolling() {
    if (_pollingTimer) { clearInterval(_pollingTimer); _pollingTimer = null; }
  }

  function applyVerifiedState(details = {}) {
    const isManual = details.isManual === true;
    setCheckmark(true);
    connectBtn.disabled = true;
    connectBtn.style.opacity = '0.5';
    connectBtn.style.cursor = 'not-allowed';
    connectBtn.textContent = isManual ? 'Statement Uploaded ✓' : 'Bank Connected ✓';

    const manualBtn = document.getElementById('bankstatementUploadBtn');
    const manualFile = document.getElementById('bankstatementFile');
    if (manualBtn) { manualBtn.disabled = true; manualBtn.style.opacity = '0.5'; manualBtn.style.cursor = 'not-allowed'; manualBtn.textContent = 'Uploaded ✓'; }
    if (manualFile) manualFile.disabled = true;

    setChip(isManual ? 'Uploaded' : 'Connected', 'success');

    if (existingInfo) {
      const dateStr = new Date(details.capturedAt || details.captured_at || Date.now()).toLocaleDateString();
      existingInfo.style.color = '#1f8c5c';
      existingInfo.innerHTML = isManual
        ? `✓ Bank statement uploaded on ${dateStr}`
        : `✓ Bank connected via TruID on ${dateStr}`;
    }

    stopPolling();
    window.dispatchEvent(new CustomEvent('document:uploaded', { detail: { fileType: 'bank_statement' } }));
  }

  // ── STEP 3: Capture bank data after consent completes ─────────
  async function captureData(collectionId) {
    setStatus('Retrieving your bank data…', 'info');
    try {
      const r = await fetch('/api/truid/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionId })
      });
      const data = await r.json();
      if (!data.success) throw new Error(data.error || 'Capture failed');

      const s = data.snapshot || {};
      const summary = [
        s.bankName ? 'Bank: ' + s.bankName : null,
        s.avgMonthlyIncome ? 'Avg income: R' + Math.round(s.avgMonthlyIncome).toLocaleString() : null,
        s.monthsCaptured ? s.monthsCaptured + ' months captured' : null
      ].filter(Boolean).join(' · ');

      setStatus('✓ Bank connected' + (summary ? ': ' + summary : ''), 'success');
      setChip('Connected', 'success');
      setCheckmark(true);
      if (existingInfo) existingInfo.textContent = s.customerName ? 'Verified: ' + s.customerName : '';

      connectBtn.disabled = true;
      connectBtn.style.opacity = '0.5';
      connectBtn.style.cursor = 'not-allowed';
      connectBtn.textContent = 'Bank Connected ✓';

      window.dispatchEvent(new CustomEvent('document:uploaded', { detail: { fileType: 'bank_statement' } }));
    } catch (err) {
      setStatus('Failed to retrieve data: ' + err.message, 'error');
      setChip('Error', 'error');
    }
  }

  // ── STEP 2: Poll until TruID status is terminal ───────────────
  function pollStatus(collectionId, popup) {
    setStatus('Waiting for bank consent…', 'info');
    _pollingTimer = setInterval(async () => {
      try {
        const r = await fetch('/api/truid/status?collectionId=' + encodeURIComponent(collectionId));
        const data = await r.json();
        if (!data.success) return; // transient error — keep polling

        const raw = data.currentStatus;
        const s = String(raw || '').toUpperCase();
        const num = Number(raw);
        const hasNum = Number.isFinite(num);

        // SUCCESS: numeric 2000–2999, or string contains SUCCESS/COMPLETED
        const isComplete = (hasNum && num >= 2000 && num < 3000)
          || s.includes('SUCCESS') || s.includes('COMPLETED');

        // FAILURE: string contains FAILED/CANCELLED/ERROR
        const isFailed = s.includes('FAILED') || s.includes('CANCELLED') || s.includes('ERROR');

        if (isComplete) {
          stopPolling();
          if (popup && !popup.closed) popup.close();
          setStatus('Consent received, downloading data…', 'info');
          captureData(collectionId);
        } else if (isFailed) {
          stopPolling();
          if (popup && !popup.closed) popup.close();
          setStatus('Bank consent was cancelled or failed. Please try again.', 'error');
          setChip('Failed', 'error');
          setBtnState(false);
        }
      } catch (_) { /* network blip — keep polling */ }
    }, 3000);
  }

  // ── Check for existing manual upload first ────────────────────
  try {
    const { checkDocumentExistsByUser } = await import('/user-portal/Services/documentService.js');
    const existingDoc = await checkDocumentExistsByUser(userId, 'bank_statement');
    if (existingDoc) {
      applyVerifiedState({ isManual: true, capturedAt: existingDoc.uploaded_at });
      setStatus('✅ Bank statement already uploaded.', 'success');
      return;
    }
  } catch (err) {
    console.warn('Could not check existing manual upload:', err);
  }

  // ── Fetch user profile for name & ID number ──────────────────
  let userName = '';
  let userIdNumber = '';
  let userEmail = session?.user?.email || '';
  let userMobile = '';

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, first_name, surname, last_name, identity_number, id_number, cell_tel_no, cell_phone, contact_number')
      .eq('id', userId)
      .single();

    if (profile) {
      userName = profile.full_name
        || [profile.first_name, profile.surname || profile.last_name].filter(Boolean).join(' ')
        || session?.user?.user_metadata?.full_name
        || '';
      userIdNumber = profile.identity_number || profile.id_number
        || session?.user?.user_metadata?.id_number
        || '';
      userMobile = profile.cell_tel_no || profile.cell_phone || profile.contact_number
        || session?.user?.phone
        || session?.user?.user_metadata?.phone
        || '';
    }
  } catch (err) {
    console.warn('Could not load profile for TruID:', err);
    // Fall back to user_metadata
    userName = session?.user?.user_metadata?.full_name || session?.user?.user_metadata?.name || '';
    userIdNumber = session?.user?.user_metadata?.id_number || session?.user?.user_metadata?.idNumber || '';
  }

  console.log('✅ Ready for bank statement connection', { applicationId: applicationId || 'none', userId, userName: userName ? '✓' : '✗', idNumber: userIdNumber ? '✓' : '✗' });

  // ── STEP 1: TruID connect button ─────────────────────────────
  connectBtn.addEventListener('click', async () => {
    stopPolling();
    setBtnState(true);
    setStatus('Initialising secure connection…', 'info');
    setChip('Connecting', 'info');

    if (!userName || !userIdNumber) {
      setStatus('⚠️ Name and ID number are required. Please complete your profile first.', 'error');
      setChip('Missing Info', 'error');
      setBtnState(false);
      return;
    }

    try {
      const r = await fetch('/api/truid/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userName, idNumber: userIdNumber, email: userEmail, mobile: userMobile })
      });
      const data = await r.json();

      if (!data.success || !data.consumerUrl) {
        throw new Error(data.error || 'Failed to get consent URL');
      }

      _collectionId = data.collectionId;

      // Open the bank consent screen in a centred popup
      const w = 500, h = 700;
      const left = (window.screen.width - w) / 2;
      const topPos = (window.screen.height - h) / 2;
      const popup = window.open(
        data.consumerUrl,
        'TruID_Bank_Consent',
        `width=${w},height=${h},top=${topPos},left=${left},scrollbars=yes,resizable=yes`
      );

      if (!popup) {
        // Popup blocked — fall back to inline iframe
        setStatus('Popup blocked. Opening inline…', 'info');
        const iframeContainer = document.createElement('div');
        iframeContainer.style.cssText = 'margin-top:16px;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;';
        const iframe = document.createElement('iframe');
        iframe.src = data.consumerUrl;
        iframe.style.cssText = 'width:100%;height:600px;border:none;';
        iframe.allow = 'camera; microphone';
        iframeContainer.appendChild(iframe);
        panelTruid.appendChild(iframeContainer);
        pollStatus(data.collectionId, null);
        return;
      }

      setStatus('Complete the consent in the popup window…', 'info');
      pollStatus(data.collectionId, popup);

      // Safety net: detect if popup is closed manually
      const closedChecker = setInterval(() => {
        if (popup.closed) clearInterval(closedChecker);
      }, 1000);

    } catch (err) {
      setStatus('Error: ' + err.message, 'error');
      setChip('Error', 'error');
      setBtnState(false);
    }
  });

  // ── Manual upload ─────────────────────────────────────────────
  const manualForm = document.getElementById('bankstatementForm');
  const fileInput = document.getElementById('bankstatementFile');
  const uploadBtn = document.getElementById('bankstatementUploadBtn');
  const selectedFileDisplay = document.getElementById('bsSelectedFile');
  const dropzone = document.getElementById('bsDropzone');

  if (manualForm && fileInput && uploadBtn) {
    if (dropzone) {
      dropzone.addEventListener('click', () => fileInput.click());
      dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.style.borderColor = '#111827'; });
      dropzone.addEventListener('dragleave', () => { dropzone.style.borderColor = '#d1d5db'; });
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = '#d1d5db';
        if (e.dataTransfer.files.length) {
          fileInput.files = e.dataTransfer.files;
          fileInput.dispatchEvent(new Event('change'));
        }
      });
    }

    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (file && selectedFileDisplay) {
        const fileSize = (file.size / 1024).toFixed(1);
        selectedFileDisplay.innerHTML = `<i class="fas fa-file"></i> <strong>${file.name}</strong> <span>(${fileSize} KB)</span>`;
        selectedFileDisplay.style.display = 'block';
      }
    });

    manualForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const file = fileInput.files[0];
      if (!file) {
        setStatus('⚠️ Please select a file first.', 'error');
        return;
      }

      uploadBtn.disabled = true;
      uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
      setStatus('Uploading bank statement... ⏳', 'info');

      const formData = new FormData();
      formData.append('file', file);
      if (applicationId) formData.append('applicationId', applicationId);

      try {
        const res = await fetch('/api/bankstatement/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${authToken}` },
          body: formData,
        });
        const data = await res.json();

        if (res.ok) {
          applyVerifiedState({ isManual: true, capturedAt: new Date().toISOString() });
          setStatus('✅ Bank statement uploaded successfully!', 'success');
        } else {
          setStatus(`❌ Upload failed: ${data.message || data.error}`, 'error');
          uploadBtn.disabled = false;
          uploadBtn.textContent = 'Upload Bank Statement';
        }
      } catch (err) {
        console.error('⚠️ Bank statement upload error:', err);
        setStatus('⚠️ Something went wrong during upload.', 'error');
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload Bank Statement';
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBankStatementModule, { once: true });
} else {
  initBankStatementModule();
}
