import { createClient } from '@supabase/supabase-js';

// Load environment variables for Supabase (with fallbacks for runtime environments)
const rawSupabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL || '';
const supabaseUrl = rawSupabaseUrl ? rawSupabaseUrl.replace(/\/$/, '').replace(/\/rest\/v1$/, '') : '';
const rawSupabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || '';
const supabaseAnonKey = rawSupabaseAnonKey.includes('your-key-here') || rawSupabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY' ? '' : rawSupabaseAnonKey;

// Export client instance (gracefully handles empty credentials with local fallbacks)
export const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project-id'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

