function renderMeusAgendamentos() {
  if (!requireAuth()) return '<div class="screen" id="screen-meusAgendamentos"></div>';
  return `
  <div class="screen" id="screen-meusAgendamentos">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('perfil')">←</button>
      <span class="page-title">MEUS AGENDAMENTOS</span>
      <span style="width:24px"></span>
    </div>
    <div id="meus-appts-content" style="padding:18px 20px;">
      <div style="text-align:center;padding:40px;color:var(--text-muted);">
        <div style="font-size:30px;margin-bottom:10px;">⏳</div>
        <p>Carregando...</p>
      </div>
    </div>
  </div>`;
}

async function loadMeusAgendamentos() {
  if (!authState.user) return;
  var el = document.getElementById('meus-appts-content');
  if (!el) return;

  var result = await sb
    .from('appointments')
    .select('*, services(name,price), profiles!appointments_barber_id_fkey(name,avatar_url)')
    .eq('client_id', authState.user.id)
    .order('date', { ascending: false })
    .order('time', { ascending: false });

  if (result.error || !result.data || result.data.length === 0) {
    el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);">' +
      '<div style="font-size:40px;margin-bottom:12px;">📋</div>' +
      '<p>Nenhum agendamento ainda.</p>' +
      '<button onclick="goTo(\'agendar\')" class="btn" style="margin-top:16px;">Agendar agora</button>' +
      '</div>';
    return;
  }

  var statusLabel = { confirmado:'Confirmado', pendente:'Pendente', concluido:'Concluído', cancelado:'Cancelado' };
  var statusClass = { confirmado:'status-confirmado', pendente:'status-pendente', concluido:'status-concluido', cancelado:'status-pendente' };

  el.innerHTML = result.data.map(function(appt) {
    var dateStr = new Date(appt.date+'T00:00:00').toLocaleDateString('pt-BR');
    var barberName = (appt.profiles && appt.profiles.name) || 'Barbeiro';
    var serviceName = (appt.services && appt.services.name) || 'Serviço';
    var price = appt.services ? parseFloat(appt.services.price||0).toFixed(0) : '0';
    return '<div style="background:var(--card);border-radius:14px;padding:14px 16px;margin-bottom:10px;border:1px solid var(--border);">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
      '<p style="font-size:15px;font-weight:700;">' + serviceName + '</p>' +
      '<span class="cli-status ' + (statusClass[appt.status]||'') + '">' + (statusLabel[appt.status]||appt.status) + '</span>' +
      '</div>' +
      '<p style="font-size:13px;color:var(--text-muted);">💈 ' + barberName + '</p>' +
      '<div style="display:flex;justify-content:space-between;margin-top:8px;">' +
      '<span style="font-size:12px;color:var(--text-muted);">📅 ' + dateStr + ' · ' + (appt.time||'').slice(0,5) + '</span>' +
      '<span style="font-size:14px;font-weight:700;color:var(--red);">R$ ' + price + '</span>' +
      '</div>' +
      '</div>';
  }).join('');
}