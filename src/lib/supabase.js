// ============================================================
//  SUPABASE CONFIG
//  Substitua os valores abaixo pelas suas credenciais.
//  Acesse: https://supabase.com → seu projeto → Settings → API
// ============================================================
const SUPABASE_URL = 'https://SEU_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'SUA_ANON_KEY_AQUI';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
