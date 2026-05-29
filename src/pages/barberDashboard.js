function renderBarberDash() {
  if (!requireRole('barbeiro','adm')) return '<div class="screen" id="screen-barberDash"></div>';

  const barber = authState.profile;

  return `
  <div class="screen" id="screen-barberDash">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('home')">←</button>
      <span class="page-title">MINHA AGENDA</span>
      <span style="font-size:18px;cursor:pointer" onclick="goTo('escala')">📅</span>
    </div>

    <div class="dash-header">
      <div style="display:flex;align-items:center;gap:14px;">
        <div style="width:56px;height:56px;border-radius:50%;border:3px solid var(--red);
          background:linear-gradient(135deg,var(--card),var(--card2));overflow:hidden;
          display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;color:var(--red);">
          ${barber?.avatar_url
            ? `<img src="${barber.avatar_url}" style="width:100%;height:100%;object-fit:cover;">`
            : (barber?.name?.charAt(0) || '?')}
        </div>
        <div>
          <h2 style="font-size:18px;font-weight:700;">Olá, ${barber?.name || 'Barbeiro'} 👋</h2>
          <p style="font-size:12px;color:var(--text-muted);">${barber?.nick || ''}</p>
          <span class="dash-role">💈 Barbeiro Profissional</span>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-grid" id="dash-stats">
      <div class="stat-card"><div class="stat-num" id="stat-hoje">—</div><div class="stat-label">Hoje</div></div>
      <div class="stat-card"><div class="stat-num" id="stat-receita">—</div><div class="stat-label">Ganhos hoje</div></div>
      <div class="stat-card"><div class="stat-num" id="stat-total">—</div><div class="stat-label">Total agendados</div></div>
      <div class="stat-card"><div class="stat-num" id="stat-pendente">—</div><div class="stat-label">Pendentes</div></div>
    </div>

    <!-- Botão comanda -->
    <div style="padding:0 20px 16px;">
      <button onclick="goTo('comanda')" style="width:100%;padding:13px;background:rgba(255,30,30,.1);
        border:1px solid rgba(255,30,30,.4);border-radius:12px;color:var(--red);
        font-size:13px;font-weight:700;cursor:pointer;">
        🍺 ABRIR COMANDA (Bebidas / Sinuca)
      </button>
    </div>

    <!-- Filtros -->
    <div class="filter-tabs">
      ${['todos','confirmado','pendente','concluido'].map(f => `
        <button class="f-tab${(currentState.dashFilter||'todos')===f?' active':''}"
          onclick="setDashFilter('${f}')">
          ${f==='todos'?'Todos':f==='confirmado'?'Confirmados':f==='pendente'?'Pendentes':'Concluídos'}
        </button>`).join('')}
    </div>

    <!-- Lista de clientes -->
    <div id="barber-clients-list">
      <div style="text-align:center;padding:40px 20px;color:var(--text-muted);">
        <div style="font-size:30px;margin-bottom:10px;">⏳</div>
        <p>Carregando agendamentos...</p>
      </div>
    </div>
  </div>`;
}

async function loadBarberAppointments() {
  if (!authState.user) return;

  const today = new Date().toISOString().split('T')[0];
  const filter = currentState.dashFilter || 'todos';

  let query = sb
    .from('appointments')
    .select(`
      *,
      services(name, price, duration_min),
      profiles!appointments_client_id_fkey(id, name, nick, phone, avatar_url)
    `)
    .eq('barber_id', authState.user.id)
    .order('date', { ascending: true })
    .order('time', { ascending: true });

  if (filter !== 'todos') query = query.eq('status', filter);

  const { data, error } = await query;

  const el = document.getElementById('barber-clients-list');
  if (!el) return;

  if (error) {
    el.innerHTML = `<div style="text-align:center;padding:30px;color:#ff6666;">Erro ao carregar agendamentos.</div>`;
    return;
  }

  if (!data || data.length === 0) {
    el.innerHTML = `
      <div style="text-align:center;padding:40px 20px;color:var(--text-muted);">
        <div style="font-size:40px;margin-bottom:12px;">📋</div>
        <p>Nenhum agendamento ${filter !== 'todos' ? 'com esse filtro' : 'ainda'}.</p>
      </div>`;
    return;
  }

  // Atualiza stats
  const todayAppts = data.filter(a => a.date === today);
  const receitaHoje = todayAppts
    .filter(a => a.status === 'concluido')
    .reduce((sum, a) => sum + (parseFloat(a.services?.price) || 0), 0);
  const pendentes = data.filter(a => a.status === 'pendente').length;

  const sh = document.getElementById('stat-hoje');
  const sr = document.getElementById('stat-receita');
  const st = document.getElementById('stat-total');
  const sp = document.getElementById('stat-pendente');
  if (sh) sh.textContent = todayAppts.length;
  if (sr) sr.textContent = `R$${receitaHoje.toFixed(0)}`;
  if (st) st.textContent = data.length;
  if (sp) sp.textContent = pendentes;

  // Agrupa por data
  const groups = {};
  data.forEach(a => {
    if (!groups[a.date]) groups[a.date] = [];
    groups[a.date].push(a);
  });

  const statusLabel = { confirmado:'Confirmado', pendente:'Pendente', concluido:'Concluído', cancelado:'Cancelado' };
  const statusClass = { confirmado:'status-confirmado', pendente:'status-pendente', concluido:'status-concluido', cancelado:'status-pendente' };

  el.innerHTML = Object.entries(groups).map(([date, appts]) => {
    const d = new Date(date + 'T00:00:00');
    const dateStr = d.toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'2-digit' });
    const isToday = date === today;

    return `
    <div class="section-label" style="margin-top:12px;">
      ${isToday ? '🔴 HOJE · ' : ''}${dateStr.toUpperCase()}
    </div>
    ${appts.map(a => {
      const client = a.profiles;
      const photoHtml = client?.avatar_url
        ? `<img class="cli-photo" src="${client.avatar_url}" alt="${client?.name}">`
        : `<div class="cli-photo-placeholder">${(client?.name||'?').charAt(0)}</div>`;

      return `
      <div class="client-appt-card" onclick="openClientDetail('${a.id}')">
        ${photoHtml}
        <div class="cli-info">
          <div class="cli-name">${client?.name || 'Cliente'}</div>
          <div class="cli-nick">${client?.nick || ''}</div>
          <div class="cli-service">✂️ ${a.services?.name || 'Serviço'}</div>
        </div>
        <div class="cli-datetime">
          <div class="cli-date">${new Date(a.date+'T00:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}</div>
          <div class="cli-time">${a.time?.slice(0,5)}</div>
          <div class="cli-status ${statusClass[a.status]||''}">${statusLabel[a.status]||a.status}</div>
        </div>
      </div>`;
    }).join('')}`;
  }).join('');
}

function setDashFilter(f) {
  currentState.dashFilter = f;
  reRenderScreen('barberDash');
}

function openClientDetail(apptId) {
  currentState.currentClientId = apptId;
  goTo('clienteDetalhe');
}