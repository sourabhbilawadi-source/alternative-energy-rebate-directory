import { createClient } from '@supabase/supabase-js';

// Load environment variables for Supabase (with fallbacks for runtime environments)
const rawSupabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL || 'https://mffagpmmcmgqoxhianuw.supabase.co';
const supabaseUrl = rawSupabaseUrl ? rawSupabaseUrl.replace(/\/$/, '') : '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || 'sb_publishable_wq9tVg2g0375cPcmKLzb9A_ZpesJaUZ';

// Export client instance (gracefully handles empty credentials with local fallbacks)
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' && !supabaseUrl.includes('your-project-id')) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

