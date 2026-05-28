// ============================================================
//  SUPABASE CONFIG
//  Substitua os valores abaixo pelas suas credenciais.
//  Acesse: https://supabase.com → seu projeto → Settings → API
// ============================================================
const SUPABASE_URL = 'https://mkbsbniaukramqzzbzpt.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_8DgFgPeAUNBgw7UgF3ZwLw_XN4hP5xM';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
