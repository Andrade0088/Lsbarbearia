function renderLogin() {
  return `
  <div class="screen active" id="screen-login" style="padding-bottom:0;">
    <div style="height:100vh;display:flex;flex-direction:column;justify-content:center;overflow:hidden;
      background:linear-gradient(160deg,#050816 60%,rgba(255,30,30,.12) 100%);">

      <!-- Logo -->
      <div style="text-align:center;padding:0 24px 32px;">
        <div style="font-size:11px;letter-spacing:5px;color:rgba(255,255,255,.35);margin-bottom:8px;">✦ BARBEARIA ✦</div>
        <h1 style="font-size:36px;font-weight:800;letter-spacing:4px;color:#fff;">LS<span style="color:#ff1e1e;">BARBEARIA</span></h1>
        <p style="font-size:13px;color:var(--text-muted);margin-top:8px;">Seu estilo, sua atitude.</p>
      </div>

      <!-- Tabs login/cadastro -->
      <div style="display:flex;margin:0 24px 24px;background:var(--card);border-radius:12px;padding:4px;">
        <button id="tab-login" onclick="switchAuthTab('login')"
          style="flex:1;padding:10px;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;
          background:linear-gradient(90deg,var(--red),var(--blue));color:white;transition:.2s;">
          Entrar
        </button>
        <button id="tab-register" onclick="switchAuthTab('register')"
          style="flex:1;padding:10px;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;
          background:transparent;color:var(--text-muted);transition:.2s;">
          Criar conta
        </button>
      </div>

      <!-- Formulário LOGIN -->
      <div id="form-login" style="padding:0 24px;">
        <div style="margin-bottom:16px;">
          <label style="font-size:12px;font-weight:600;color:var(--text-muted);letter-spacing:.5px;">E-MAIL</label>
          <input id="login-email" type="email" placeholder="seu@email.com"
            style="width:100%;margin-top:6px;padding:14px 16px;background:var(--card);border:1px solid rgba(255,255,255,.1);
            border-radius:12px;color:white;font-size:14px;outline:none;">
        </div>
        <div style="margin-bottom:8px;">
          <label style="font-size:12px;font-weight:600;color:var(--text-muted);letter-spacing:.5px;">SENHA</label>
          <input id="login-password" type="password" placeholder="••••••••"
            style="width:100%;margin-top:6px;padding:14px 16px;background:var(--card);border:1px solid rgba(255,255,255,.1);
            border-radius:12px;color:white;font-size:14px;outline:none;">
        </div>
        <p style="text-align:right;font-size:12px;color:var(--red);margin-bottom:20px;cursor:pointer;">Esqueci a senha</p>

        <div id="auth-error-login" style="display:none;background:rgba(255,30,30,.1);border:1px solid rgba(255,30,30,.3);
          border-radius:10px;padding:12px;font-size:13px;color:#ff6666;margin-bottom:16px;text-align:center;"></div>

        <button id="auth-btn-login" onclick="handleLogin()" class="btn">ENTRAR</button>

        <p style="text-align:center;font-size:12px;color:var(--text-muted);margin-top:20px;">
          Não tem conta? <span style="color:var(--red);cursor:pointer;font-weight:600;" onclick="switchAuthTab('register')">Cadastre-se</span>
        </p>
      </div>

      <!-- Formulário CADASTRO (apenas clientes) -->
      <div id="form-register" style="display:none;padding:0 24px;overflow-y:auto;max-height:70vh;">

        <div style="background:rgba(255,30,30,.08);border:1px solid rgba(255,30,30,.2);border-radius:12px;
          padding:12px 16px;margin-bottom:20px;display:flex;align-items:center;gap:10px;">
          <span style="font-size:20px;">👤</span>
          <div>
            <p style="font-size:13px;font-weight:700;">Cadastro de Cliente</p>
            <p style="font-size:11px;color:var(--text-muted);margin-top:2px;">Barbeiros são cadastrados pelo administrador</p>
          </div>
        </div>

        <input id="reg-name" type="text" placeholder="Nome completo *"
          style="width:100%;margin-bottom:12px;padding:14px 16px;background:var(--card);border:1px solid rgba(255,255,255,.1);
          border-radius:12px;color:white;font-size:14px;outline:none;">

        <input id="reg-nick" type="text" placeholder="Apelido (ex: @joaosilva)"
          style="width:100%;margin-bottom:12px;padding:14px 16px;background:var(--card);border:1px solid rgba(255,255,255,.1);
          border-radius:12px;color:white;font-size:14px;outline:none;">

        <input id="reg-phone" type="tel" placeholder="WhatsApp (11) 99999-9999"
          style="width:100%;margin-bottom:12px;padding:14px 16px;background:var(--card);border:1px solid rgba(255,255,255,.1);
          border-radius:12px;color:white;font-size:14px;outline:none;">

        <input id="reg-email" type="email" placeholder="E-mail *"
          style="width:100%;margin-bottom:12px;padding:14px 16px;background:var(--card);border:1px solid rgba(255,255,255,.1);
          border-radius:12px;color:white;font-size:14px;outline:none;">

        <input id="reg-password" type="password" placeholder="Senha (mín. 6 caracteres) *"
          style="width:100%;margin-bottom:12px;padding:14px 16px;background:var(--card);border:1px solid rgba(255,255,255,.1);
          border-radius:12px;color:white;font-size:14px;outline:none;">

        <input id="reg-password2" type="password" placeholder="Confirmar senha *"
          style="width:100%;margin-bottom:16px;padding:14px 16px;background:var(--card);border:1px solid rgba(255,255,255,.1);
          border-radius:12px;color:white;font-size:14px;outline:none;">

        <div id="auth-error-register" style="display:none;background:rgba(255,30,30,.1);border:1px solid rgba(255,30,30,.3);
          border-radius:10px;padding:12px;font-size:13px;color:#ff6666;margin-bottom:16px;text-align:center;"></div>

        <button id="auth-btn-register" onclick="handleRegister()" class="btn">CRIAR CONTA</button>

        <p style="text-align:center;font-size:12px;color:var(--text-muted);margin-top:16px;margin-bottom:20px;">
          Já tem conta? <span style="color:var(--red);cursor:pointer;font-weight:600;" onclick="switchAuthTab('login')">Entrar</span>
        </p>
      </div>

    </div>
  </div>`;
}

