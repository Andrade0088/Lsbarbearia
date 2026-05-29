function renderChat() {
  if (!requireAuth()) return '<div class="screen" id="screen-chat"></div>';
  var isBarbeiro = authState.role === 'barbeiro' || authState.role === 'adm';

  return `
  <div class="screen" id="screen-chat">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('home')">←</button>
      <span class="page-title">MENSAGENS</span>
      <span style="width:24px"></span>
    </div>

    <!-- Lista de conversas -->
    <div id="chat-list-view" style="padding:0;">
      ${!isBarbeiro ? `
      <!-- Cliente: lista os barbeiros para iniciar conversa -->
      <div style="padding:14px 20px 8px;">
        <p style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:12px;">FALAR COM UM BARBEIRO</p>
        ${APP_DATA.barbers.map(function(b) {
          var hasPhoto = b.photo && b.photo.indexOf('_URL') < 0;
          return '<div onclick="buscarConversaBarbeiro(\'' + b.id + '\',\'' + b.name + '\',\'' + (b.phone||'') + '\')" ' +
            'style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:0.5px solid var(--border);cursor:pointer;">' +
            '<div style="width:46px;height:46px;border-radius:50%;border:2px solid var(--red);overflow:hidden;flex-shrink:0;' +
            'background:var(--card);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:var(--red);">' +
            (hasPhoto ? '<img src="' + b.photo + '" style="width:100%;height:100%;object-fit:cover;">' : b.name.charAt(0)) +
            '</div>' +
            '<div style="flex:1;"><p style="font-size:14px;font-weight:700;">' + b.name + '</p>' +
            '<p style="font-size:12px;color:var(--text-muted);">💈 Barbeiro · ' + b.nick + '</p></div>' +
            '<span style="color:var(--red);font-size:18px;">›</span>' +
            '</div>';
        }).join('')}
      </div>
      <div style="padding:14px 20px 4px;">
        <p style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:8px;">CONVERSAS RECENTES</p>
      </div>` : `
      <!-- Barbeiro: ver conversas de clientes -->
      <div style="padding:14px 20px 4px;">
        <p style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:8px;">CONVERSAS COM CLIENTES</p>
      </div>`}

      <div id="conversations-list">
        <div style="text-align:center;padding:30px 20px;color:var(--text-muted);">
          <div style="font-size:36px;margin-bottom:10px;">💬</div>
          <p style="font-size:13px;">Carregando conversas...</p>
        </div>
      </div>
    </div>

    <!-- Tela de conversa individual -->
    <div id="chat-convo-view" style="display:none;flex-direction:column;position:fixed;inset:0;background:var(--dark);z-index:50;">
      <div style="padding:12px 16px;border-bottom:1px solid var(--border);
        display:flex;align-items:center;gap:12px;background:var(--card2);flex-shrink:0;">
        <button onclick="closeConvo()" style="background:none;border:none;color:white;font-size:20px;cursor:pointer;padding:4px;">←</button>
        <div id="convo-avatar" style="width:38px;height:38px;border-radius:50%;background:var(--red);
          display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:white;flex-shrink:0;overflow:hidden;"></div>
        <div style="flex:1;">
          <p id="convo-name" style="font-size:14px;font-weight:700;"></p>
          <p id="convo-role" style="font-size:11px;color:var(--text-muted);"></p>
        </div>
        <a id="convo-phone-btn" href="#"
          style="padding:7px 14px;border:1px solid var(--red);border-radius:20px;color:var(--red);
          font-size:12px;font-weight:600;text-decoration:none;">📞 Ligar</a>
      </div>

      <div id="messages-area" style="flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:10px;padding-bottom:80px;"></div>

      <div style="position:fixed;bottom:0;left:0;right:0;padding:10px 14px 24px;
        border-top:1px solid var(--border);display:flex;gap:8px;align-items:center;
        background:var(--card2);z-index:51;">
        <input id="msg-input" type="text" placeholder="Digite uma mensagem..."
          onkeydown="if(event.key==='Enter')sendMessage()"
          style="flex:1;padding:12px 16px;background:var(--card);border:1px solid rgba(255,255,255,.1);
          border-radius:24px;color:white;font-size:14px;outline:none;">
        <button onclick="sendMessage()"
          style="width:44px;height:44px;border-radius:50%;background:var(--red);border:none;
          color:white;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;">➤</button>
      </div>
    </div>
  </div>`;
}

