import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm';

// Fetch public config from server — no hardcoded keys
const config = await fetch('/api/config').then(r => r.json());
const supabaseUrl = config.supabaseUrl;
const supabaseAnonKey = config.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
    const body = document.querySelector('body');
    if (body) {
        body.innerHTML = `
            <div style="padding: 2rem; text-align: center; font-family: sans-serif; background-color: #fff5f5; color: #c53030; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 9999;">
                <h1 style="font-size: 1.5rem; font-weight: bold;">Configuration Error</h1>
                <p>Could not load Supabase config from the server. Check that SUPABASE_URL and SUPABASE_ANON_KEY environment variables are set.</p>
            </div>
        `;
    }
    throw new Error('Supabase credentials could not be loaded from /api/config');
}

// Create and export the Supabase client with session-only storage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.sessionStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

if (typeof window !== 'undefined') {
  window.supabase = supabase;
}

export default { supabase };

// Global auth state listener — logs out admin if session becomes invalid
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
    if (!window.location.pathname.includes('/auth/login')) {
      console.log('🔒 Admin session expired — redirecting to login');
      window.location.replace('/auth/login.html');
    }
  }
});
