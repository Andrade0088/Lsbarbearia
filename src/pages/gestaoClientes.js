function renderGestaoClientes() {
  if (!requireRole('barbeiro','adm')) return '<div class="screen" id="screen-gestaoClientes"></div>';
  return `
  <div class="screen" id="screen-gestaoClientes">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('barberDash')">←</button>
      <span class="page-title">CLIENTES</span>
      <span style="width:24px"></span>
    </div>
    <div style="padding:16px 20px 100px;">
      <div style="display:flex;gap:8px;margin-bottom:16px;">
        <input id="gc-search" type="text" placeholder="Buscar por nome ou apelido..."
          onkeydown="if(event.key==='Enter')loadGestaoClientes()"
          style="flex:1;padding:12px 14px;background:var(--card);border:1px solid rgba(255,255,255,.1);
          border-radius:12px;color:white;font-size:13px;outline:none;">
        <button onclick="loadGestaoClientes()" style="padding:12px 16px;background:var(--red);border:none;
          border-radius:12px;color:white;font-size:13px;font-weight:700;cursor:pointer;">🔍</button>
      </div>
      <div style="display:flex;gap:8px;margin-bottom:16px;">
        <button onclick="setGcFiltro('todos')" id="gc-btn-todos"
          style="flex:1;padding:8px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;
          background:var(--red);border:none;color:white;">Todos</button>
        <button onclick="setGcFiltro('bloqueado')" id="gc-btn-bloqueado"
          style="flex:1;padding:8px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;
          background:var(--card);border:1px solid var(--border);color:var(--text-muted);">Bloqueados</button>
      </div>
      <div id="gc-lista"><p style="text-align:center;color:var(--text-muted);padding:20px;">Carregando...</p></div>
    </div>
  </div>`;
}

var gcFiltro = 'todos';

function setGcFiltro(f) {
  gcFiltro = f;
  document.getElementById('gc-btn-todos').style.background = f === 'todos' ? 'var(--red)' : 'var(--card)';
  document.getElementById('gc-btn-todos').style.color = f === 'todos' ? 'white' : 'var(--text-muted)';
  document.getElementById('gc-btn-bloqueado').style.background = f === 'bloqueado' ? '#ffa500' : 'var(--card)';
  document.getElementById('gc-btn-bloqueado').style.color = f === 'bloqueado' ? 'white' : 'var(--text-muted)';
  loadGestaoClientes();
}

async function loadGestaoClientes() {
  var el = document.getElementById('gc-lista');
  if (!el) return;
  el.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:20px;">Carregando...</p>';

  var termo = (document.getElementById('gc-search')||{}).value || '';

  var query = sb.from('profiles').select('id,name,nick,phone,avatar_url,blocked').eq('role','cliente').order('name');
  if (termo.trim()) query = query.or('name.ilike.%' + termo + '%,nick.ilike.%' + termo + '%');
  if (gcFiltro === 'bloqueado') query = query.eq('blocked', true);

  var result = await query;
  if (result.error || !result.data || result.data.length === 0) {
    el.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:30px;">Nenhum cliente encontrado.</p>';
    return;
  }

  el.innerHTML = result.data.map(function(c) {
    var photoHtml = c.avatar_url
      ? '<img src="' + c.avatar_url + '" style="width:46px;height:46px;border-radius:50%;object-fit:cover;border:2px solid ' + (c.blocked ? '#ffa500' : 'var(--red)') + ';">'
      : '<div style="width:46px;height:46px;border-radius:50%;background:' + (c.blocked ? '#ffa500' : 'var(--red)') + ';display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:white;">' + c.name.charAt(0) + '</div>';

    return '<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--card);' +
      'border:1px solid ' + (c.blocked ? 'rgba(255,165,0,.4)' : 'rgba(255,255,255,.08)') + ';' +
      'border-radius:12px;margin-bottom:8px;">' +
      photoHtml +
      '<div style="flex:1;">' +
        '<p style="font-size:14px;font-weight:700;">' + c.name + '</p>' +
        '<p style="font-size:12px;color:' + (c.blocked ? '#ffa500' : 'var(--text-muted)') + ';">' +
          (c.blocked ? '🔒 Bloqueado' : (c.nick || '')) + '</p>' +
      '</div>' +
      '<div style="display:flex;gap:6px;">' +
        '<button onclick="gcToggleBloquear(\'' + c.id + '\',\'' + c.name.replace(/'/g,'\\x27') + '\',' + (c.blocked?'true':'false') + ')" ' +
          'style="padding:8px 10px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;' +
          'background:' + (c.blocked ? 'rgba(0,200,100,.1)' : 'rgba(255,165,0,.1)') + ';' +
          'border:1px solid ' + (c.blocked ? 'rgba(0,200,100,.4)' : 'rgba(255,165,0,.4)') + ';' +
          'color:' + (c.blocked ? '#00c864' : '#ffa500') + ';">' +
          (c.blocked ? '🔓' : '🔒') + '</button>' +
        '<button onclick="gcExcluir(\'' + c.id + '\',\'' + c.name.replace(/'/g,'\\x27') + '\')" ' +
          'style="padding:8px 10px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;' +
          'background:rgba(255,30,30,.08);border:1px solid rgba(255,30,30,.3);color:#ff4444;">🗑</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

async function gcToggleBloquear(clientId, name, atualBloqueado) {
  var msg = atualBloqueado ? 'Desbloquear ' + name + '?' : 'Bloquear ' + name + '? Ele não poderá agendar.';
  if (!confirm(msg)) return;
  await sb.from('profiles').update({ blocked: !atualBloqueado }).eq('id', clientId);
  loadGestaoClientes();
}

async function gcExcluir(clientId, name) {
  if (!confirm('Excluir o perfil de ' + name + '? Ação irreversível.')) return;
  if (!confirm('Confirma exclusão de ' + name + '?')) return;
  await sb.from('appointments').update({ status:'cancelado' }).eq('client_id', clientId).in('status',['pendente','confirmado']);
  var result = await sb.from('profiles').delete().eq('id', clientId);
  if (result.error) { alert('Erro: ' + result.error.message); return; }
  loadGestaoClientes();
}