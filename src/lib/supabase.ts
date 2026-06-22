import { createClient } from '@supabase/supabase-js';

// Load environment variables for Supabase (with fallbacks for runtime environments)
const supabaseUrl = import.meta.env.SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || '';

// Export client instance (gracefully handles empty credentials with local fallbacks)
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
