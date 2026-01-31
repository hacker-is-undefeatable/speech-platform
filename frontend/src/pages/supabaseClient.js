import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (process.env.REACT_APP_SUPABASE_URL || '').trim();
const supabaseKey = (process.env.REACT_APP_SUPABASE_ANON_KEY || '').trim();

if (process.env.NODE_ENV === 'development') {
  console.log('Supabase Init:', { 
    url: supabaseUrl, 
    keyLength: supabaseKey?.length,
    keyStart: supabaseKey?.substring(0, 5) 
  });
}

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase env vars. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in frontend/.env'
  );
}
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});