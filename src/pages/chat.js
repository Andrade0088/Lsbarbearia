function renderChat() {
  if (!requireAuth()) return '<div class="screen" id="screen-chat"></div>';

  const isBarbeiro = authState.role === 'barbeiro' || authState.role === 'adm';

  return `
  <div class="screen" id="screen-chat">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('home')">←</button>
      <span class="page-title">MENSAGENS</span>
      <span style="width:24px"></span>
    </div>

    <div id="chat-list-view">
      <div id="conversations-list">
        <div style="text-align:center;padding:40px 20px;color:var(--text-muted);">
          <div style="font-size:36px;margin-bottom:10px;">💬</div>
          <p>Carregando conversas...</p>
        </div>
      </div>
    </div>

    <!-- Tela de conversa individual -->
    <div id="chat-convo-view" style="display:none;flex-direction:column;height:calc(100vh - 140px);">
      <div style="padding:12px 16px;border-bottom:1px solid var(--border);
        display:flex;align-items:center;gap:12px;background:var(--card2);">
        <button onclick="closeConvo()" style="background:none;border:none;color:white;font-size:18px;cursor:pointer;">←</button>
        <div id="convo-avatar" style="width:38px;height:38px;border-radius:50%;background:var(--red);
          display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:white;flex-shrink:0;"></div>
        <div>
          <p id="convo-name" style="font-size:14px;font-weight:700;"></p>
          <p id="convo-role" style="font-size:11px;color:var(--text-muted);"></p>
        </div>
        <a id="convo-phone-btn" href="#" style="margin-left:auto;padding:6px 12px;
          border:1px solid var(--red);border-radius:20px;color:var(--red);
          font-size:12px;font-weight:600;text-decoration:none;">📞 Ligar</a>
      </div>

      <div id="messages-area" style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:8px;"></div>

      <div style="padding:10px 14px;border-top:1px solid var(--border);display:flex;gap:8px;align-items:center;background:var(--card2);">
        <input id="msg-input" type="text" placeholder="Digite uma mensagem..."
          onkeydown="if(event.key==='Enter')sendMessage()"
          style="flex:1;padding:12px 14px;background:var(--card);border:1px solid rgba(255,255,255,.1);
          border-radius:24px;color:white;font-size:13px;outline:none;">
        <button onclick="sendMessage()"
          style="width:42px;height:42px;border-radius:50%;background:var(--red);border:none;
          color:white;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;">➤</button>
      </div>
    </div>
  </div>`;
}

let currentConvoUserId = null;
let currentConvoPhone = null;
let msgSubscription = null;

async function loadChats() {
  if (!authState.user) return;

  // Se veio de clienteDetalhe, abre direto a conversa
  if (currentState.pendingChat) {
    var pc = currentState.pendingChat;
    currentState.pendingChat = null;
    setTimeout(function() { openConvo(pc.userId, pc.name, pc.phone, pc.role); }, 100);
    return;
  }

  // Busca todas as mensagens do usuário
  const { data, error } = await sb
    .from('messages')
    .select('*, sender:profiles!messages_sender_id_fkey(id,name,nick,avatar_url,phone,role), receiver:profiles!messages_receiver_id_fkey(id,name,nick,avatar_url,phone,role)')
    .or(`sender_id.eq.${authState.user.id},receiver_id.eq.${authState.user.id}`)
    .order('created_at', { ascending: false });

  const el = document.getElementById('conversations-list');
  if (!el) return;

  if (error || !data || data.length === 0) {
    el.innerHTML = `
      <div style="text-align:center;padding:40px 20px;color:var(--text-muted);">
        <div style="font-size:40px;margin-bottom:12px;">💬</div>
        <p style="font-size:14px;">Nenhuma conversa ainda.</p>
        ${authState.role === 'cliente' ? `
          <p style="font-size:12px;margin-top:8px;">Agende um serviço para conversar com um barbeiro!</p>
          <button class="btn-sm" style="margin-top:14px;" onclick="goTo('barbeiros')">Ver barbeiros</button>
        ` : ''}
      </div>`;
    return;
  }

  // Agrupa por conversa
  const convos = {};
  data.forEach(msg => {
    const otherId = msg.sender_id === authState.user.id ? msg.receiver_id : msg.sender_id;
    const other   = msg.sender_id === authState.user.id ? msg.receiver   : msg.sender;
    if (!convos[otherId]) convos[otherId] = { other, lastMsg: msg, unread: 0 };
    if (!msg.read && msg.receiver_id === authState.user.id) convos[otherId].unread++;
  });

  el.innerHTML = Object.values(convos).map(c => {
    const o = c.other;
    const photoHtml = o?.avatar_url
      ? `<img src="${o.avatar_url}" style="width:50px;height:50px;border-radius:50%;object-fit:cover;border:2px solid var(--red);">`
      : `<div style="width:50px;height:50px;border-radius:50%;background:var(--red);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:white;flex-shrink:0;">${(o?.name||'?').charAt(0)}</div>`;

    return `
    <div onclick="openConvo('${o?.id}','${o?.name}','${o?.phone||''}','${o?.role||''}')"
      style="display:flex;align-items:center;gap:12px;padding:14px 20px;
      border-bottom:1px solid var(--border);cursor:pointer;transition:.2s;"
      onmouseover="this.style.background='rgba(255,30,30,.05)'" onmouseout="this.style.background=''">
      ${photoHtml}
      <div style="flex:1;min-width:0;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <p style="font-size:14px;font-weight:700;">${o?.name || 'Usuário'}</p>
          <p style="font-size:11px;color:var(--text-muted);">${new Date(c.lastMsg.created_at).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}</p>
        </div>
        <p style="font-size:12px;color:var(--text-muted);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
          ${c.lastMsg.content}
        </p>
      </div>
      ${c.unread > 0 ? `<div style="width:20px;height:20px;border-radius:50%;background:var(--red);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;">${c.unread}</div>` : ''}
    </div>`;
  }).join('');
}