function switchAuthTab(tab) {
  const isLogin = tab === 'login';
  document.getElementById('form-login').style.display    = isLogin ? 'block' : 'none';
  document.getElementById('form-register').style.display = isLogin ? 'none'  : 'block';
  document.getElementById('tab-login').style.background    = isLogin ? 'linear-gradient(90deg,var(--red),var(--blue))' : 'transparent';
  document.getElementById('tab-login').style.color         = isLogin ? 'white' : 'var(--text-muted)';
  document.getElementById('tab-register').style.background = isLogin ? 'transparent' : 'linear-gradient(90deg,var(--red),var(--blue))';
  document.getElementById('tab-register').style.color      = isLogin ? 'var(--text-muted)' : 'white';
}

function handleLogin() {
  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl    = document.getElementById('auth-error-login');
  const btn      = document.getElementById('auth-btn-login');

  errEl.style.display = 'none';
  if (!email || !password) { errEl.textContent = 'Preencha e-mail e senha.'; errEl.style.display = 'block'; return; }

  btn.disabled = true; btn.textContent = 'Aguarde...';
  doLogin(email, password).finally(() => { btn.disabled = false; btn.textContent = 'ENTRAR'; });
}

function handleRegister() {
  const name  = document.getElementById('reg-name').value.trim();
  const nick  = document.getElementById('reg-nick').value.trim();
  const phone = document.getElementById('reg-phone').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass  = document.getElementById('reg-password').value;
  const pass2 = document.getElementById('reg-password2').value;
  const errEl = document.getElementById('auth-error-register');
  const btn   = document.getElementById('auth-btn-register');

  errEl.style.display = 'none';
  if (!name || !email || !pass) { errEl.textContent = 'Preencha todos os campos obrigatórios.'; errEl.style.display = 'block'; return; }
  if (pass !== pass2)           { errEl.textContent = 'As senhas não coincidem.'; errEl.style.display = 'block'; return; }
  if (pass.length < 6)          { errEl.textContent = 'Senha deve ter no mínimo 6 caracteres.'; errEl.style.display = 'block'; return; }

  btn.disabled = true; btn.textContent = 'Criando conta...';
  doRegister(name, nick, phone, email, pass, 'cliente').finally(() => { btn.disabled = false; btn.textContent = 'CRIAR CONTA'; });
}