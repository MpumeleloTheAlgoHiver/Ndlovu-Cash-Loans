import '/user-portal/Services/sessionGuard.js'; // Production auth guard

window.redirectToProfileForCreditCheck = async function() {
  const btn = document.querySelector('.next-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Checking profile…</span>';
  }

  try {
    const { supabase } = await import('/Services/supabaseClient.js');
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      if (btn) { btn.disabled = false; btn.innerHTML = '<span>Start Credit Check</span><i class="fas fa-arrow-right"></i>'; }
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('identity_number, surname, first_name, gender, date_of_birth, street_address, postal_code')
      .eq('id', session.user.id)
      .single();

    const requiredFields = {
      identity_number: 'ID Number',
      first_name: 'First Name',
      surname: 'Surname',
      gender: 'Gender',
      date_of_birth: 'Date of Birth',
      street_address: 'Street Address',
      postal_code: 'Postal Code'
    };

    const missing = [];
    for (const [key, label] of Object.entries(requiredFields)) {
      if (!profile || !profile[key] || String(profile[key]).trim() === '') {
        missing.push(label);
      }
    }

    if (missing.length > 0) {
      // Profile incomplete — redirect to profile
      sessionStorage.setItem('returnToCreditCheckAfterProfile', 'true');
      sessionStorage.setItem('showCreditCheckProfileToast', 'true');

      const missingList = missing.join(', ');
      if (typeof window.showToast === 'function') {
        window.showToast(
          'Profile Incomplete',
          `Please fill in the following required fields on your Profile before running Experian credit check: ${missingList}`,
          'warning'
        );
      }

      if (typeof loadPage === 'function') {
        loadPage('profile');
      } else {
        window.location.href = '/user-portal/?page=profile';
      }
    } else {
      // Profile complete — run credit check directly
      if (typeof window.showToast === 'function') {
        window.showToast('Profile Complete', 'Running Experian credit check…', 'success');
      }
      await runCreditCheckFromProfile(session, profile);
    }
  } catch (err) {
    console.error('❌ Error checking profile completeness:', err);
    if (typeof window.showToast === 'function') {
      window.showToast('Error', 'Could not verify profile. Please try again.', 'error');
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span>Start Credit Check</span><i class="fas fa-arrow-right"></i>';
    }
  }
};

// Run credit check directly using profile data (no popup)
async function runCreditCheckFromProfile(session, profile) {
  const btn = document.querySelector('.next-btn');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Running Credit Check…</span>';
  }

  try {
    const { performCreditCheck } = await import('/Services/dataService.js');
    const { supabase } = await import('/Services/supabaseClient.js');

    // Create or reuse application
    let applicationId = sessionStorage.getItem('currentApplicationId');
    if (!applicationId) {
      const { data: app, error: appError } = await supabase
        .from('loan_applications')
        .insert([{
          user_id: session.user.id,
          status: 'BUREAU_CHECKING',
          amount: 0,
          term_months: 0,
          purpose: 'Personal',
          source: 'USER_PORTAL'
        }])
        .select()
        .single();

      if (appError) throw appError;
      applicationId = app.id;
      sessionStorage.setItem('currentApplicationId', applicationId);
    }

    const userData = {
      identity_number: profile.identity_number,
      surname: profile.surname,
      forename: profile.first_name,
      gender: profile.gender,
      date_of_birth: (profile.date_of_birth || '').replace(/-/g, ''),
      address1: profile.street_address,
      postal_code: profile.postal_code
    };

    const result = await performCreditCheck(applicationId, userData);

    if (result && result.success) {
      const score = result.creditScore?.score || result.score || 0;
      sessionStorage.setItem('creditCheckPassed', 'true');
      sessionStorage.setItem('creditScore', score);

      if (typeof window.showToast === 'function') {
        window.showToast('Credit Check Passed', `Experian score: ${score}. Proceeding to loan selection.`, 'success');
      }

      // Update button to green "Continue"
      if (btn) {
        btn.innerHTML = `<i class="fas fa-check-circle"></i><span>Continue to Loan Selection (${score})</span>`;
        btn.style.background = 'linear-gradient(135deg, #1b5e20 0%, #00c853 100%)';
        btn.style.color = '#ffffff';
        btn.disabled = false;
        btn.onclick = () => {
          if (typeof loadPage === 'function') loadPage('apply-loan-3');
          else window.location.href = '/user-portal/?page=apply-loan-3';
        };
      }
    } else {
      const errMsg = result?.error || 'Unknown error';
      if (typeof window.showToast === 'function') {
        window.showToast('Credit Check Failed', errMsg, 'error');
      }
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<span>Start Credit Check</span><i class="fas fa-arrow-right"></i>';
      }
    }
  } catch (err) {
    console.error('❌ Credit check error:', err);
    if (typeof window.showToast === 'function') {
      window.showToast('Credit Check Error', err.message || 'Something went wrong. Please try again.', 'error');
    }
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span>Start Credit Check</span><i class="fas fa-arrow-right"></i>';
    }
  }
}

