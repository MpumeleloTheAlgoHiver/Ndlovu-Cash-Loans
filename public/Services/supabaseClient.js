// =============================================================================
// THIS FILE IS SERVED DYNAMICALLY BY server.js WITH ENV VARS INJECTED.
// Do NOT hardcode any Supabase URL or key here.
// If you see a "Configuration Error" in the browser, the Express dynamic
// route (/Services/supabaseClient.js) is not being hit — check server.js.
// =============================================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm';

// Values injected at runtime by Express — leave empty here.
const supabaseUrl = '';
const supabaseAnonKey = '';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('YOUR_SUPABASE_URL')) {
    const body = document.querySelector('body');
    if (body) {
        body.innerHTML = `
            <div style="padding: 2rem; text-align: center; font-family: sans-serif; background-color: #fff5f5; color: #c53030; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999;">
                <h1 style="font-size: 1.5rem; font-weight: bold;">Configuration Error</h1>
                <p>Supabase credentials are not configured. Set <strong>SUPABASE_URL</strong> and <strong>SUPABASE_ANON_KEY</strong> environment variables.</p>
            </div>
        `;
    }
    throw new Error("Supabase credentials are missing! Set SUPABASE_URL and SUPABASE_ANON_KEY env vars.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.sessionStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
    if (!window.location.pathname.includes('/auth/login')) {
      console.log('Session expired or invalidated - redirecting to login');
      window.location.replace('/auth/login.html');
    }
  }
});
