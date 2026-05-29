// ============================================================
//  REALTIME — Supabase subscriptions
//  Atualiza automaticamente sem precisar recarregar a página
// ============================================================

var realtimeChannels = [];

function initRealtime() {
  if (!authState || !authState.user) return;

  // Limpa canais anteriores
  clearRealtime();

  if (authState.role === 'barbeiro' || authState.role === 'adm') {
    subscribeBarberRealtime();
  } else {
    subscribeClienteRealtime();
  }
}

function clearRealtime() {
  realtimeChannels.forEach(function(ch) {
    try { sb.removeChannel(ch); } catch(e) {}
  });
  realtimeChannels = [];
}

// ── Barbeiro: atualiza agenda quando chega novo agendamento ──
function subscribeBarberRealtime() {
  var ch = sb.channel('barber-appointments-' + authState.user.id)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'appointments',
      filter: 'barber_id=eq.' + authState.user.id
    }, function(payload) {
      // Atualiza dashboard se estiver aberto
      if (currentScreen === 'barberDash') {
        showRealtimeToast('📅 Agenda atualizada!');
        setTimeout(loadBarberAppointments, 300);
      } else if (currentScreen === 'clienteDetalhe') {
        setTimeout(loadClienteDetalhe, 300);
      } else if (currentScreen === 'ganhos') {
        setTimeout(loadGanhos, 300);
      }

      // Notificação visual sempre
      if (payload.eventType === 'INSERT') {
        showRealtimeToast('🔔 Novo agendamento recebido!', 'success');
        vibrar();
      } else if (payload.eventType === 'UPDATE') {
        showRealtimeToast('📝 Agendamento atualizado');
      }
    })
    .subscribe();

  realtimeChannels.push(ch);

  // Chat em tempo real
  var chChat = sb.channel('barber-messages-' + authState.user.id)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: 'receiver_id=eq.' + authState.user.id
    }, function(payload) {
      if (currentScreen === 'chat') {
        if (currentConvoUserId === payload.new.sender_id) {
          loadMessages(currentConvoUserId);
        } else {
          loadChats();
        }
        showRealtimeToast('💬 Nova mensagem!');
      } else {
        showRealtimeToast('💬 Nova mensagem de cliente!', 'success');
        vibrar();
      }
    })
    .subscribe();

  realtimeChannels.push(chChat);
}

// ── Cliente: atualiza quando barbeiro confirma/cancela ──
function subscribeClienteRealtime() {
  var ch = sb.channel('client-appointments-' + authState.user.id)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'appointments',
      filter: 'client_id=eq.' + authState.user.id
    }, function(payload) {
      var status = payload.new.status;
      var msgs = {
        confirmado: '✅ Seu agendamento foi confirmado!',
        cancelado:  '❌ Seu agendamento foi cancelado.',
        concluido:  '✔️ Atendimento concluído!'
      };

      if (msgs[status]) showRealtimeToast(msgs[status], status === 'cancelado' ? 'error' : 'success');

      if (currentScreen === 'meusAgendamentos') setTimeout(loadMeusAgendamentos, 300);
      if (currentScreen === 'perfil') setTimeout(loadNextBooking, 300);
    })
    .subscribe();

  realtimeChannels.push(ch);

  // Chat do cliente
  var chChat = sb.channel('client-messages-' + authState.user.id)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: 'receiver_id=eq.' + authState.user.id
    }, function(payload) {
      if (currentScreen === 'chat') {
        if (currentConvoUserId === payload.new.sender_id) {
          loadMessages(currentConvoUserId);
        } else {
          loadChats();
        }
      }
      showRealtimeToast('💬 Nova mensagem do barbeiro!', 'success');
      vibrar();
    })
    .subscribe();

  realtimeChannels.push(chChat);
}

// ── Toast de notificação ──────────────────────────────────
function showRealtimeToast(msg, type) {
  var existing = document.getElementById('realtime-toast');
  if (existing) existing.parentNode.removeChild(existing);

  var colors = {
    success: { bg:'rgba(0,200,100,.15)', border:'rgba(0,200,100,.4)', color:'#00c864' },
    error:   { bg:'rgba(255,30,30,.15)', border:'rgba(255,30,30,.4)', color:'#ff6666' },
    info:    { bg:'rgba(13,71,255,.15)', border:'rgba(13,71,255,.4)', color:'#6699ff' }
  };
  var c = colors[type] || colors.info;

  var toast = document.createElement('div');
  toast.id = 'realtime-toast';
  toast.style.cssText = 'position:fixed;top:70px;left:50%;transform:translateX(-50%);' +
    'background:' + c.bg + ';border:1px solid ' + c.border + ';color:' + c.color + ';' +
    'padding:10px 18px;border-radius:20px;font-size:13px;font-weight:600;' +
    'z-index:999;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,.4);' +
    'animation:slideDown .3s ease;';
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(function() {
    if (toast.parentNode) {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity .3s';
      setTimeout(function() { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
    }
  }, 3500);
}

// ── Vibração no celular ───────────────────────────────────
function vibrar() {
  if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
}

// Adiciona CSS do toast
var toastStyle = document.createElement('style');
toastStyle.textContent = '@keyframes slideDown { from { opacity:0; transform:translateX(-50%) translateY(-10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }';
document.head.appendChild(toastStyle);