function renderBarberDash() {
  const bid = currentState.currentBarberDashId;
  const barber = APP_DATA.barbers.find(b => b.id === bid);
  const filter = currentState.dashFilter || 'todos';

  let appts = APP_DATA.appointments.filter(a => a.barberId === bid);
  if (filter !== 'todos') appts = appts.filter(a => a.status === filter);

  const today = appts.filter(a => a.date === '29/05/2025');
  const other = appts.filter(a => a.date !== '29/05/2025');

  const statusLabel = { confirmado: 'Confirmado', pendente: 'Pendente', concluido: 'Concluído' };
  const statusClass = { confirmado: 'status-confirmado', pendente: 'status-pendente', concluido: 'status-concluido' };

  function clientCard(a) {
    const photo = a.clientPhoto
      ? `<img class="cli-photo" src="${a.clientPhoto}" alt="${a.clientName}" loading="lazy">`
      : `<div class="cli-photo-placeholder">${a.clientName.charAt(0)}</div>`;
    return `
    <div class="client-appt-card" onclick="openClientDetail(${a.id})">
      ${photo}
      <div class="cli-info">
        <div class="cli-name">${a.clientName}</div>
        <div class="cli-nick">${a.clientNick}</div>
        <div class="cli-service">✂️ ${a.service}</div>
      </div>
      <div class="cli-datetime">
        <div class="cli-date">${a.date}</div>
        <div class="cli-time">${a.time}</div>
        <div class="cli-status ${statusClass[a.status]}">${statusLabel[a.status]}</div>
      </div>
    </div>`;
  }

  const totalHoje = APP_DATA.appointments.filter(a => a.barberId === bid && a.date === '29/05/2025').length;
  const totalMes = APP_DATA.appointments.filter(a => a.barberId === bid).length;
  const receitaHoje = APP_DATA.appointments
    .filter(a => a.barberId === bid && a.date === '29/05/2025' && a.status === 'confirmado')
    .reduce((sum, a) => sum + parseFloat(a.price.replace('R$ ','').replace(',','.') || 0), 0);

  return `
  <div class="screen" id="screen-barberDash">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('barbeiros')">←</button>
      <span class="page-title">MINHA AGENDA</span>
      <span style="font-size:18px;cursor:pointer" onclick="goTo('perfil')">⚙️</span>
    </div>

    <div class="dash-header">
      <img class="barber-avatar" src="${barber.photo}" alt="${barber.name}">
      <h2>${barber.name}</h2>
      <p>${barber.specialty}</p>
      <span class="dash-role">💈 Barbeiro Profissional</span>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-num">${totalHoje}</div>
        <div class="stat-label">Clientes hoje</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">R$ ${receitaHoje.toFixed(0)}</div>
        <div class="stat-label">Receita hoje</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${totalMes}</div>
        <div class="stat-label">Total agendados</div>
      </div>
      <div class="stat-card">
        <div class="stat-num">${barber.rating}</div>
        <div class="stat-label">Avaliação ★</div>
      </div>
    </div>

    <div class="filter-tabs">
      ${['todos','confirmado','pendente','concluido'].map(f => `
        <button class="f-tab${filter === f ? ' active' : ''}" onclick="setDashFilter('${f}')">
          ${f === 'todos' ? 'Todos' : f === 'confirmado' ? 'Confirmados' : f === 'pendente' ? 'Pendentes' : 'Concluídos'}
        </button>`).join('')}
    </div>

    ${today.length > 0 ? `
      <div class="section-label">HOJE · ${today[0].date}</div>
      ${today.map(clientCard).join('')}
    ` : ''}

    ${other.length > 0 ? `
      <div class="section-label" style="margin-top:${today.length > 0 ? '12px' : '0'}">OUTROS DIAS</div>
      ${other.map(clientCard).join('')}
    ` : ''}

    ${appts.length === 0 ? `
      <div style="text-align:center;padding:40px 20px;color:var(--text-muted);">
        <div style="font-size:40px;margin-bottom:12px;">📋</div>
        <p>Nenhum agendamento neste filtro</p>
      </div>
    ` : ''}

    <div style="height:20px;"></div>
  </div>`;
}

function setDashFilter(f) {
  currentState.dashFilter = f;
  reRenderScreen('barberDash');
}

function openClientDetail(apptId) {
  currentState.currentClientId = apptId;
  goTo('clienteDetalhe');
}
