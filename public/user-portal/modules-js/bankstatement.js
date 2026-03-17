import { supabase } from '/Services/supabaseClient.js';

async function initBankStatementModule() {
  const status = document.getElementById('truidStatusMessage');
  const connectBtn = document.getElementById('truidConnectBtn');
  const checkmark = document.getElementById('bankstatementCheckmark');
  const existingInfo = document.getElementById('existingFileInfo');
  const statusChip = document.getElementById('bankstatementStatusChip');
  let statusPollInterval = null;

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

  if (!status || !connectBtn) {
    console.warn('⚠️ Bank statement module DOM not ready');
    return;
  }

  if (connectBtn.dataset.bound === 'true') {
    return;
  }
  connectBtn.dataset.bound = 'true';

  const applicationId = sessionStorage.getItem('currentApplicationId') || sessionStorage.getItem('lastApplicationId');
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  const authToken = session?.access_token;

  if (!userId) {
    console.warn('⚠️ User not logged in');
    status.textContent = '⚠️ Please log in first';
    status.style.color = '#ff9800';
    connectBtn.disabled = true;
    connectBtn.textContent = 'Please Log In';
    return;
  }

  console.log('✅ Ready for bank statement connection', { applicationId: applicationId || 'none', userId });

  // --- Shared verified state ---
  const applyVerifiedState = (details = {}) => {
    const normalizedStatus = (details.status || '').toString().toLowerCase();
    const isCaptured = Boolean(
      details.capturedAt
      || details.captured_at
      || details.source === 'truid_collections'
      || ['captured', 'data_ready', 'ready', 'completed'].includes(normalizedStatus)
    );
    const isManual = details.isManual === true;

    if (checkmark) checkmark.classList.add('visible');
    if (connectBtn) {
      connectBtn.disabled = true;
      connectBtn.style.opacity = '0.5';
      connectBtn.style.cursor = 'not-allowed';
      connectBtn.textContent = isManual ? 'Statement Uploaded ✓' : (isCaptured ? 'Statement Captured ✓' : 'Bank Connected ✓');
    }

    // Disable manual upload too
    const manualBtn = document.getElementById('bankstatementUploadBtn');
    const manualFile = document.getElementById('bankstatementFile');
    if (manualBtn) { manualBtn.disabled = true; manualBtn.style.opacity = '0.5'; manualBtn.style.cursor = 'not-allowed'; manualBtn.textContent = 'Uploaded ✓'; }
    if (manualFile) manualFile.disabled = true;

    if (statusChip) {
      statusChip.textContent = isManual ? 'Uploaded' : (isCaptured ? 'Captured' : 'Connected');
      statusChip.classList.add('success');
    }

    if (existingInfo) {
      const connectedDate = new Date(details.capturedAt || details.captured_at || details.last_updated || details.updatedAt || Date.now()).toLocaleDateString();
      existingInfo.style.color = '#1f8c5c';
      existingInfo.innerHTML = isManual
        ? `✓ Bank statement uploaded on ${connectedDate}`
        : (isCaptured
          ? `✓ TruID data captured on ${connectedDate}`
          : `✓ Bank connected via TruID on ${connectedDate}`);
    }

    if (statusPollInterval) {
      clearInterval(statusPollInterval);
      statusPollInterval = null;
    }
  };

  // --- TruID status polling ---
  // Helper: recognise TruID's actual success/failure status codes
  const isTruidSuccess = (s) => {
    const u = String(s || '').toUpperCase();
    return u === 'COLLECT_SUCCESS' || u === '2000' || u.includes('COLLECT_SUCCESS') || u.includes('SUCCESS') || u.includes('COMPLETED') || u.includes('COMPLETE');
  };
  const isTruidFailure = (s) => {
    const u = String(s || '').toUpperCase();
    return u.includes('FAILED') || u.includes('CANCELLED') || u.includes('TIMED_OUT') || u.includes('TIMEOUT') || u.includes('EXPIRED');
  };

  const fetchTruidStatus = async () => {
    const response = await fetch(`/api/banking/status?userId=${encodeURIComponent(userId)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Unable to check TruID status');
    }

    // Check raw TruID status first (more reliable than normalized flags)
    const rawStatus = data.status || data.currentStatus || '';
    if (isTruidSuccess(rawStatus) || data.verified) {
      applyVerifiedState(data);
      status.textContent = (data.statusLabel === 'Captured' || data.capturedAt)
        ? 'TruID capture completed.'
        : 'Bank statement verified via TruID.';
      status.style.color = '#28a745';

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('document:uploaded', { detail: { fileType: 'bank_statement' } }));
      }
      return;
    }

    if (isTruidFailure(rawStatus)) {
      if (statusPollInterval) { clearInterval(statusPollInterval); statusPollInterval = null; }
      status.textContent = `TruID connection ${rawStatus.replace(/COLLECT_/i, '').replace(/_/g, ' ').toLowerCase()}. Please try again.`;
      status.style.color = '#dc3545';
      if (connectBtn) { connectBtn.disabled = false; }
      if (statusChip) { statusChip.textContent = 'Failed'; statusChip.classList.remove('success'); }
      return;
    }

    if (statusChip) {
      statusChip.textContent = data.statusLabel || 'Pending';
      statusChip.classList.remove('success');
    }

    if (data.statusLabel) {
      status.textContent = `TruID status: ${data.statusLabel}`;
      status.style.color = '#7a7a7a';
    }
  };

  // Check for existing manual upload
  try {
    const { checkDocumentExistsByUser } = await import('/user-portal/Services/documentService.js');
    const existingDoc = await checkDocumentExistsByUser(userId, 'bank_statement');
    if (existingDoc) {
      applyVerifiedState({ isManual: true, capturedAt: existingDoc.uploaded_at });
      status.textContent = '✅ Bank statement already uploaded.';
      status.style.color = '#28a745';
      window.dispatchEvent(new CustomEvent('document:uploaded', { detail: { fileType: 'bank_statement' } }));
      return; // Skip TruID check
    }
  } catch (err) {
    console.warn('Could not check existing manual upload:', err);
  }

  await fetchTruidStatus();

  // --- TruID connect button ---
  connectBtn.addEventListener('click', async () => {
    status.textContent = 'Launching TruID secure connection...';
    status.style.color = '#7a7a7a';
    connectBtn.disabled = true;

    const redirectUrl = `${window.location.origin}/user-portal/?page=apply-loan`;
    const payload = {
      userId,
      name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || null,
      idNumber: session.user.user_metadata?.id_number || session.user.user_metadata?.idNumber || null,
      idType: 'id',
      email: session.user.email,
      mobile: session.user.phone || session.user.user_metadata?.phone || session.user.user_metadata?.phone_number,
      correlation: {
        userId,
        applicationId: applicationId || null
      },
      redirectUrl
    };

    try {
      const res = await fetch('/api/banking/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        const consumerUrl = data.consumerUrl || data.connect_url;
        if (consumerUrl) {
          window.open(consumerUrl, '_blank', 'width=900,height=700');
        }

        status.textContent = 'TruID launched. Complete bank linking to continue.';
        status.style.color = '#7a7a7a';

        if (statusChip) { statusChip.textContent = 'In Progress'; statusChip.classList.remove('success'); }

        if (statusPollInterval) clearInterval(statusPollInterval);
        statusPollInterval = setInterval(fetchTruidStatus, 5000);
      } else {
        console.error('❌ TruID launch failed', data);
        status.textContent = `❌ TruID start failed: ${data.message || data.error}`;
        status.style.color = '#dc3545';
        connectBtn.disabled = false;
        if (statusChip) { statusChip.textContent = 'Pending'; statusChip.classList.remove('success'); }
      }
    } catch (err) {
      console.error('⚠️ TruID request error', err);
      status.textContent = '⚠️ Something went wrong while starting TruID.';
      status.style.color = '#ff9800';
      connectBtn.disabled = false;
      if (statusChip) { statusChip.textContent = 'Pending'; statusChip.classList.remove('success'); }
    }
  });

  // --- Manual upload ---
  const manualForm = document.getElementById('bankstatementForm');
  const fileInput = document.getElementById('bankstatementFile');
  const uploadBtn = document.getElementById('bankstatementUploadBtn');
  const selectedFileDisplay = document.getElementById('bsSelectedFile');
  const dropzone = document.getElementById('bsDropzone');

  if (manualForm && fileInput && uploadBtn) {
    // Click dropzone to open file picker
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
        status.textContent = '⚠️ Please select a file first.';
        status.style.color = '#ff9800';
        return;
      }

      uploadBtn.disabled = true;
      uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
      status.textContent = 'Uploading bank statement... ⏳';
      status.style.color = '#7a7a7a';

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
          status.textContent = '✅ Bank statement uploaded successfully!';
          status.style.color = '#28a745';
          window.dispatchEvent(new CustomEvent('document:uploaded', { detail: { fileType: 'bank_statement' } }));
        } else {
          status.textContent = `❌ Upload failed: ${data.message || data.error}`;
          status.style.color = '#dc3545';
          uploadBtn.disabled = false;
          uploadBtn.textContent = 'Upload Bank Statement';
        }
      } catch (err) {
        console.error('⚠️ Bank statement upload error:', err);
        status.textContent = '⚠️ Something went wrong during upload.';
        status.style.color = '#ff9800';
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
