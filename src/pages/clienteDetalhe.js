function renderClienteDetalhe() {
  if (!requireRole('barbeiro','adm')) return '<div class="screen" id="screen-clienteDetalhe"></div>';

  return `
  <div class="screen" id="screen-clienteDetalhe">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('barberDash')">←</button>
      <span class="page-title">CLIENTE</span>
      <span style="width:24px"></span>
    </div>
    <div id="cliente-detalhe-content">
      <div style="text-align:center;padding:60px 20px;color:var(--text-muted);">
        <div style="font-size:30px;margin-bottom:10px;">⏳</div>
        <p>Carregando...</p>
      </div>
    </div>
  </div>`;
}

async function loadClienteDetalhe() {
  if (!currentState.currentClientId) return;

  const { data: appt, error } = await sb
    .from('appointments')
    .select(`
      *,
      services(name, price, duration_min),
      profiles!appointments_client_id_fkey(id, name, nick, phone, avatar_url)
    `)
    .eq('id', currentState.currentClientId)
    .single();

  const el = document.getElementById('cliente-detalhe-content');
  if (!el || error || !appt) {
    if (el) el.innerHTML = `<div style="text-align:center;padding:40px;color:#ff6666;">Erro ao carregar cliente.</div>`;
    return;
  }

  const client = appt.profiles;
  const statusLabel = { confirmado:'Confirmado', pendente:'Pendente', concluido:'Concluído', cancelado:'Cancelado' };
  const statusClass = { confirmado:'status-confirmado', pendente:'status-pendente', concluido:'status-concluido', cancelado:'status-pendente' };

  const photoHtml = client?.avatar_url
    ? `<img class="client-detail-photo" src="${client.avatar_url}" alt="${client?.name}">`
    : `<div class="client-detail-photo-placeholder">${(client?.name||'?').charAt(0)}</div>`;

  const dateStr = new Date(appt.date+'T00:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'});

  // Histórico do cliente com este barbeiro
  const { data: history } = await sb
    .from('appointments')
    .select('*, services(name, price)')
    .eq('client_id', client?.id)
    .eq('barber_id', authState.user.id)
    .eq('status', 'concluido')
    .neq('id', appt.id)
    .order('date', { ascending: false })
    .limit(5);

  const historyHtml = history?.length > 0 ? `
    <div class="history-section">
      <p class="history-title">HISTÓRICO COM VOCÊ</p>
      ${history.map(h => `
        <div class="history-item">
          <div class="hi-left">
            <p>${h.services?.name || 'Serviço'}</p>
            <span>${new Date(h.date+'T00:00:00').toLocaleDateString('pt-BR')} · ${h.time?.slice(0,5)}</span>
          </div>
          <div class="hi-price">R$ ${parseFloat(h.services?.price||0).toFixed(0)}</div>
        </div>`).join('')}
    </div>` : '';

  el.innerHTML = `
    <div class="client-detail-header">
      ${photoHtml}
      <div class="client-detail-name">${client?.name || 'Cliente'}</div>
      <div class="client-detail-nick">${client?.nick || ''}</div>
      <div class="client-actions">
        ${client?.phone ? `<a href="tel:${client.phone}" class="action-btn call">📞 Ligar</a>` : ''}
        <button class="action-btn chat" onclick="startChatWithClient('${client?.id}','${client?.name}','${client?.phone||''}')">💬 Chat</button>
      </div>
    </div>

    <div class="appt-detail-box">
      <div class="adb-header">AGENDAMENTO SOLICITADO</div>
      <div class="appt-detail-row">
        <span class="adr-icon">✂️</span>
        <div class="adr-info"><p>${appt.services?.name || 'Serviço'}</p><span>Serviço</span></div>
        <div style="margin-left:auto;text-align:right;">
          <p style="font-size:15px;font-weight:800;color:var(--red);">R$ ${parseFloat(appt.services?.price||0).toFixed(0)}</p>
          <span style="font-size:11px;color:var(--text-muted);">${appt.services?.duration_min || 0} min</span>
        </div>
      </div>
      <div class="appt-detail-row">
        <span class="adr-icon">📅</span>
        <div class="adr-info"><p>${dateStr}</p><span>Data</span></div>
        <div style="margin-left:auto;">
          <p style="font-size:18px;font-weight:800;color:white;">${appt.time?.slice(0,5)}</p>
        </div>
      </div>
      <div class="appt-detail-row">
        <span class="adr-icon">📍</span>
        <div class="adr-info">
          <p>Status: <span class="cli-status ${statusClass[appt.status]||''}" style="display:inline-block;margin-left:6px;">${statusLabel[appt.status]||appt.status}</span></p>
          <span>Situação do agendamento</span>
        </div>
      </div>
      ${appt.notes ? `
      <div class="appt-detail-row">
        <span class="adr-icon">📝</span>
        <div class="adr-info"><p>${appt.notes}</p><span>Observações do cliente</span></div>
      </div>` : ''}
      ${appt.ref_photo_url ? `
      <div class="appt-detail-row" style="flex-direction:column;align-items:flex-start;">
        <p style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">FOTO DE REFERÊNCIA</p>
        <img src="${appt.ref_photo_url}" style="width:100%;border-radius:10px;max-height:160px;object-fit:cover;">
      </div>` : ''}
    </div>

    ${historyHtml}

    <div style="padding:0 20px 24px;display:flex;flex-direction:column;gap:10px;">
      ${appt.status === 'pendente' ? `
        <button class="btn" onclick="updateApptStatus('${appt.id}','confirmado')">✅ CONFIRMAR</button>
        <button class="btn-outline" onclick="updateApptStatus('${appt.id}','cancelado')" style="border-color:#ff4444;color:#ff4444;">✕ CANCELAR</button>
      ` : appt.status === 'confirmado' ? `
        <button class="btn" onclick="updateApptStatus('${appt.id}','concluido')">✔️ MARCAR CONCLUÍDO</button>
        <button class="btn-outline" onclick="updateApptStatus('${appt.id}','cancelado')" style="border-color:#ff4444;color:#ff4444;">✕ CANCELAR</button>
      ` : `
        <button class="btn-outline" disabled style="opacity:.4;">Atendimento ${statusLabel[appt.status]||appt.status}</button>
      `}
    </div>`;
}

async function updateApptStatus(id, newStatus) {
  const { error } = await sb
    .from('appointments')
    .update({ status: newStatus })
    .eq('id', id);

  if (!error) {
    await loadClienteDetalhe();
  }
}

function startChatWithClient(userId, name, phone) {
  openConvo(userId, name, phone, 'cliente');
  goTo('chat');
}