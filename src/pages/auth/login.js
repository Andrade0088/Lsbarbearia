function renderLogin() {
  var logoUrl = '/public/Logo_Ls.jpeg';

  return `
  <div class="screen active" id="screen-login" style="padding-bottom:0;">
    <div style="height:100vh;display:flex;flex-direction:column;justify-content:center;overflow:hidden;
      background:#060a10;">

      <!-- Logo -->
      <div style="text-align:center;margin-bottom:26px;">
        <img src="${logoUrl}" alt="Ls. Barbearia"
          style="width:100px;height:100px;object-fit:contain;display:block;margin:0 auto 10px;
          border-radius:50%;border:2px solid #ff1e1e;box-shadow:0 0 20px rgba(255,30,30,.35);">
        <div style="width:40px;height:2px;background:#ff1e1e;margin:8px auto 0;border-radius:2px;"></div>
      </div>

      <!-- Seletor -->
      <div id="tipo-selector" style="padding:0 20px;">
        <p style="font-size:11px;font-weight:600;letter-spacing:2px;color:rgba(255,255,255,.3);
          text-align:center;margin-bottom:16px;">SELECIONE SEU PERFIL</p>

        <div style="display:flex;flex-direction:column;gap:8px;">

          <div onclick="showLoginForm('cliente')"
            style="display:flex;align-items:center;gap:12px;padding:13px 14px;
            background:rgba(255,30,30,.08);border:0.5px solid rgba(255,30,30,.5);
            border-radius:12px;cursor:pointer;">
            <div style="width:38px;height:38px;border-radius:50%;background:#ff1e1e;
              display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">👤</div>
            <div style="flex:1;">
              <p style="font-size:14px;font-weight:600;color:white;">Cliente</p>
              <p style="font-size:11px;color:rgba(255,255,255,.4);">Agende agora</p>
            </div>
            <div style="width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,30,30,.5);
              display:flex;align-items:center;justify-content:center;">
              <span style="color:#ff1e1e;font-size:14px;">›</span>
            </div>
          </div>

          <div onclick="showLoginForm('barbeiro')"
            style="display:flex;align-items:center;gap:12px;padding:13px 14px;
            background:rgba(255,255,255,.04);border:0.5px solid rgba(255,255,255,.1);
            border-radius:12px;cursor:pointer;">
            <div style="width:38px;height:38px;border-radius:50%;background:#111827;
              border:1.5px solid #ff1e1e;
              display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">💈</div>
            <div style="flex:1;">
              <p style="font-size:14px;font-weight:600;color:white;">Barbeiro</p>
              <p style="font-size:11px;color:rgba(255,255,255,.4);">Ver agenda</p>
            </div>
            <div style="width:28px;height:28px;border-radius:50%;border:1px solid rgba(255,255,255,.15);
              display:flex;align-items:center;justify-content:center;">
              <span style="color:rgba(255,255,255,.4);font-size:14px;">›</span>
            </div>
          </div>

          <div onclick="showLoginForm('adm')"
            style="display:flex;align-items:center;gap:12px;padding:13px 14px;
            background:rgba(201,168,76,.06);border:0.5px solid rgba(201,168,76,.4);
            border-radius:12px;cursor:pointer;">
            <div style="width:38px;height:38px;border-radius:50%;background:#2d1b00;
              border:1.5px solid #C9A84C;
              display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">👑</div>
            <div style="flex:1;">
              <p style="font-size:14px;font-weight:600;color:#C9A84C;">ADM</p>
              <p style="font-size:11px;color:rgba(255,255,255,.4);">Painel admin</p>
            </div>
            <div style="width:28px;height:28px;border-radius:50%;border:1px solid rgba(201,168,76,.4);
              display:flex;align-items:center;justify-content:center;">
              <span style="color:#C9A84C;font-size:14px;">›</span>
            </div>
          </div>

        </div>
      </div>

      <!-- Formulário LOGIN -->
      <div id="form-login" style="display:none;padding:0 20px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
          <button onclick="voltarSelector()"
            style="background:none;border:none;color:#ff1e1e;font-size:22px;cursor:pointer;">←</button>
          <p id="login-tipo-label" style="font-size:15px;font-weight:700;color:white;"></p>
        </div>

        <div style="margin-bottom:14px;">
          <label style="font-size:12px;font-weight:600;color:rgba(255,255,255,.4);letter-spacing:.5px;">E-MAIL</label>
          <input id="login-email" type="email" placeholder="seu@email.com"
            style="width:100%;margin-top:6px;padding:14px 16px;background:#0d1329;
            border:1px solid rgba(255,255,255,.1);border-radius:12px;color:white;font-size:14px;outline:none;">
        </div>
        <div style="margin-bottom:8px;">
          <label style="font-size:12px;font-weight:600;color:rgba(255,255,255,.4);letter-spacing:.5px;">SENHA</label>
          <input id="login-password" type="password" placeholder="••••••••"
            style="width:100%;margin-top:6px;padding:14px 16px;background:#0d1329;
            border:1px solid rgba(255,255,255,.1);border-radius:12px;color:white;font-size:14px;outline:none;">
        </div>
        <p style="text-align:right;font-size:12px;color:#ff1e1e;margin-bottom:18px;cursor:pointer;">Esqueci a senha</p>

        <div id="auth-error-login" style="display:none;background:rgba(255,30,30,.1);
          border:1px solid rgba(255,30,30,.3);border-radius:10px;padding:12px;
          font-size:13px;color:#ff6666;margin-bottom:14px;text-align:center;"></div>

        <button id="auth-btn-login" onclick="handleLogin()"
          style="width:100%;padding:16px;border:none;border-radius:12px;
          background:linear-gradient(90deg,#ff1e1e,#0d47ff);color:white;
          font-size:15px;font-weight:700;cursor:pointer;letter-spacing:.5px;">
          ENTRAR
        </button>

        <div id="register-link" style="display:none;text-align:center;margin-top:16px;">
          <p style="font-size:12px;color:rgba(255,255,255,.4);">
            Não tem conta?
            <span onclick="showRegisterForm()"
              style="color:#ff1e1e;cursor:pointer;font-weight:700;">Criar conta</span>
          </p>
        </div>
      </div>

      <!-- CADASTRO -->
      <div id="form-register" style="display:none;padding:0 20px;overflow-y:auto;max-height:70vh;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
          <button onclick="showLoginForm('cliente')"
            style="background:none;border:none;color:#ff1e1e;font-size:22px;cursor:pointer;">←</button>
          <p style="font-size:15px;font-weight:700;color:white;">Criar conta — Cliente</p>
        </div>

        <input id="reg-name" type="text" placeholder="Nome completo *"
          style="width:100%;margin-bottom:10px;padding:14px 16px;background:#0d1329;border:1px solid rgba(255,255,255,.1);border-radius:12px;color:white;font-size:14px;outline:none;">
        <input id="reg-nick" type="text" placeholder="Apelido (ex: @joaosilva)"
          style="width:100%;margin-bottom:10px;padding:14px 16px;background:#0d1329;border:1px solid rgba(255,255,255,.1);border-radius:12px;color:white;font-size:14px;outline:none;">
        <input id="reg-phone" type="tel" placeholder="WhatsApp (11) 99999-9999"
          style="width:100%;margin-bottom:10px;padding:14px 16px;background:#0d1329;border:1px solid rgba(255,255,255,.1);border-radius:12px;color:white;font-size:14px;outline:none;">
        <input id="reg-email" type="email" placeholder="E-mail *"
          style="width:100%;margin-bottom:10px;padding:14px 16px;background:#0d1329;border:1px solid rgba(255,255,255,.1);border-radius:12px;color:white;font-size:14px;outline:none;">
        <input id="reg-password" type="password" placeholder="Senha (mín. 6 caracteres) *"
          style="width:100%;margin-bottom:10px;padding:14px 16px;background:#0d1329;border:1px solid rgba(255,255,255,.1);border-radius:12px;color:white;font-size:14px;outline:none;">
        <input id="reg-password2" type="password" placeholder="Confirmar senha *"
          style="width:100%;margin-bottom:14px;padding:14px 16px;background:#0d1329;border:1px solid rgba(255,255,255,.1);border-radius:12px;color:white;font-size:14px;outline:none;">

        <div id="auth-error-register" style="display:none;background:rgba(255,30,30,.1);
          border:1px solid rgba(255,30,30,.3);border-radius:10px;padding:12px;
          font-size:13px;color:#ff6666;margin-bottom:14px;text-align:center;"></div>

        <button id="auth-btn-register" onclick="handleRegister()"
          style="width:100%;padding:16px;border:none;border-radius:12px;
          background:linear-gradient(90deg,#ff1e1e,#0d47ff);color:white;
          font-size:15px;font-weight:700;cursor:pointer;">
          CRIAR CONTA
        </button>
        <div style="height:20px;"></div>
      </div>

    </div>
  </div>`;
}

