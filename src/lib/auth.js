// Estado global de autenticação
let authState = {
  user: null,       // objeto do Supabase Auth
  profile: null,    // linha da tabela profiles
  role: null,       // 'cliente' | 'barbeiro' | 'adm'
  loading: true,
};

// Inicializa sessão ao carregar o app
async function initAuth() {
  showLoadingScreen();

  const { data: { session } } = await sb.auth.getSession();

  if (session?.user) {
    await loadProfile(session.user);
  } else {
    authState.loading = false;
    goTo('login');
  }

  // Listener para mudanças de sessão (login/logout)
  sb.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session?.user) {
      await loadProfile(session.user);
    } else if (event === 'SIGNED_OUT') {
      authState = { user: null, profile: null, role: null, loading: false };
      goTo('login');
    }
  });
}

async function loadProfile(user) {
  const { data: profile, error } = await sb
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !profile) {
    // Perfil ainda não existe → vai para completar cadastro
    authState = { user, profile: null, role: null, loading: false };
    goTo('completarCadastro');
    return;
  }

  authState = { user, profile, role: profile.role, loading: false };
  redirectByRole(profile.role);
}

function redirectByRole(role) {
  if (role === 'adm')      goTo('home');
  else if (role === 'barbeiro') goTo('barberDash');
  else                     goTo('home');
}

// ─── Login ────────────────────────────────────────────────
async function doLogin(email, password) {
  setAuthError('');
  setAuthLoading(true);

  const { error } = await sb.auth.signInWithPassword({ email, password });

  setAuthLoading(false);
  if (error) setAuthError(getErrorMsg(error.message));
}

// ─── Cadastro ─────────────────────────────────────────────
async function doRegister(name, nick, phone, email, password, role) {
  setAuthError('');
  setAuthLoading(true);

  const { data, error } = await sb.auth.signUp({ email, password });

  if (error) {
    setAuthLoading(false);
    setAuthError(getErrorMsg(error.message));
    return;
  }

  // Cria perfil na tabela profiles
  const { error: pErr } = await sb.from('profiles').insert({
    id: data.user.id,
    name,
    nick,
    phone,
    email,
    role,          // 'cliente' | 'barbeiro'  (adm só via SQL)
    avatar_url: null,
    created_at: new Date().toISOString(),
  });

  setAuthLoading(false);
  if (pErr) {
    setAuthError('Erro ao salvar perfil. Tente novamente.');
    return;
  }

  // Supabase envia e-mail de confirmação; enquanto isso, carrega perfil
  await loadProfile(data.user);
}

// ─── Logout ───────────────────────────────────────────────
async function doLogout() {
  await sb.auth.signOut();
}

// ─── Helpers ──────────────────────────────────────────────
function showLoadingScreen() {
  const app = document.getElementById('app');
  if (app) app.innerHTML = `
    <div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#050816;gap:16px;">
      <div style="font-size:32px;font-weight:800;letter-spacing:4px;color:white;">LS<span style="color:#ff1e1e;">BARBEARIA</span></div>
      <div style="width:36px;height:36px;border:3px solid rgba(255,255,255,.1);border-top-color:#ff1e1e;border-radius:50%;animation:spin .7s linear infinite;"></div>
    </div>
    <style>@keyframes spin{to{transform:rotate(360deg)}}</style>`;
}

function setAuthError(msg) {
  const el = document.getElementById('auth-error');
  if (el) { el.textContent = msg; el.style.display = msg ? 'block' : 'none'; }
}

function setAuthLoading(on) {
  const btn = document.getElementById('auth-btn');
  if (btn) { btn.disabled = on; btn.textContent = on ? 'Aguarde...' : btn.dataset.label; }
}

function getErrorMsg(msg) {
  if (msg.includes('Invalid login')) return 'E-mail ou senha incorretos.';
  if (msg.includes('already registered')) return 'Este e-mail já está cadastrado.';
  if (msg.includes('Password should')) return 'Senha deve ter no mínimo 6 caracteres.';
  return 'Erro inesperado. Tente novamente.';
}

// Guard — chama no início de páginas protegidas
function requireAuth() {
  if (!authState.user) { goTo('login'); return false; }
  return true;
}

function requireRole(...roles) {
  if (!requireAuth()) return false;
  if (!roles.includes(authState.role)) { goTo('home'); return false; }
  return true;
}
