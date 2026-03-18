import { supabase } from '/Services/supabaseClient.js';

async function initBankStatementModule() {
  const status = document.getElementById('truidStatusMessage');
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
    const isManual = details.isManual === true;

    if (checkmark) checkmark.classList.add('visible');
    if (connectBtn) {
      connectBtn.disabled = true;
      connectBtn.style.opacity = '0.5';
      connectBtn.style.cursor = 'not-allowed';
      connectBtn.textContent = isManual ? 'Statement Uploaded ✓' : 'Coming Soon';
    }

    // Disable manual upload too
    const manualBtn = document.getElementById('bankstatementUploadBtn');
    const manualFile = document.getElementById('bankstatementFile');
    if (manualBtn) { manualBtn.disabled = true; manualBtn.style.opacity = '0.5'; manualBtn.style.cursor = 'not-allowed'; manualBtn.textContent = 'Uploaded ✓'; }
    if (manualFile) manualFile.disabled = true;

    if (statusChip) {
      statusChip.textContent = isManual ? 'Uploaded' : 'Pending';
      statusChip.classList.add('success');
    }

    if (existingInfo && isManual) {
      const connectedDate = new Date(details.capturedAt || details.captured_at || details.last_updated || details.updatedAt || Date.now()).toLocaleDateString();
      existingInfo.style.color = '#1f8c5c';
      existingInfo.innerHTML = `✓ Bank statement uploaded on ${connectedDate}`;
    }
  };

  // --- TruID connect button (disabled - coming soon) ---
  connectBtn.disabled = true;
  connectBtn.style.opacity = '0.5';
  connectBtn.style.cursor = 'not-allowed';
  connectBtn.textContent = 'Coming Soon';
  status.textContent = 'TruID integration coming soon. Use manual upload for now.';
  status.style.color = '#7a7a7a';

  // Check for existing manual upload
  try {
    const { checkDocumentExistsByUser } = await import('/user-portal/Services/documentService.js');
    const existingDoc = await checkDocumentExistsByUser(userId, 'bank_statement');
    if (existingDoc) {
      applyVerifiedState({ isManual: true, capturedAt: existingDoc.uploaded_at });
      status.textContent = '✅ Bank statement already uploaded.';
      status.style.color = '#28a745';
      window.dispatchEvent(new CustomEvent('document:uploaded', { detail: { fileType: 'bank_statement' } }));
      return;
    }
  } catch (err) {
    console.warn('Could not check existing manual upload:', err);
  }

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