// Navigation function for step buttons
window.goToStep = function(step) {
  // Guard: Cannot go to step 3 without completing credit check
  if (step >= 3) {
    const creditCheckPassed = sessionStorage.getItem('creditCheckPassed');
    if (creditCheckPassed !== 'true') {
      if (typeof window.showToast === 'function') {
        window.showToast('Credit Check Required', 'Please complete your credit check before proceeding', 'warning');
      } else {
        alert('Please complete your credit check before proceeding');
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
    // If in user-portal dynamic loading
    const pageNames = {
      1: 'apply-loan',
      2: 'apply-loan-2',
      3: 'apply-loan-3',
      4: 'confirmation'
    };
    loadPage(pageNames[step]);
  } else {
    // Direct navigation
    window.location.href = pages[step];
  }
}

// Check existing credit check on page load
async function checkCreditCheckStatus() {
  try {
    const { supabase } = await import('/Services/supabaseClient.js');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return;
    
    // Check session storage
    const creditCheckPassed = sessionStorage.getItem('creditCheckPassed');
    const creditScore = sessionStorage.getItem('creditScore');
    
    // Check database
    const applicationId = sessionStorage.getItem('currentApplicationId');
    let hasExistingCheck = false;
    let existingScore = null;
    
    const { data: creditChecks, error: creditCheckError } = await supabase
      .from('credit_checks')
      .select('credit_score, status, checked_at, application_id')
      .eq('user_id', session.user.id)
      .eq('status', 'completed')
      .order('checked_at', { ascending: false })
      .limit(1);
    
    if (!creditCheckError && creditChecks && creditChecks.length > 0) {
      hasExistingCheck = true;
      existingScore = creditChecks[0].credit_score;
      if (creditChecks[0].application_id) {
        sessionStorage.setItem('currentApplicationId', creditChecks[0].application_id);
      }
    }
    
    if (!hasExistingCheck) {
      if (applicationId) {
        const { data: app, error } = await supabase
          .from('loan_applications')
          .select('bureau_score_band, status')
          .eq('id', applicationId)
          .single();
        
        if (!error && app && (app.status === 'BUREAU_OK' || app.status === 'APPROVED') && app.bureau_score_band) {
          hasExistingCheck = true;
          existingScore = app.bureau_score_band;
        }
      } else {
        const { data: recentApps, error } = await supabase
          .from('loan_applications')
          .select('bureau_score_band, status, created_at')
          .eq('user_id', session.user.id)
          .in('status', ['BUREAU_OK', 'APPROVED'])
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (!error && recentApps && recentApps.length > 0 && recentApps[0].bureau_score_band) {
          hasExistingCheck = true;
          existingScore = recentApps[0].bureau_score_band;
        }
      }
    }
    
    // Update main page button if credit check exists
    if (hasExistingCheck || creditCheckPassed === 'true') {
      const mainButton = document.querySelector('.next-btn');
      if (mainButton) {
        const score = existingScore || creditScore || 'Ready';
        mainButton.innerHTML = `
          <i class="fas fa-check-circle"></i>
          <span>Continue to Loan Selection (${score})</span>
        `;
        mainButton.style.background = 'linear-gradient(135deg, #1b5e20 0%, #00c853 100%)';
        mainButton.style.color = '#ffffff';
        mainButton.style.cursor = 'pointer';
        mainButton.disabled = false;
        mainButton.removeAttribute('aria-disabled');
        mainButton.classList.remove('button-disabled');
        mainButton.onclick = () => {
          if (typeof loadPage === 'function') {
            loadPage('apply-loan-3');
          } else {
            window.location.href = '/user-portal/?page=apply-loan-3';
          }
        };
      }
      
      // Mark step 2 as completed
      const step2 = document.querySelector('.step.active');
      if (step2) {
        step2.classList.add('completed');
      }
      
      console.log('✅ Credit check already completed');
    }
  } catch (error) {
    console.error('❌ Error checking credit status:', error);
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkCreditCheckStatus);
} else {
  checkCreditCheckStatus();
}

// Also check when page is loaded via SPA navigation
window.addEventListener('pageLoaded', (event) => {
  if (event?.detail?.pageName === 'apply-loan-2') {
    setTimeout(checkCreditCheckStatus, 100);
  }
});
