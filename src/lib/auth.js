// Estado global de autenticação
var authState = {
  user: null,
  profile: null,
  role: null,
  loading: true,
};

async function initAuth() {
  try {
    var sessionResult = await sb.auth.getSession();
    var session = sessionResult.data.session;

    if (session && session.user) {
      await loadProfile(session.user);
    } else {
      authState.loading = false;
      goTo('login');
    }

    sb.auth.onAuthStateChange(async function(event, session) {
      if (event === 'SIGNED_IN' && session && session.user) {
        await loadProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        authState = { user: null, profile: null, role: null, loading: false };
        goTo('login');
      }
    });
  } catch(e) {
    console.error('initAuth error:', e);
    goTo('login');
  }
}

async function loadProfile(user) {
  try {
    var result = await sb.from('profiles').select('*').eq('id', user.id).single();
    var profile = result.data;
    var error = result.error;

    if (error || !profile) {
      authState = { user: user, profile: null, role: null, loading: false };
      goTo('login');
      return;
    }

    authState = { user: user, profile: profile, role: profile.role, loading: false };
    redirectByRole(profile.role);
  } catch(e) {
    console.error('loadProfile error:', e);
    authState = { user: user, profile: null, role: 'cliente', loading: false };
    goTo('home');
  }
}

function redirectByRole(role) {
  if (role === 'adm')           goTo('home');
  else if (role === 'barbeiro') goTo('barberDash');
  else                          goTo('home');
}

async function doLogin(email, password) {
  try {
    var result = await sb.auth.signInWithPassword({ email: email, password: password });
    if (result.error) {
      setAuthError(getErrorMsg(result.error.message));
    }
  } catch(e) {
    setAuthError('Erro ao fazer login. Tente novamente.');
  }
}

async function doRegister(name, nick, phone, email, password, role) {
  try {
    var result = await sb.auth.signUp({ email: email, password: password });

    if (result.error) {
      setAuthError(getErrorMsg(result.error.message));
      return;
    }

    var user = result.data.user;
    var pResult = await sb.from('profiles').insert({
      id: user.id,
      name: name,
      nick: nick,
      phone: phone,
      email: email,
      role: role || 'cliente',
      avatar_url: null,
      created_at: new Date().toISOString(),
    });

    if (pResult.error) {
      setAuthError('Erro ao salvar perfil. Tente novamente.');
      return;
    }

    await loadProfile(user);
  } catch(e) {
    setAuthError('Erro ao criar conta. Tente novamente.');
  }
}

async function doLogout() {
  await sb.auth.signOut();
}

function setAuthError(msg) {
  var elLogin = document.getElementById('auth-error-login');
  var elReg   = document.getElementById('auth-error-register');
  if (elLogin) { elLogin.textContent = msg; elLogin.style.display = msg ? 'block' : 'none'; }
  if (elReg)   { elReg.textContent   = msg; elReg.style.display   = msg ? 'block' : 'none'; }
}

function getErrorMsg(msg) {
  if (!msg) return 'Erro inesperado.';
  if (msg.indexOf('Invalid login') >= 0)      return 'E-mail ou senha incorretos.';
  if (msg.indexOf('already registered') >= 0) return 'Este e-mail já está cadastrado.';
  if (msg.indexOf('Password should') >= 0)    return 'Senha deve ter no mínimo 6 caracteres.';
  return 'Erro inesperado. Tente novamente.';
}

function requireAuth() {
  if (!authState.user) { goTo('login'); return false; }
  return true;
}

function requireRole() {
  if (!requireAuth()) return false;
  var roles = Array.prototype.slice.call(arguments);
  if (roles.indexOf(authState.role) < 0) { goTo('home'); return false; }
  return true;
}