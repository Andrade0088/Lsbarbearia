function renderPerfil() {
  if (!requireAuth()) return '<div class="screen" id="screen-perfil"></div>';

  const p = authState.profile;
  const name     = p?.name     || 'Usuário';
  const email    = p?.email    || authState.user?.email || '';
  const nick     = p?.nick     || '';
  const phone    = p?.phone    || '';
  const avatar   = p?.avatar_url;

  const avatarHtml = avatar
    ? `<img class="avatar" src="${avatar}" alt="Avatar">`
    : `<div class="avatar" style="display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--red),var(--blue));font-size:28px;font-weight:800;color:white;">${name.charAt(0).toUpperCase()}</div>`;

  return `
  <div class="screen" id="screen-perfil">
    <div class="topbar" style="background:transparent;position:absolute;z-index:10;">
      <button class="back-btn" onclick="goTo('home')">←</button>
      <span></span>
      <span style="font-size:20px;cursor:pointer" onclick="goTo('editarPerfil')">⚙️</span>
    </div>
    <div class="profile-hero">
      ${avatarHtml}
      <div class="profile-name">Olá, ${name} 👋</div>
      <div class="profile-email">${email}</div>
      ${nick ? `<div style="font-size:13px;color:var(--red);margin-top:4px;">${nick}</div>` : ''}
      ${phone ? `<div style="font-size:12px;color:var(--text-muted);margin-top:4px;">📱 ${phone}</div>` : ''}
    </div>

    <div id="next-booking-section" style="margin:18px 20px;">
      <div style="background:var(--card);border-radius:16px;padding:16px;border:1px solid rgba(255,30,30,.25);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <span style="font-size:11px;font-weight:700;letter-spacing:.5px;color:var(--text-muted);">PRÓXIMO AGENDAMENTO</span>
          <a style="color:var(--red);font-size:12px;cursor:pointer;font-weight:600;" onclick="goTo('agendar')">Ver todos</a>
        </div>
        <div id="booking-content">
          <div style="text-align:center;padding:10px;color:var(--text-muted);font-size:13px;">Carregando...</div>
        </div>
      </div>
    </div>

    <div class="menu-list">
      <div class="menu-item" onclick="goTo('agendar')">
        <div class="mi-left"><span class="mi-icon">📋</span><span class="mi-label">Meus agendamentos</span></div>
        <span class="mi-arrow">›</span>
      </div>
      <div class="menu-item">
        <div class="mi-left"><span class="mi-icon">💳</span><span class="mi-label">Métodos de pagamento</span></div>
        <span class="mi-arrow">›</span>
      </div>
      <div class="menu-item">
        <div class="mi-left"><span class="mi-icon">⭐</span><span class="mi-label">Avaliações</span></div>
        <span class="mi-arrow">›</span>
      </div>
      ${authState.role === 'barbeiro' || authState.role === 'adm' ? `
      <div class="menu-item" onclick="goTo('barberDash')">
        <div class="mi-left"><span class="mi-icon">💈</span><span class="mi-label" style="color:var(--red);">Minha Agenda (barbeiro)</span></div>
        <span class="mi-arrow" style="color:var(--red);">›</span>
      </div>` : ''}
      <div class="menu-item">
        <div class="mi-left"><span class="mi-icon">⚙️</span><span class="mi-label">Configurações</span></div>
        <span class="mi-arrow">›</span>
      </div>
      <div class="menu-item" onclick="doLogout()">
        <div class="mi-left"><span class="mi-icon">🚪</span><span class="mi-label" style="color:#ff4444;">Sair</span></div>
        <span class="mi-arrow" style="color:#ff4444;">›</span>
      </div>
    </div>
  </div>`;
}

async function loadNextBooking() {
  if (!authState.user) return;

  const { data, error } = await sb
    .from('appointments')
    .select('*, services(name), profiles!appointments_barber_id_fkey(name)')
    .eq('client_id', authState.user.id)
    .in('status', ['pendente', 'confirmado'])
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .order('time', { ascending: true })
    .limit(1);

  const el = document.getElementById('booking-content');
  if (!el) return;

  if (error || !data || data.length === 0) {
    el.innerHTML = `
      <div style="text-align:center;padding:10px;">
        <p style="font-size:13px;color:var(--text-muted);">Nenhum agendamento futuro</p>
        <button class="btn-sm" style="margin-top:10px;" onclick="goTo('agendar')">Agendar agora</button>
      </div>`;
    return;
  }

  const appt = data[0];
  const dateFormatted = new Date(appt.date + 'T00:00:00').toLocaleDateString('pt-BR');
  const barberName = appt.profiles?.name || 'Barbeiro';
  const serviceName = appt.services?.name || 'Serviço';
  const statusClass = appt.status === 'confirmado' ? 'status-confirmado' : 'status-pendente';
  const statusLabel = appt.status === 'confirmado' ? 'Confirmado' : 'Pendente';

  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;background:rgba(255,30,30,.08);border-radius:12px;padding:12px;">
      <div style="width:40px;height:40px;border-radius:10px;background:linear-gradient(135deg,var(--red),var(--blue));display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">📅</div>
      <div style="flex:1;">
        <p style="font-size:13px;font-weight:600;">${dateFormatted} - ${appt.time.slice(0,5)}</p>
        <span style="color:var(--text-muted);font-size:11px;">${serviceName} · ${barberName}</span>
      </div>
      <span class="cli-status ${statusClass}">${statusLabel}</span>
    </div>`;
}

// Chama após renderizar
const _origRenderScreen = typeof renderScreen !== 'undefined' ? renderScreen : null;
document.addEventListener('perfilLoaded', loadNextBooking);