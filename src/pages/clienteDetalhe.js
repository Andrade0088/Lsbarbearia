function renderClienteDetalhe() {
  const appt = APP_DATA.appointments.find(a => a.id === currentState.currentClientId);
  if (!appt) return '<div class="screen" id="screen-clienteDetalhe"><p>Não encontrado</p></div>';

  const statusLabel = { confirmado: 'Confirmado', pendente: 'Pendente', concluido: 'Concluído' };
  const statusClass = { confirmado: 'status-confirmado', pendente: 'status-pendente', concluido: 'status-concluido' };

  const photo = appt.clientPhoto
    ? `<img class="client-detail-photo" src="${appt.clientPhoto}" alt="${appt.clientName}" loading="lazy">`
    : `<div class="client-detail-photo-placeholder">${appt.clientName.charAt(0)}</div>`;

  // historico do mesmo cliente
  const history = APP_DATA.appointments.filter(
    a => a.clientName === appt.clientName && a.id !== appt.id && a.status === 'concluido'
  );

  const refPhotoBlock = appt.refPhoto ? `
    <div style="padding:0 20px 18px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:10px;">FOTO DE REFERÊNCIA DO CLIENTE</p>
      <div style="border-radius:14px;overflow:hidden;border:1px solid rgba(255,30,30,.3);">
        <img src="${appt.refPhoto}" alt="Referência" style="width:100%;height:160px;object-fit:cover;display:block;">
      </div>
      ${appt.notes ? `<p style="font-size:12px;color:#b8b8b8;margin-top:8px;padding:10px 12px;background:var(--card);border-radius:10px;border-left:3px solid var(--red);">"${appt.notes}"</p>` : ''}
    </div>` : (appt.notes ? `
    <div style="padding:0 20px 18px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:8px;">OBSERVAÇÕES</p>
      <p style="font-size:13px;color:#b8b8b8;padding:12px;background:var(--card);border-radius:10px;border-left:3px solid var(--red);">"${appt.notes}"</p>
    </div>` : '');

  const historyBlock = history.length > 0 ? `
    <div class="history-section">
      <p class="history-title">HISTÓRICO COM VOCÊ</p>
      ${history.map(h => `
        <div class="history-item">
          <div class="hi-left">
            <p>${h.service}</p>
            <span>${h.date} · ${h.time}</span>
          </div>
          <div class="hi-price">${h.price}</div>
        </div>`).join('')}
    </div>` : '';

  return `
  <div class="screen" id="screen-clienteDetalhe">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('barberDash')">←</button>
      <span class="page-title">CLIENTE</span>
      <span style="width:24px"></span>
    </div>

    <div class="client-detail-header">
      ${photo}
      <div class="client-detail-name">${appt.clientName}</div>
      <div class="client-detail-nick">${appt.clientNick}</div>
      <div class="client-actions">
        <a href="tel:${appt.clientPhone}" class="action-btn call">📞 Ligar</a>
        <button class="action-btn chat" onclick="alert('Chat em breve!')">💬 Chat</button>
      </div>
    </div>

    <div class="appt-detail-box">
      <div class="adb-header">AGENDAMENTO SOLICITADO</div>
      <div class="appt-detail-row">
        <span class="adr-icon">✂️</span>
        <div class="adr-info"><p>${appt.service}</p><span>Serviço</span></div>
        <div style="margin-left:auto;text-align:right;">
          <p style="font-size:15px;font-weight:800;color:var(--red);">${appt.price}</p>
          <span style="font-size:11px;color:var(--text-muted);">${appt.duration}</span>
        </div>
      </div>
      <div class="appt-detail-row">
        <span class="adr-icon">📅</span>
        <div class="adr-info"><p>${appt.date}</p><span>Data</span></div>
        <div style="margin-left:auto;">
          <p style="font-size:18px;font-weight:800;color:white;">${appt.time}</p>
        </div>
      </div>
      <div class="appt-detail-row">
        <span class="adr-icon">📍</span>
        <div class="adr-info">
          <p>Status: <span class="cli-status ${statusClass[appt.status]}" style="display:inline-block;margin-left:6px;">${statusLabel[appt.status]}</span></p>
          <span>Situação do agendamento</span>
        </div>
      </div>
    </div>

    ${refPhotoBlock}
    ${historyBlock}

    <div style="padding:0 20px 24px;display:flex;flex-direction:column;gap:10px;">
      ${appt.status === 'pendente' ? `
        <button class="btn" onclick="updateStatus(${appt.id},'confirmado')">✅ CONFIRMAR AGENDAMENTO</button>
        <button class="btn-outline" onclick="updateStatus(${appt.id},'cancelado')" style="border-color:#ff4444;color:#ff4444;">✕ CANCELAR</button>
      ` : appt.status === 'confirmado' ? `
        <button class="btn" onclick="updateStatus(${appt.id},'concluido')">✔️ MARCAR COMO CONCLUÍDO</button>
      ` : `
        <button class="btn-outline" disabled style="opacity:.4;">✔️ Atendimento concluído</button>
      `}
    </div>
  </div>`;
}

function updateStatus(id, newStatus) {
  const appt = APP_DATA.appointments.find(a => a.id === id);
  if (appt) {
    appt.status = newStatus;
    reRenderScreen('clienteDetalhe');
  }
}
