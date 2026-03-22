import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file. The application will not function correctly without connecting to your Supabase project.');
}

export const supabase = createClient(
  supabaseUrl || 'http://localhost:54321', // Fallbacks to prevent instant crashing on boot if env vars are missing
  supabaseAnonKey || 'public-anon-key'
);
