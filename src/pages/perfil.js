function renderPerfil() {
  if (!requireAuth()) return '<div class="screen" id="screen-perfil"></div>';

  var p = authState.profile || {};
  var name   = p.name     || 'Usuário';
  var email  = p.email    || (authState.user ? authState.user.email : '');
  var nick   = p.nick     || '';
  var phone  = p.phone    || '';
  var avatar = p.avatar_url || null;

  var avatarHtml = avatar
    ? '<img class="avatar" src="' + avatar + '" alt="Avatar" style="width:88px;height:88px;border-radius:50%;border:4px solid var(--red);object-fit:cover;margin:0 auto 14px;display:block;box-shadow:0 0 22px rgba(255,30,30,.4);">'
    : '<div class="avatar" style="width:88px;height:88px;border-radius:50%;border:4px solid var(--red);background:linear-gradient(135deg,var(--red),var(--blue));display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;color:white;margin:0 auto 14px;">' + name.charAt(0).toUpperCase() + '</div>';

  var isBarbeiro = authState.role === 'barbeiro' || authState.role === 'adm';

  return `
  <div class="screen" id="screen-perfil">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('home')">←</button>
      <span class="page-title">PERFIL</span>
      <span style="width:24px"></span>
    </div>

    <div style="background:linear-gradient(160deg,#0d0014 0%,#1a0000 50%,#050816 100%);padding:30px 24px;text-align:center;">
      ${avatarHtml}
      <div style="font-size:21px;font-weight:700;">${name}</div>
      <div style="color:var(--text-muted);font-size:13px;margin-top:4px;">${email}</div>
      ${nick ? '<div style="font-size:13px;color:var(--red);margin-top:4px;">' + nick + '</div>' : ''}
      ${phone ? '<div style="font-size:12px;color:var(--text-muted);margin-top:4px;">📱 ' + phone + '</div>' : ''}
    </div>

    <!-- Próximo agendamento -->
    <div style="margin:18px 20px;">
      <div style="background:var(--card);border-radius:16px;padding:16px;border:1px solid rgba(255,30,30,.25);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <span style="font-size:11px;font-weight:700;letter-spacing:.5px;color:var(--text-muted);">PRÓXIMO AGENDAMENTO</span>
          <span onclick="goTo('meusAgendamentos')" style="color:var(--red);font-size:12px;cursor:pointer;font-weight:600;">Ver todos</span>
        </div>
        <div id="booking-content">
          <div style="text-align:center;padding:10px;color:var(--text-muted);font-size:13px;">Carregando...</div>
        </div>
      </div>
    </div>

    <!-- Menu -->
    <div style="padding:0 20px 20px;">

      <div onclick="goTo('meusAgendamentos')" style="display:flex;align-items:center;justify-content:space-between;padding:15px 0;border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer;">
        <div style="display:flex;align-items:center;gap:14px;">
          <span style="font-size:18px;width:34px;text-align:center;">📋</span>
          <span style="font-size:14px;font-weight:500;">Meus agendamentos</span>
        </div>
        <span style="color:rgba(255,255,255,.25);">›</span>
      </div>

      <div onclick="goTo('avaliacoes')" style="display:flex;align-items:center;justify-content:space-between;padding:15px 0;border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer;">
        <div style="display:flex;align-items:center;gap:14px;">
          <span style="font-size:18px;width:34px;text-align:center;">⭐</span>
          <span style="font-size:14px;font-weight:500;">Avaliar barbeiro</span>
        </div>
        <span style="color:rgba(255,255,255,.25);">›</span>
      </div>

      <div onclick="goTo('editarPerfil')" style="display:flex;align-items:center;justify-content:space-between;padding:15px 0;border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer;">
        <div style="display:flex;align-items:center;gap:14px;">
          <span style="font-size:18px;width:34px;text-align:center;">✏️</span>
          <span style="font-size:14px;font-weight:500;">Editar perfil</span>
        </div>
        <span style="color:rgba(255,255,255,.25);">›</span>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;padding:15px 0;border-bottom:1px solid rgba(255,255,255,.05);">
        <div style="display:flex;align-items:center;gap:14px;">
          <span style="font-size:18px;width:34px;text-align:center;">💳</span>
          <span style="font-size:14px;font-weight:500;">Formas de pagamento aceitas</span>
        </div>
        <span style="color:rgba(255,255,255,.25);">›</span>
      </div>

      ${isBarbeiro ? `
      <div onclick="goTo('barberDash')" style="display:flex;align-items:center;justify-content:space-between;padding:15px 0;border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer;">
        <div style="display:flex;align-items:center;gap:14px;">
          <span style="font-size:18px;width:34px;text-align:center;">💈</span>
          <span style="font-size:14px;font-weight:500;color:var(--red);">Minha Agenda (barbeiro)</span>
        </div>
        <span style="color:var(--red);">›</span>
      </div>` : ''}

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

async function loadNextBooking() {
  if (!authState.user) return;
  var el = document.getElementById('booking-content');
  if (!el) return;

  var result = await sb
    .from('appointments')
    .select('*, services(name), profiles!appointments_barber_id_fkey(name)')
    .eq('client_id', authState.user.id)
    .in('status', ['pendente','confirmado'])
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .order('time', { ascending: true })
    .limit(1);

  if (result.error || !result.data || result.data.length === 0) {
    el.innerHTML = '<div style="text-align:center;padding:10px;">' +
      '<p style="font-size:13px;color:var(--text-muted);">Nenhum agendamento futuro</p>' +
      '<button onclick="goTo(\'agendar\')" style="margin-top:10px;padding:8px 18px;background:var(--red);border:none;border-radius:10px;color:white;font-size:12px;font-weight:700;cursor:pointer;">Agendar agora</button>' +
      '</div>';
    return;
  }

  var appt = result.data[0];
  var dateStr = new Date(appt.date+'T00:00:00').toLocaleDateString('pt-BR');
  var barberName = (appt.profiles && appt.profiles.name) || 'Barbeiro';
  var serviceName = (appt.services && appt.services.name) || 'Serviço';
  var statusClass = appt.status === 'confirmado' ? 'status-confirmado' : 'status-pendente';
  var statusLabel = appt.status === 'confirmado' ? 'Confirmado' : 'Pendente';

  el.innerHTML = '<div style="display:flex;align-items:center;gap:12px;background:rgba(255,30,30,.08);border-radius:12px;padding:12px;">' +
    '<div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,var(--red),var(--blue));display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">📅</div>' +
    '<div style="flex:1;">' +
    '<p style="font-size:13px;font-weight:600;">' + dateStr + ' - ' + (appt.time||'').slice(0,5) + '</p>' +
    '<span style="color:var(--text-muted);font-size:11px;">' + serviceName + ' · ' + barberName + '</span>' +
    '</div>' +
    '<span class="cli-status ' + statusClass + '">' + statusLabel + '</span>' +
    '</div>';
}