// =============================================================================
// SUPABASE CLIENT — No hardcoded keys.
// Fetches config from /api/supabase-config at runtime.
// =============================================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm';

// Fetch Supabase credentials from the server (env vars injected there)
let supabaseUrl = '';
let supabaseAnonKey = '';

try {
  const resp = await fetch('/api/supabase-config');
  if (!resp.ok) throw new Error(`Config fetch failed: ${resp.status}`);
  const config = await resp.json();
  supabaseUrl = config.url || '';
  supabaseAnonKey = config.anonKey || '';
} catch (err) {
  console.error('Failed to load Supabase config:', err);
}

if (!supabaseUrl || !supabaseAnonKey) {
  const body = document.querySelector('body');
  if (body) {
    body.innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: sans-serif; background-color: #fff5f5; color: #c53030; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999;">
        <h1 style="font-size: 1.5rem; font-weight: bold;">Configuration Error</h1>
        <p>Supabase credentials could not be loaded. Ensure <strong>SUPABASE_URL</strong> and <strong>SUPABASE_ANON_KEY</strong> environment variables are set on the server.</p>
      </div>
    `;
  }
  throw new Error('Supabase credentials are missing! Check server env vars.');
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
