// =============================================================================
// ADMIN SUPABASE CLIENT — No hardcoded keys.
// Vite build: import.meta.env.VITE_* are baked in at compile time.
// Source-fallback / non-Vite: fetches config from /api/supabase-config.
// =============================================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm';

// 1. Try Vite env vars first (available in built bundles)
let supabaseUrl = import.meta?.env?.VITE_SUPABASE_URL || '';
let supabaseAnonKey = import.meta?.env?.VITE_SUPABASE_ANON_KEY || '';

// 2. If Vite env vars aren't available (source-fallback mode), fetch from server
if (!supabaseUrl || !supabaseAnonKey) {
  try {
    const resp = await fetch('/api/supabase-config');
    if (!resp.ok) throw new Error(`Config fetch failed: ${resp.status}`);
    const config = await resp.json();
    supabaseUrl = config.url || '';
    supabaseAnonKey = config.anonKey || '';
  } catch (err) {
    console.error('Failed to load Supabase config:', err);
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing! Check VITE_SUPABASE_URL / SUPABASE_URL env vars.');
  const body = document.querySelector('body');
  if (body) {
    body.innerHTML = `
      <div style="padding: 2rem; text-align: center; font-family: sans-serif; background-color: #fff5f5; color: #c53030; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999;">
        <h1 style="font-size: 1.5rem; font-weight: bold;">Configuration Error</h1>
        <p>Supabase credentials could not be loaded. Set <strong>VITE_SUPABASE_URL</strong> + <strong>VITE_SUPABASE_ANON_KEY</strong> (Vite build) or <strong>SUPABASE_URL</strong> + <strong>SUPABASE_ANON_KEY</strong> (server env).</p>
      </div>
    `;
  }
}

// Always export — even if credentials failed, so importing modules don't crash.
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: window.sessionStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;

if (supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
      if (!window.location.pathname.includes('/auth/login')) {
        console.log('Admin session expired - redirecting to login');
        window.location.replace('/auth/login.html');
      }
    }
  });
}
