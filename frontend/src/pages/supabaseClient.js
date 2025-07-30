import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ozrdbeqrbtqjeetettxw.supabase.co'; // Replace with your Supabase project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96cmRiZXFyYnRxamVldGV0dHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNTA1NTgsImV4cCI6MjA2NjgyNjU1OH0.iHlb59d7FkFb-uXXnAsi7b_U0D9XrGGh30gA116UfWs';
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});