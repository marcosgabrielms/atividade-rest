const { createClient } = require('@supabase/supabase-js');
module.exports = function createSupabase() {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) throw new Error('Configure SUPABASE_URL e SUPABASE_ANON_KEY no .env.');
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
};
