import { createClient } from '@supabase/supabase-js';

// Load environment variables for Supabase (with fallbacks for runtime environments)
const rawSupabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL || '';
const supabaseUrl = rawSupabaseUrl ? rawSupabaseUrl.replace(/\/$/, '').replace(/\/rest\/v1$/, '') : '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || '';

// Ensure PROD condition check doesn't accidentally trigger in dev build SSR passes when env vars aren't injected properly.
// A more robust check for missing Supabase credentials in PROD:
const isProd = import.meta.env.PROD || (typeof process !== 'undefined' && process.env.NODE_ENV === 'production');

if (isProd && (!supabaseUrl || !supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY' || supabaseUrl.includes('your-project-id'))) {
  console.warn('WARNING: Supabase credentials are required in production environments.');
}

// Export client instance (gracefully handles empty credentials with local fallbacks)
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' && !supabaseUrl.includes('your-project-id')) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