function openConvo(userId, name, phone, role) {
  currentConvoUserId = userId;
  currentConvoPhone  = phone;

  document.getElementById('chat-list-view').style.display = 'none';
  document.getElementById('chat-convo-view').style.display = 'flex';
  document.getElementById('convo-name').textContent = name || 'Usuário';
  document.getElementById('convo-role').textContent = role === 'barbeiro' ? '💈 Barbeiro' : '👤 Cliente';
  document.getElementById('convo-avatar').textContent = (name||'?').charAt(0).toUpperCase();
  const phoneBtn = document.getElementById('convo-phone-btn');
  if (phone) phoneBtn.href = `tel:${phone}`;
  else phoneBtn.style.display = 'none';

  loadMessages(userId);
  subscribeMessages(userId);
  markAsRead(userId);
}

function closeConvo() {
  currentConvoUserId = null;
  if (msgSubscription) { sb.removeChannel(msgSubscription); msgSubscription = null; }
  document.getElementById('chat-list-view').style.display = 'block';
  document.getElementById('chat-convo-view').style.display = 'none';
  loadChats();
}

async function loadMessages(userId) {
  const { data } = await sb
    .from('messages')
    .select('*')
    .or(`and(sender_id.eq.${authState.user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${authState.user.id})`)
    .order('created_at', { ascending: true });

  renderMessages(data || []);
}

function renderMessages(msgs) {
  const el = document.getElementById('messages-area');
  if (!el) return;
  el.innerHTML = msgs.map(m => {
    const isMe = m.sender_id === authState.user.id;
    const time = new Date(m.created_at).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    return `
    <div style="display:flex;flex-direction:column;align-items:${isMe?'flex-end':'flex-start'};">
      <div style="max-width:75%;padding:10px 14px;border-radius:${isMe?'14px 14px 2px 14px':'14px 14px 14px 2px'};
        background:${isMe?'var(--red)':'var(--card)'};font-size:13px;
        border:${isMe?'none':'1px solid rgba(255,255,255,.08)'};">
        ${m.content}
      </div>
      <span style="font-size:10px;color:var(--text-muted);margin-top:3px;">${time}</span>
    </div>`;
  }).join('');
  el.scrollTop = el.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById('msg-input');
  const content = input?.value?.trim();
  if (!content || !currentConvoUserId) return;

  input.value = '';
  const { error } = await sb.from('messages').insert({
    sender_id:   authState.user.id,
    receiver_id: currentConvoUserId,
    content,
    read: false
  });

  if (!error) loadMessages(currentConvoUserId);
}

function subscribeMessages(userId) {
  if (msgSubscription) sb.removeChannel(msgSubscription);
  msgSubscription = sb.channel('messages-' + userId)
    .on('postgres_changes', { event:'INSERT', schema:'public', table:'messages' }, () => {
      loadMessages(userId);
    })
    .subscribe();
}

async function markAsRead(userId) {
  await sb.from('messages')
    .update({ read: true })
    .eq('sender_id', userId)
    .eq('receiver_id', authState.user.id);
}