// comandaLivre persiste em memória E no Supabase (tabela comanda_itens)
// Assim não perde ao trocar de cliente

function renderComanda() {
  if (!requireRole('barbeiro','adm')) return '<div class="screen" id="screen-comanda"></div>';
  return `
  <div class="screen" id="screen-comanda">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('barberDash')">←</button>
      <span class="page-title">COMANDA</span>
      <span style="width:24px"></span>
    </div>
    <div style="padding:18px 20px 100px;">
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">
        Busque um cliente para abrir ou continuar uma comanda.
      </p>
      <div style="display:flex;gap:8px;margin-bottom:16px;">
        <input id="comanda-search" type="text" placeholder="Nome ou apelido do cliente..."
          onkeydown="if(event.key==='Enter')buscarClienteComanda()"
          style="flex:1;padding:12px 14px;background:var(--card);border:1px solid rgba(255,255,255,.1);
          border-radius:12px;color:white;font-size:13px;outline:none;">
        <button onclick="buscarClienteComanda()"
          style="padding:12px 16px;background:var(--red);border:none;border-radius:12px;
          color:white;font-size:13px;font-weight:700;cursor:pointer;">Buscar</button>
      </div>
      <div id="comanda-resultado"></div>
    </div>
  </div>`;
}

var comandaClienteAtivo = null;
var comandaLivre = {}; // { clientId: { itemId: {name,price,qty} } } — cache em memória

function initComanda() {
  // nada — só mostra a busca
}

