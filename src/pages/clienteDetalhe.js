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

var comandaItems = {};

async function loadClienteDetalhe() {
  if (!currentState.currentClientId) return;

  var result = await sb
    .from('appointments')
    .select('*, services(name,price,duration_min), profiles!appointments_client_id_fkey(id,name,nick,phone,avatar_url)')
    .eq('id', currentState.currentClientId)
    .single();

  var el = document.getElementById('cliente-detalhe-content');
  if (!el || result.error || !result.data) {
    if (el) el.innerHTML = '<div style="text-align:center;padding:40px;color:#ff6666;">Erro ao carregar.</div>';
    return;
  }

  var appt = result.data;
  var client = appt.profiles;
  var clientId = client ? client.id : 'unknown';

  if (!comandaItems[clientId]) comandaItems[clientId] = {};

  var statusLabel = { confirmado:'Confirmado', pendente:'Pendente', concluido:'Concluído', cancelado:'Cancelado', pago:'Pago' };
  var statusClass = { confirmado:'status-confirmado', pendente:'status-pendente', concluido:'status-concluido', cancelado:'status-pendente', pago:'status-confirmado' };

  var dateStr = new Date(appt.date+'T00:00:00').toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'});

  var photoHtml = client && client.avatar_url
    ? '<img class="client-detail-photo" src="' + client.avatar_url + '" alt="' + (client.name||'') + '" loading="lazy">'
    : '<div class="client-detail-photo-placeholder">' + ((client&&client.name)||'?').charAt(0) + '</div>';

  // Consumo extra (bebidas, sinuca)
  var extras = APP_DATA.services.filter(function(s) {
    return s.category === 'bebida' || s.category === 'lazer';
  });

  var comanda = comandaItems[clientId];
  var totalComanda = 0;
  Object.keys(comanda).forEach(function(k) {
    var item = comanda[k];
    totalComanda += (item.price || 0) * item.qty;
  });

  var totalServico = parseFloat(appt.services ? appt.services.price : 0) || 0;
  var totalGeral = totalServico + totalComanda;

  var extraHtml = extras.map(function(e) {
    var qty = (comanda[e.id] && comanda[e.id].qty) || 0;
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:0.5px solid rgba(255,255,255,.05);">' +
      '<div style="display:flex;align-items:center;gap:10px;">' +
      '<span style="font-size:20px;">' + e.icon + '</span>' +
      '<div><p style="font-size:13px;font-weight:600;">' + e.name + '</p>' +
      '<p style="font-size:11px;color:var(--text-muted);">' + (e.price ? 'R$ ' + e.price : 'Consulte') + '</p></div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
      '<button onclick="alterarComanda(\'' + clientId + '\',' + e.id + ',\'' + e.name.replace(/'/g,'\\x27') + '\',' + (e.price||0) + ',-1)" ' +
      'style="width:30px;height:30px;border-radius:50%;background:rgba(255,30,30,.15);border:1px solid rgba(255,30,30,.3);color:var(--red);font-size:18px;cursor:pointer;font-weight:700;">−</button>' +
      '<span style="font-size:16px;font-weight:700;min-width:24px;text-align:center;">' + qty + '</span>' +
      '<button onclick="alterarComanda(\'' + clientId + '\',' + e.id + ',\'' + e.name.replace(/'/g,'\\x27') + '\',' + (e.price||0) + ',1)" ' +
      'style="width:30px;height:30px;border-radius:50%;background:var(--red);border:none;color:white;font-size:18px;cursor:pointer;font-weight:700;">+</button>' +
      '</div>' +
      '</div>';
  }).join('');

  var comandaResumo = Object.values(comanda).filter(function(i){ return i.qty > 0; }).map(function(i) {
    return '<div style="display:flex;justify-content:space-between;padding:3px 0;">' +
      '<span style="font-size:12px;">' + i.name + ' x' + i.qty + '</span>' +
      '<span style="font-size:12px;font-weight:700;color:var(--red);">R$ ' + (i.price * i.qty) + '</span></div>';
  }).join('');

  // Histórico
  var histResult = await sb
    .from('appointments')
    .select('*, services(name,price)')
    .eq('client_id', clientId)
    .eq('barber_id', authState.user.id)
    .eq('status', 'concluido')
    .neq('id', appt.id)
    .order('date', { ascending: false })
    .limit(5);

  var histHtml = '';
  if (histResult.data && histResult.data.length > 0) {
    histHtml = '<div class="history-section">' +
      '<p class="history-title">HISTÓRICO COM VOCÊ</p>' +
      histResult.data.map(function(h) {
        return '<div class="history-item">' +
          '<div class="hi-left"><p>' + (h.services ? h.services.name : 'Serviço') + '</p>' +
          '<span>' + new Date(h.date+'T00:00:00').toLocaleDateString('pt-BR') + ' · ' + (h.time||'').slice(0,5) + '</span></div>' +
          '<div class="hi-price">R$ ' + parseFloat(h.services ? h.services.price : 0).toFixed(0) + '</div>' +
          '</div>';
      }).join('') +
      '</div>';
  }

  el.innerHTML = `
    <div class="client-detail-header">
      ${photoHtml}
      <div class="client-detail-name">${client ? client.name : 'Cliente'}</div>
      <div class="client-detail-nick">${client ? (client.nick||'') : ''}</div>
      <div class="client-actions">
        ${client && client.phone ? '<a href="tel:' + client.phone + '" class="action-btn call">📞 Ligar</a>' : ''}
        <button class="action-btn chat" onclick="startChatWithClient('${clientId}','${client?client.name:''}','${client?client.phone||'':''}')">💬 Chat</button>
      </div>
    </div>

    <!-- Agendamento -->
    <div class="appt-detail-box">
      <div class="adb-header">AGENDAMENTO</div>
      <div class="appt-detail-row">
        <span class="adr-icon">✂️</span>
        <div class="adr-info"><p>${appt.services ? appt.services.name : 'Serviço'}</p><span>Serviço</span></div>
        <div style="margin-left:auto;text-align:right;">
          <p style="font-size:15px;font-weight:800;color:var(--red);">R$ ${totalServico.toFixed(0)}</p>
          <span style="font-size:11px;color:var(--text-muted);">${appt.services ? appt.services.duration_min : 0} min</span>
        </div>
      </div>
      <div class="appt-detail-row">
        <span class="adr-icon">📅</span>
        <div class="adr-info"><p>${dateStr}</p><span>Data</span></div>
        <div style="margin-left:auto;"><p style="font-size:18px;font-weight:800;">${(appt.time||'').slice(0,5)}</p></div>
      </div>
      <div class="appt-detail-row">
        <span class="adr-icon">📍</span>
        <div class="adr-info">
          <p>Status: <span class="cli-status ${statusClass[appt.status]||''}" style="display:inline-block;margin-left:6px;">${statusLabel[appt.status]||appt.status}</span></p>
        </div>
      </div>
      ${appt.notes ? '<div class="appt-detail-row"><span class="adr-icon">📝</span><div class="adr-info"><p>' + appt.notes + '</p><span>Observações</span></div></div>' : ''}
    </div>

    <!-- Consumo extra -->
    <div style="margin:0 20px 16px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:12px;">➕ ADICIONAR CONSUMO</p>
      <div style="background:var(--card);border-radius:14px;padding:14px 16px;border:1px solid var(--border);">
        ${extraHtml}
      </div>

      ${totalComanda > 0 ? `
      <div style="background:rgba(255,30,30,.08);border:1px solid rgba(255,30,30,.25);border-radius:12px;padding:12px 14px;margin-top:10px;">
        <p style="font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:8px;">CONSUMO ADICIONADO</p>
        ${comandaResumo}
      </div>` : ''}
    </div>

    <!-- Total e pagamento -->
    <div style="margin:0 20px 20px;background:var(--card);border-radius:14px;padding:14px 16px;border:1px solid rgba(255,30,30,.3);">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
        <span style="font-size:13px;color:var(--text-muted);">Serviço</span>
        <span style="font-size:13px;font-weight:600;">R$ ${totalServico.toFixed(0)}</span>
      </div>
      ${totalComanda > 0 ? '<div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="font-size:13px;color:var(--text-muted);">Consumo</span><span style="font-size:13px;font-weight:600;">R$ ' + totalComanda.toFixed(0) + '</span></div>' : ''}
      <div style="display:flex;justify-content:space-between;padding-top:8px;border-top:0.5px solid rgba(255,255,255,.08);">
        <span style="font-size:15px;font-weight:700;">TOTAL</span>
        <span style="font-size:20px;font-weight:800;color:var(--red);">R$ ${totalGeral.toFixed(0)}</span>
      </div>
    </div>

    ${histHtml}

    <!-- Ações -->
    <div style="padding:0 20px 24px;display:flex;flex-direction:column;gap:10px;">
      ${appt.status === 'pendente' ? `
        <button class="btn" onclick="updateApptStatus(${appt.id},'confirmado')">✅ CONFIRMAR AGENDAMENTO</button>
        <button class="btn-outline" onclick="updateApptStatus(${appt.id},'cancelado')" style="border-color:#ff4444;color:#ff4444;">✕ CANCELAR</button>
      ` : appt.status === 'confirmado' ? `
        <button class="btn" onclick="confirmarPagamento(${appt.id},'${clientId}')">💰 CONFIRMAR PAGAMENTO (R$ ${totalGeral.toFixed(0)})</button>
        <button class="btn-outline" onclick="updateApptStatus(${appt.id},'cancelado')" style="border-color:#ff4444;color:#ff4444;">✕ CANCELAR</button>
      ` : appt.status === 'concluido' || appt.status === 'pago' ? `
        <button class="btn-outline" disabled style="opacity:.4;">✔️ Atendimento concluído</button>
      ` : `
        <button class="btn-outline" disabled style="opacity:.4;">${statusLabel[appt.status]||appt.status}</button>
      `}
    </div>`;
}

function alterarComanda(clientId, itemId, name, price, delta) {
  if (!comandaItems[clientId]) comandaItems[clientId] = {};
  if (!comandaItems[clientId][itemId]) comandaItems[clientId][itemId] = { name:name, price:price, qty:0 };
  comandaItems[clientId][itemId].qty = Math.max(0, comandaItems[clientId][itemId].qty + delta);
  loadClienteDetalhe();
}

async function updateApptStatus(id, newStatus) {
  var result = await sb.from('appointments').update({ status: newStatus }).eq('id', id);
  if (result.error) { alert('Erro: ' + result.error.message); return; }
  await loadClienteDetalhe();
}

async function confirmarPagamento(apptId, clientId) {
  var comanda = comandaItems[clientId] || {};
  var totalComanda = 0;
  Object.values(comanda).forEach(function(i){ totalComanda += i.price * i.qty; });

  var result = await sb.from('appointments').update({
    status: 'concluido',
    notes: totalComanda > 0 ? 'Consumo extra: R$ ' + totalComanda.toFixed(0) : null
  }).eq('id', apptId);

  if (result.error) { alert('Erro: ' + result.error.message); return; }

  comandaItems[clientId] = {};
  await loadClienteDetalhe();
}

function startChatWithClient(userId, name, phone) {
  currentState.pendingChat = { userId:userId, name:name, phone:phone, role:'cliente' };
  goTo('chat');
}