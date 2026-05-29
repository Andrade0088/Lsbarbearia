function renderPerfilBarbeiro() {
  if (!requireRole('barbeiro','adm')) return '<div class="screen" id="screen-perfilBarbeiro"></div>';

  var p = authState.profile || {};
  var name   = p.name || 'Barbeiro';
  var nick   = p.nick || '';
  var email  = p.email || (authState.user ? authState.user.email : '');
  var avatar = p.avatar_url || null;

  var avatarHtml = avatar
    ? '<img src="' + avatar + '" style="width:88px;height:88px;border-radius:50%;border:4px solid var(--red);object-fit:cover;margin:0 auto 14px;display:block;">'
    : '<div style="width:88px;height:88px;border-radius:50%;border:4px solid var(--red);background:linear-gradient(135deg,var(--red),var(--blue));display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;color:white;margin:0 auto 14px;">' + name.charAt(0).toUpperCase() + '</div>';

  return `
  <div class="screen" id="screen-perfilBarbeiro">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('barberDash')">←</button>
      <span class="page-title">MEU PERFIL</span>
      <span style="width:24px"></span>
    </div>

    <div style="background:linear-gradient(160deg,#0d0014 0%,#1a0000 50%,#050816 100%);padding:30px 24px;text-align:center;">
      ${avatarHtml}
      <div style="font-size:20px;font-weight:700;">${name}</div>
      <div style="color:var(--text-muted);font-size:13px;margin-top:4px;">${email}</div>
      ${nick ? '<div style="font-size:13px;color:var(--red);margin-top:4px;">' + nick + '</div>' : ''}
      <span style="display:inline-block;background:rgba(255,30,30,.15);color:var(--red);font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;border:1px solid rgba(255,30,30,.3);margin-top:8px;">💈 Barbeiro</span>
    </div>

    <div style="padding:0 20px 20px;margin-top:8px;">

      <div onclick="goTo('escala')" style="display:flex;align-items:center;justify-content:space-between;padding:15px 0;border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer;">
        <div style="display:flex;align-items:center;gap:14px;">
          <span style="font-size:18px;width:34px;text-align:center;">📅</span>
          <div>
            <span style="font-size:14px;font-weight:600;">Minha Escala</span>
            <p style="font-size:11px;color:var(--text-muted);margin-top:2px;">Dias e horários de atendimento</p>
          </div>
        </div>
        <span style="color:rgba(255,255,255,.25);">›</span>
      </div>

      <div onclick="goTo('ganhos')" style="display:flex;align-items:center;justify-content:space-between;padding:15px 0;border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer;">
        <div style="display:flex;align-items:center;gap:14px;">
          <span style="font-size:18px;width:34px;text-align:center;">💰</span>
          <div>
            <span style="font-size:14px;font-weight:600;">Meus Ganhos</span>
            <p style="font-size:11px;color:var(--text-muted);margin-top:2px;">Dia, semana, mês e ano</p>
          </div>
        </div>
        <span style="color:rgba(255,255,255,.25);">›</span>
      </div>

      <div onclick="goTo('editarPerfil')" style="display:flex;align-items:center;justify-content:space-between;padding:15px 0;border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer;">
        <div style="display:flex;align-items:center;gap:14px;">
          <span style="font-size:18px;width:34px;text-align:center;">✏️</span>
          <span style="font-size:14px;font-weight:600;">Editar Perfil</span>
        </div>
        <span style="color:rgba(255,255,255,.25);">›</span>
      </div>

      <div onclick="goTo('comanda')" style="display:flex;align-items:center;justify-content:space-between;padding:15px 0;border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer;">
        <div style="display:flex;align-items:center;gap:14px;">
          <span style="font-size:18px;width:34px;text-align:center;">🍺</span>
          <div>
            <span style="font-size:14px;font-weight:600;">Abrir Comanda</span>
            <p style="font-size:11px;color:var(--text-muted);margin-top:2px;">Bebidas e sinuca</p>
          </div>
        </div>
        <span style="color:rgba(255,255,255,.25);">›</span>
      </div>

      <div onclick="doLogout()" style="display:flex;align-items:center;justify-content:space-between;padding:15px 0;cursor:pointer;">
        <div style="display:flex;align-items:center;gap:14px;">
          <span style="font-size:18px;width:34px;text-align:center;">🚪</span>
          <span style="font-size:14px;font-weight:500;color:#ff4444;">Sair</span>
        </div>
        <span style="color:#ff4444;">›</span>
      </div>

    </div>
  </div>`;
}