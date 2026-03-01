// =============================================================================
// ADMIN SUPABASE CLIENT
// In production (Vite build): import.meta.env.VITE_* vars are baked in at build
// time — set them in your Vercel dashboard.
// In source-fallback mode: This file is served dynamically by server.js with
// env vars injected — do NOT hardcode any keys here.
// =============================================================================

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm';

// Vite build injects import.meta.env.VITE_* at compile time.
// In source-fallback mode the Express dynamic route replaces this file entirely.
const supabaseUrl = import.meta?.env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta?.env?.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('YOUR_SUPABASE_URL')) {
    const body = document.querySelector('body');
    if (body) {
        body.innerHTML = `
            <div style="padding: 2rem; text-align: center; font-family: sans-serif; background-color: #fff5f5; color: #c53030; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999;">
                <h1 style="font-size: 1.5rem; font-weight: bold;">Configuration Error</h1>
                <p>Supabase credentials are not configured. Set <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> environment variables.</p>
            </div>
        `;
    }
    throw new Error("Supabase credentials are missing! Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY env vars.");
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
      console.log('Admin session expired - redirecting to login');
      window.location.replace('/auth/login.html');
    }
  }
});
