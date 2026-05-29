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

  // Query separada para stats (sempre busca tudo, independente do filtro)
  const { data: allData } = await sb
    .from('appointments')
    .select('id, date, time, status, price, client_id, services(price)')
    .eq('barber_id', authState.user.id);

  if (allData) {
    const todayAll = allData.filter(a => a.date === today);
    const receitaHoje = todayAll
      .filter(a => a.status === 'concluido' || a.status === 'pago')
      .reduce((sum, a) => sum + (parseFloat(a.price) || parseFloat(a.services?.price) || 0), 0);
    const pendentes = allData.filter(a => a.status === 'pendente').length;

    const sh = document.getElementById('stat-hoje');
    const sr = document.getElementById('stat-receita');
    const st = document.getElementById('stat-total');
    const sp = document.getElementById('stat-pendente');
    if (sh) sh.textContent = todayAll.length;
    if (sr) sr.textContent = `R$${receitaHoje.toFixed(0)}`;
    if (st) st.textContent = allData.length;
    if (sp) sp.textContent = pendentes;
  }

  // Query para a lista (com filtro)
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

  if (filter === 'concluido') {
    query = query.in('status', ['concluido','pago']);
  } else if (filter !== 'todos') {
    query = query.eq('status', filter);
  }

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

  const statusLabel = { confirmado:'Confirmado', pendente:'Pendente', concluido:'Concluído', cancelado:'Cancelado' };
  const statusClass = { confirmado:'status-confirmado', pendente:'status-pendente', concluido:'status-concluido', cancelado:'status-pendente' };

  // Agrupa por data → dentro de cada data, agrupa por client+time (um card por agendamento)
  const groups = {};
  data.forEach(a => {
    if (!groups[a.date]) groups[a.date] = {};
    const key = (a.profiles?.id || 'x') + '_' + a.time;
    if (!groups[a.date][key]) {
      groups[a.date][key] = { apptId: a.id, client: a.profiles, date: a.date, time: a.time, status: a.status, services: [] };
    }
    if (!(a.notes && (a.notes.indexOf('Consumo') >= 0 || a.notes.indexOf('Desconto') >= 0))) {
      groups[a.date][key].services.push(a.services?.name || 'Serviço');
    }
    const priority = { pendente:3, confirmado:2, concluido:1, cancelado:0 };
    if ((priority[a.status]||0) > (priority[groups[a.date][key].status]||0)) {
      groups[a.date][key].status = a.status;
    }
  });

  el.innerHTML = Object.entries(groups).map(([date, cards]) => {
    const d = new Date(date + 'T00:00:00');
    const dateStr = d.toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'2-digit' });
    const isToday = date === today;

    return `
    <div class="section-label" style="margin-top:12px;">
      ${isToday ? '🔴 HOJE · ' : ''}${dateStr.toUpperCase()}
    </div>
    ${Object.values(cards).map(c => {
      const client = c.client;
      const photoHtml = client?.avatar_url
        ? `<img class="cli-photo" src="${client.avatar_url}" alt="${client?.name}">`
        : `<div class="cli-photo-placeholder">${(client?.name||'?').charAt(0)}</div>`;
      const svcLabel = c.services.filter((v,i,a) => a.indexOf(v)===i).join(' + ') || 'Serviço';

      return `
      <div class="client-appt-card" onclick="openClientDetail('${c.apptId}')">
        ${photoHtml}
        <div class="cli-info">
          <div class="cli-name">${client?.name || 'Cliente'}</div>
          <div class="cli-nick">${client?.nick || ''}</div>
          <div class="cli-service">✂️ ${svcLabel}</div>
        </div>
        <div class="cli-datetime">
          <div class="cli-date">${new Date(c.date+'T00:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}</div>
          <div class="cli-time">${c.time?.slice(0,5)}</div>
          <div class="cli-status ${statusClass[c.status]||''}">${statusLabel[c.status]||c.status}</div>
        </div>
      </div>`;
    }).join('')}`;
  }).join('');
}
function setDashFilter(f) {
  currentState.dashFilter = f;
  reRenderScreen('barberDash');
  setTimeout(loadBarberAppointments, 50);
}

function openClientDetail(apptId) {
  currentState.currentClientId = apptId;
  goTo('clienteDetalhe');
}