var currentConvoUserId = null;
var currentConvoPhone  = null;
var msgSubscription    = null;

// Cliente busca UUID do barbeiro pelo id do mock
async function buscarConversaBarbeiro(barberId, name, phone) {
  var barberMock = null;
  for (var i = 0; i < APP_DATA.barbers.length; i++) {
    if (APP_DATA.barbers[i].id == barberId) { barberMock = APP_DATA.barbers[i]; break; }
  }
  if (!barberMock) return;

  var result = await sb.from('profiles').select('id,avatar_url').eq('nick', barberMock.nick).single();
  if (result.data) {
    openConvo(result.data.id, name, phone, 'barbeiro', result.data.avatar_url, barberMock.photo);
  }
}

async function loadChats() {
  if (!authState.user) return;

  // Se veio de clienteDetalhe, abre direto
  if (currentState.pendingChat) {
    var pc = currentState.pendingChat;
    currentState.pendingChat = null;
    setTimeout(function() { openConvo(pc.userId, pc.name, pc.phone, pc.role); }, 100);
    return;
  }

  var result = await sb
    .from('messages')
    .select('*, sender:profiles!messages_sender_id_fkey(id,name,nick,avatar_url,phone,role), receiver:profiles!messages_receiver_id_fkey(id,name,nick,avatar_url,phone,role)')
    .or('sender_id.eq.' + authState.user.id + ',receiver_id.eq.' + authState.user.id)
    .order('created_at', { ascending: false });

  var el = document.getElementById('conversations-list');
  if (!el) return;

  if (result.error || !result.data || result.data.length === 0) {
    el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);">' +
      '<p style="font-size:13px;">Nenhuma conversa ainda.</p>' +
      '<p style="font-size:12px;margin-top:6px;">Selecione um barbeiro acima para iniciar!</p>' +
      '</div>';
    return;
  }

  // Agrupa por conversa (última mensagem de cada par)
  var convos = {};
  result.data.forEach(function(msg) {
    var otherId = msg.sender_id === authState.user.id ? msg.receiver_id : msg.sender_id;
    var other   = msg.sender_id === authState.user.id ? msg.receiver   : msg.sender;
    if (!convos[otherId]) {
      convos[otherId] = { other:other, lastMsg:msg, unread:0 };
    }
    if (!msg.read && msg.receiver_id === authState.user.id) convos[otherId].unread++;
  });

  el.innerHTML = Object.values(convos).map(function(c) {
    var o = c.other;
    var photoHtml = o && o.avatar_url
      ? '<img src="' + o.avatar_url + '" style="width:50px;height:50px;border-radius:50%;object-fit:cover;border:2px solid var(--red);">'
      : '<div style="width:50px;height:50px;border-radius:50%;background:var(--red);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:white;flex-shrink:0;">' + ((o&&o.name)||'?').charAt(0) + '</div>';

    var timeStr = new Date(c.lastMsg.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    return '<div onclick="openConvo(\'' + (o&&o.id) + '\',\'' + ((o&&o.name)||'').replace(/'/g,"\\x27") + '\',\'' + ((o&&o.phone)||'') + '\',\'' + ((o&&o.role)||'') + '\')" ' +
      'style="display:flex;align-items:center;gap:12px;padding:14px 20px;border-bottom:0.5px solid var(--border);cursor:pointer;">' +
      photoHtml +
      '<div style="flex:1;min-width:0;">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;">' +
      '<p style="font-size:14px;font-weight:700;">' + ((o&&o.name)||'Usuário') + '</p>' +
      '<p style="font-size:11px;color:var(--text-muted);">' + timeStr + '</p>' +
      '</div>' +
      '<p style="font-size:12px;color:var(--text-muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' +
      (c.lastMsg.sender_id === authState.user.id ? 'Você: ' : '') + c.lastMsg.content +
      '</p></div>' +
      (c.unread > 0 ? '<div style="width:20px;height:20px;border-radius:50%;background:var(--red);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">' + c.unread + '</div>' : '') +
      '</div>';
  }).join('');
}

function openConvo(userId, name, phone, role, avatarUrl, photoUrl) {
  currentConvoUserId = userId;
  currentConvoPhone  = phone;

  document.getElementById('chat-list-view').style.display  = 'none';
  document.getElementById('chat-convo-view').style.display = 'flex';

  document.getElementById('convo-name').textContent = name || 'Usuário';
  document.getElementById('convo-role').textContent = role === 'barbeiro' ? '💈 Barbeiro' : '👤 Cliente';

  var avatarEl = document.getElementById('convo-avatar');
  var photo = avatarUrl || photoUrl;
  if (photo && photo.indexOf('_URL') < 0) {
    avatarEl.innerHTML = '<img src="' + photo + '" style="width:100%;height:100%;object-fit:cover;">';
  } else {
    avatarEl.textContent = (name||'?').charAt(0).toUpperCase();
  }

  var phoneBtn = document.getElementById('convo-phone-btn');
  if (phone) phoneBtn.href = 'tel:' + phone;
  else phoneBtn.style.display = 'none';

  loadMessages(userId);
  subscribeMessages(userId);
  markAsRead(userId);
}

function closeConvo() {
  currentConvoUserId = null;
  if (msgSubscription) { sb.removeChannel(msgSubscription); msgSubscription = null; }
  document.getElementById('chat-list-view').style.display  = 'block';
  document.getElementById('chat-convo-view').style.display = 'none';
  loadChats();
}

async function loadMessages(userId) {
  var result = await sb
    .from('messages')
    .select('*')
    .or(
      'and(sender_id.eq.' + authState.user.id + ',receiver_id.eq.' + userId + '),' +
      'and(sender_id.eq.' + userId + ',receiver_id.eq.' + authState.user.id + ')'
    )
    .order('created_at', { ascending: true });

  renderMessages(result.data || []);
}

function renderMessages(msgs) {
  var el = document.getElementById('messages-area');
  if (!el) return;

  if (msgs.length === 0) {
    el.innerHTML = '<div style="text-align:center;padding:40px 20px;color:var(--text-muted);">' +
      '<div style="font-size:36px;margin-bottom:10px;">👋</div>' +
      '<p style="font-size:13px;">Início da conversa.<br>Diga olá!</p></div>';
    return;
  }

  el.innerHTML = msgs.map(function(m) {
    var isMe = m.sender_id === authState.user.id;
    var time = new Date(m.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    return '<div style="display:flex;flex-direction:column;align-items:' + (isMe?'flex-end':'flex-start') + ';">' +
      '<div style="max-width:78%;padding:10px 14px;' +
      'border-radius:' + (isMe?'14px 14px 2px 14px':'14px 14px 14px 2px') + ';' +
      'background:' + (isMe?'var(--red)':'var(--card)') + ';font-size:14px;line-height:1.4;' +
      'border:' + (isMe?'none':'1px solid rgba(255,255,255,.08)') + ';">' +
      m.content + '</div>' +
      '<span style="font-size:10px;color:var(--text-muted);margin-top:3px;">' + time + '</span>' +
      '</div>';
  }).join('');

  el.scrollTop = el.scrollHeight;
}

async function sendMessage() {
  var input = document.getElementById('msg-input');
  var content = input ? input.value.trim() : '';
  if (!content || !currentConvoUserId) return;
  input.value = '';

  var result = await sb.from('messages').insert({
    sender_id:   authState.user.id,
    receiver_id: currentConvoUserId,
    content:     content,
    read:        false
  });

  if (!result.error) loadMessages(currentConvoUserId);
}

function subscribeMessages(userId) {
  if (msgSubscription) sb.removeChannel(msgSubscription);
  msgSubscription = sb.channel('msgs-' + authState.user.id + '-' + userId)
    .on('postgres_changes', { event:'INSERT', schema:'public', table:'messages' }, function(payload) {
      var msg = payload.new;
      if ((msg.sender_id === userId && msg.receiver_id === authState.user.id) ||
          (msg.sender_id === authState.user.id && msg.receiver_id === userId)) {
        loadMessages(userId);
      }
    })
    .subscribe();
}

async function markAsRead(userId) {
  await sb.from('messages')
    .update({ read:true })
    .eq('sender_id', userId)
    .eq('receiver_id', authState.user.id);
}

function startChatWithClient(userId, name, phone) {
  currentState.pendingChat = { userId:userId, name:name, phone:phone, role:'cliente' };
  goTo('chat');
}