function showLoginForm(tipo) {
  document.getElementById('tipo-selector').style.display = 'none';
  document.getElementById('form-register').style.display = 'none';
  document.getElementById('form-login').style.display = 'block';
  var labels = { cliente:'👤 Entrar como Cliente', barbeiro:'💈 Entrar como Barbeiro', adm:'👑 Entrar como ADM' };
  document.getElementById('login-tipo-label').textContent = labels[tipo] || 'Entrar';
  var regLink = document.getElementById('register-link');
  if (regLink) regLink.style.display = tipo === 'cliente' ? 'block' : 'none';
  var errEl = document.getElementById('auth-error-login');
  if (errEl) errEl.style.display = 'none';
}

function showRegisterForm() {
  document.getElementById('form-login').style.display = 'none';
  document.getElementById('form-register').style.display = 'block';
}

function voltarSelector() {
  document.getElementById('form-login').style.display = 'none';
  document.getElementById('form-register').style.display = 'none';
  document.getElementById('tipo-selector').style.display = 'block';
}

function handleLogin() {
  var email    = document.getElementById('login-email').value.trim();
  var password = document.getElementById('login-password').value;
  var errEl    = document.getElementById('auth-error-login');
  var btn      = document.getElementById('auth-btn-login');
  errEl.style.display = 'none';
  if (!email || !password) { errEl.textContent = 'Preencha e-mail e senha.'; errEl.style.display = 'block'; return; }
  btn.disabled = true; btn.textContent = 'Aguarde...';
  doLogin(email, password).finally(function() { btn.disabled = false; btn.textContent = 'ENTRAR'; });
}

function handleRegister() {
  var name  = document.getElementById('reg-name').value.trim();
  var nick  = document.getElementById('reg-nick').value.trim();
  var phone = document.getElementById('reg-phone').value.trim();
  var email = document.getElementById('reg-email').value.trim();
  var pass  = document.getElementById('reg-password').value;
  var pass2 = document.getElementById('reg-password2').value;
  var errEl = document.getElementById('auth-error-register');
  var btn   = document.getElementById('auth-btn-register');
  errEl.style.display = 'none';
  if (!name || !email || !pass) { errEl.textContent = 'Preencha todos os campos obrigatórios.'; errEl.style.display = 'block'; return; }
  if (pass !== pass2) { errEl.textContent = 'As senhas não coincidem.'; errEl.style.display = 'block'; return; }
  if (pass.length < 6) { errEl.textContent = 'Senha deve ter no mínimo 6 caracteres.'; errEl.style.display = 'block'; return; }
  btn.disabled = true; btn.textContent = 'Criando conta...';
  doRegister(name, nick, phone, email, pass, 'cliente').finally(function() { btn.disabled = false; btn.textContent = 'CRIAR CONTA'; });
}