async function buscarClienteComanda() {
  var termo = (document.getElementById('comanda-search')||{}).value || '';
  if (!termo.trim()) return;
  var el = document.getElementById('comanda-resultado');
  el.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">Buscando...</p>';

  var result = await sb.from('profiles')
    .select('id,name,nick,phone,avatar_url')
    .eq('role','cliente')
    .or('name.ilike.%' + termo + '%,nick.ilike.%' + termo + '%')
    .limit(8);

  if (result.error || !result.data || result.data.length === 0) {
    el.innerHTML = '<p style="color:var(--text-muted);font-size:13px;text-align:center;padding:20px;">Nenhum cliente encontrado.</p>';
    return;
  }

  el.innerHTML = result.data.map(function(c) {
    var temComanda = comandaLivre[c.id] && Object.values(comandaLivre[c.id]).some(function(i){ return i.qty > 0; });
    var photoHtml = c.avatar_url
      ? '<img src="' + c.avatar_url + '" style="width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid var(--red);">'
      : '<div style="width:44px;height:44px;border-radius:50%;background:var(--red);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:white;">' + c.name.charAt(0) + '</div>';
    return '<div onclick="abrirComandaCliente(\'' + c.id + '\',\'' + c.name.replace(/'/g,'\\x27') + '\',\'' + (c.phone||'') + '\')" ' +
      'style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--card);' +
      'border:1px solid ' + (temComanda ? 'var(--red)' : 'rgba(255,255,255,.08)') + ';' +
      'border-radius:12px;margin-bottom:8px;cursor:pointer;">' +
      photoHtml +
      '<div><p style="font-size:14px;font-weight:600;">' + c.name + '</p>' +
      '<p style="font-size:12px;color:' + (temComanda ? 'var(--red)' : 'var(--text-muted)') + ';">' +
      (temComanda ? '🟡 Comanda aberta' : (c.nick||'')) + '</p></div>' +
      '<span style="margin-left:auto;color:var(--red);font-size:18px;">›</span>' +
      '</div>';
  }).join('');
}

async function abrirComandaCliente(clientId, name, phone) {
  comandaClienteAtivo = { id:clientId, name:name, phone:phone };

  // Carrega do Supabase se não tiver em memória
  if (!comandaLivre[clientId]) {
    var saved = await sb.from('comanda_itens')
      .select('*')
      .eq('barber_id', authState.user.id)
      .eq('client_id', clientId);

    comandaLivre[clientId] = {};
    if (saved.data && saved.data.length > 0) {
      saved.data.forEach(function(row) {
        comandaLivre[clientId][row.item_id] = {
          name: row.item_name,
          price: row.item_price,
          qty: row.qty
        };
      });
    }
  }

  renderComandaAberta();
}

function renderComandaAberta() {
  var c = comandaClienteAtivo;
  if (!c) return;

  var comanda = comandaLivre[c.id] || {};
  var extras = APP_DATA.services.filter(function(s){
    return s.category === 'bebida' || s.category === 'lazer';
  });

  var total = 0;
  Object.values(comanda).forEach(function(i){ total += (i.price||0) * (i.qty||0); });

  var extraHtml = extras.map(function(e) {
    var qty = (comanda[e.id] && comanda[e.id].qty) || 0;
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:0.5px solid rgba(255,255,255,.05);">' +
      '<div style="display:flex;align-items:center;gap:10px;">' +
      '<span style="font-size:22px;">' + e.icon + '</span>' +
      '<div><p style="font-size:13px;font-weight:600;">' + e.name + '</p>' +
      '<p style="font-size:11px;color:var(--text-muted);">R$ ' + (e.price||0) + '</p></div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:8px;">' +
      '<button onclick="alterarComandaLivre(\'' + c.id + '\',' + e.id + ',\'' + e.name.replace(/'/g,'\\x27') + '\',' + (e.price||0) + ',-1)" ' +
      'style="width:32px;height:32px;border-radius:50%;background:rgba(255,30,30,.15);border:1px solid rgba(255,30,30,.3);color:var(--red);font-size:20px;cursor:pointer;font-weight:700;line-height:1;">−</button>' +
      '<span style="font-size:16px;font-weight:800;min-width:28px;text-align:center;">' + qty + '</span>' +
      '<button onclick="alterarComandaLivre(\'' + c.id + '\',' + e.id + ',\'' + e.name.replace(/'/g,'\\x27') + '\',' + (e.price||0) + ',1)" ' +
      'style="width:32px;height:32px;border-radius:50%;background:var(--red);border:none;color:white;font-size:20px;cursor:pointer;font-weight:700;line-height:1;">+</button>' +
      '</div></div>';
  }).join('');

  var resumoHtml = Object.values(comanda).filter(function(i){ return i.qty > 0; }).map(function(i) {
    return '<div style="display:flex;justify-content:space-between;padding:4px 0;">' +
      '<span style="font-size:13px;">' + i.name + ' x' + i.qty + '</span>' +
      '<span style="font-size:13px;font-weight:700;color:var(--red);">R$ ' + (i.price * i.qty).toFixed(0) + '</span></div>';
  }).join('');

  var el = document.getElementById('comanda-resultado');
  if (!el) return;

  el.innerHTML =
    '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;padding:12px 14px;background:var(--card);border-radius:12px;border:1px solid rgba(255,30,30,.3);">' +
      '<span style="font-size:22px;">👤</span>' +
      '<div><p style="font-size:15px;font-weight:700;">' + c.name + '</p>' +
      '<p style="font-size:12px;color:var(--text-muted);">Comanda aberta</p></div>' +
      '<button onclick="fecharComandaSemPagar()" style="margin-left:auto;background:none;border:none;color:var(--text-muted);font-size:12px;cursor:pointer;padding:4px 8px;">✕ Fechar</button>' +
    '</div>' +

    '<p style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:10px;">ADICIONAR CONSUMO</p>' +
    '<div style="background:var(--card);border-radius:14px;padding:14px 16px;margin-bottom:12px;">' +
      extraHtml +
    '</div>' +

    (total > 0 ?
      '<div style="background:rgba(255,30,30,.08);border:1px solid rgba(255,30,30,.25);border-radius:12px;padding:14px 16px;margin-bottom:16px;">' +
        '<p style="font-size:11px;font-weight:700;color:var(--text-muted);margin-bottom:8px;">RESUMO</p>' +
        resumoHtml +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;padding-top:8px;border-top:0.5px solid rgba(255,255,255,.08);">' +
          '<span style="font-size:14px;font-weight:700;">TOTAL</span>' +
          '<span style="font-size:22px;font-weight:800;color:var(--red);">R$ ' + total.toFixed(0) + '</span>' +
        '</div>' +
      '</div>' +
      '<button class="btn" onclick="confirmarPagamentoLivre(\'' + c.id + '\',\'' + c.name.replace(/'/g,'\\x27') + '\')">💰 CONFIRMAR PAGAMENTO (R$ ' + total.toFixed(0) + ')</button>'
    : '<p style="text-align:center;color:var(--text-muted);font-size:13px;padding:10px;">Adicione itens para abrir a comanda.</p>');
}

async function alterarComandaLivre(clientId, itemId, name, price, delta) {
  if (!comandaLivre[clientId]) comandaLivre[clientId] = {};
  if (!comandaLivre[clientId][itemId]) comandaLivre[clientId][itemId] = { name:name, price:price, qty:0 };
  var novaQty = Math.max(0, comandaLivre[clientId][itemId].qty + delta);
  comandaLivre[clientId][itemId].qty = novaQty;

  // Persiste no Supabase imediatamente
  if (novaQty === 0) {
    await sb.from('comanda_itens').delete()
      .eq('barber_id', authState.user.id)
      .eq('client_id', clientId)
      .eq('item_id', itemId);
  } else {
    await sb.from('comanda_itens').upsert({
      barber_id: authState.user.id,
      client_id: clientId,
      item_id: itemId,
      item_name: name,
      item_price: price,
      qty: novaQty,
      updated_at: new Date().toISOString()
    }, { onConflict: 'barber_id,client_id,item_id' });
  }

  renderComandaAberta();
}

function fecharComandaSemPagar() {
  // Mantém os dados — só fecha a view
  comandaClienteAtivo = null;
  var el = document.getElementById('comanda-resultado');
  if (el) el.innerHTML = '<p style="text-align:center;color:var(--text-muted);font-size:13px;padding:20px;">Comanda salva. Busque o cliente para continuar.</p>';
}

async function confirmarPagamentoLivre(clientId, clientName) {
  var comanda = comandaLivre[clientId] || {};
  var total = 0;
  var notas = [];
  Object.values(comanda).forEach(function(i){
    if (i.qty > 0) { total += i.price * i.qty; notas.push(i.name + ' x' + i.qty); }
  });
  if (total === 0) return;

  var result = await sb.from('appointments').insert({
    client_id: clientId,
    barber_id: authState.user.id,
    service_id: null,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0,8),
    status: 'concluido',
    price: total,
    notes: 'Consumo: ' + notas.join(', ')
  });

  if (result.error) { alert('Erro ao salvar: ' + result.error.message); return; }

  // Limpa comanda no banco e na memória
  await sb.from('comanda_itens').delete()
    .eq('barber_id', authState.user.id)
    .eq('client_id', clientId);

  comandaLivre[clientId] = {};
  comandaClienteAtivo = null;

  var el = document.getElementById('comanda-resultado');
  el.innerHTML =
    '<div style="text-align:center;padding:30px;">' +
      '<div style="font-size:50px;margin-bottom:12px;">✅</div>' +
      '<p style="font-size:18px;font-weight:700;color:white;">Pagamento confirmado!</p>' +
      '<p style="color:var(--text-muted);margin-top:6px;">R$ ' + total.toFixed(0) + ' registrado para ' + clientName + '.</p>' +
      '<button class="btn" style="margin-top:20px;" onclick="reRenderScreen(\'comanda\')">Nova comanda</button>' +
    '</div>';
}