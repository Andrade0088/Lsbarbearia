var calDate = new Date();

function renderAgendar() {
  if (!requireAuth()) return '<div class="screen" id="screen-agendar"></div>';

  return `
  <div class="screen" id="screen-agendar">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('home')">←</button>
      <span class="page-title">AGENDAR</span>
      <span style="width:24px"></span>
    </div>

    <!-- Steps -->
    <div class="steps" style="padding:16px 20px 0;">
      <div class="step">
        <div class="step-circle" id="step1-circle" style="background:linear-gradient(135deg,var(--red),var(--blue));">💈</div>
        <span>Barbeiro</span>
      </div>
      <div class="step-line" id="step-line-1" style="background:rgba(255,255,255,.1);"></div>
      <div class="step">
        <div class="step-circle" id="step2-circle" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);">✂️</div>
        <span>Serviços</span>
      </div>
      <div class="step-line" id="step-line-2" style="background:rgba(255,255,255,.1);"></div>
      <div class="step">
        <div class="step-circle" id="step3-circle" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);">📅</div>
        <span>Data</span>
      </div>
      <div class="step-line" id="step-line-3" style="background:rgba(255,255,255,.1);"></div>
      <div class="step">
        <div class="step-circle" id="step4-circle" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);">✓</div>
        <span>Confirmar</span>
      </div>
    </div>

    <!-- Conteúdo das etapas -->
    <div id="agendar-content" style="padding:20px;"></div>
  </div>`;
}

// Estado do agendamento
var agendarState = {
  step: 1,
  barberId: null,
  barberName: '',
  barberUUID: null,
  services: [], // array de {id, name, price, duration}
  date: '',
  dateISO: '',
  time: '',
  notes: ''
};

function initAgendar() {
  agendarState = { step:1, barberId:null, barberName:'', barberUUID:null, services:[], date:'', dateISO:'', time:'', notes:'' };
  renderAgendarStep(1);
}

function renderAgendarStep(step) {
  agendarState.step = step;
  updateStepIndicators(step);
  var content = document.getElementById('agendar-content');
  if (!content) return;

  if (step === 1) content.innerHTML = renderStepBarbeiro();
  else if (step === 2) content.innerHTML = renderStepServicos();
  else if (step === 3) content.innerHTML = renderStepDataHora();
  else if (step === 4) content.innerHTML = renderStepConfirmar();
}

function updateStepIndicators(step) {
  for (var i = 1; i <= 4; i++) {
    var circle = document.getElementById('step' + i + '-circle');
    var line = document.getElementById('step-line-' + i);
    if (!circle) continue;
    if (i < step) {
      circle.style.background = 'var(--red)';
      circle.style.border = 'none';
      if (line) line.style.background = 'var(--red)';
    } else if (i === step) {
      circle.style.background = 'linear-gradient(135deg,var(--red),var(--blue))';
      circle.style.border = 'none';
    } else {
      circle.style.background = 'rgba(255,255,255,.08)';
      circle.style.border = '1px solid rgba(255,255,255,.15)';
    }
  }
}

// STEP 1 — Escolha o barbeiro
function renderStepBarbeiro() {
  return '<p style="font-size:13px;font-weight:700;color:var(--text-muted);letter-spacing:.5px;margin-bottom:14px;">ESCOLHA O BARBEIRO</p>' +
    APP_DATA.barbers.map(function(b) {
      var hasPhoto = b.photo && b.photo.indexOf('_URL') < 0;
      var isSelected = agendarState.barberId === b.id;
      return '<div onclick="selectAgendarBarber(' + b.id + ',\'' + b.name + '\',\'' + b.nick + '\')" ' +
        'style="display:flex;align-items:center;gap:12px;padding:14px;' +
        'background:' + (isSelected ? 'rgba(255,30,30,.08)' : 'var(--card)') + ';' +
        'border:1px solid ' + (isSelected ? 'var(--red)' : 'rgba(255,255,255,.08)') + ';' +
        'border-radius:14px;margin-bottom:10px;cursor:pointer;">' +
        '<div style="width:52px;height:52px;border-radius:50%;border:2px solid ' + (isSelected ? 'var(--red)' : 'rgba(255,255,255,.2)') + ';' +
        'overflow:hidden;flex-shrink:0;background:var(--card2);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:var(--red);">' +
        (hasPhoto ? '<img src="' + b.photo + '" style="width:100%;height:100%;object-fit:cover;">' : b.name.charAt(0)) +
        '</div>' +
        '<div style="flex:1;">' +
        '<p style="font-size:15px;font-weight:700;">' + b.name + '</p>' +
        '<p style="font-size:12px;color:var(--text-muted);margin-top:2px;">' + b.nick + '</p>' +
        '</div>' +
        '<span style="font-size:20px;color:' + (isSelected ? 'var(--red)' : 'rgba(255,255,255,.2)') + ';">' + (isSelected ? '●' : '○') + '</span>' +
        '</div>';
    }).join('') +
    '<button class="btn" style="margin-top:8px;" onclick="goAgendarStep2()">PRÓXIMO →</button>';
}

function selectAgendarBarber(id, name, nick) {
  agendarState.barberId = id;
  agendarState.barberName = name;
  agendarState.barberNick = nick;
  renderAgendarStep(1);
}

function goAgendarStep2() {
  if (!agendarState.barberId) {
    alert('Escolha um barbeiro!'); return;
  }
  renderAgendarStep(2);
}

// STEP 2 — Escolha os serviços (carrinho)
function renderStepServicos() {
  var bookable = APP_DATA.services.filter(function(s) {
    return APP_DATA.bookableCategories.indexOf(s.category) >= 0;
  });

  var total = agendarState.services.reduce(function(sum, s) { return sum + (s.price || 0); }, 0);

  return '<p style="font-size:13px;font-weight:700;color:var(--text-muted);letter-spacing:.5px;margin-bottom:6px;">ESCOLHA OS SERVIÇOS</p>' +
    '<p style="font-size:12px;color:var(--text-muted);margin-bottom:14px;">Selecione um ou mais serviços</p>' +

    bookable.map(function(s) {
      var isSelected = agendarState.services.some(function(x) { return x.id === s.id; });
      return '<div onclick="toggleServico(' + s.id + ',\'' + s.name.replace(/'/g,"\\x27") + '\',' + (s.price||0) + ',\'' + (s.duration||'') + '\')" ' +
        'style="display:flex;align-items:center;gap:12px;padding:12px 14px;' +
        'background:' + (isSelected ? 'rgba(255,30,30,.08)' : 'var(--card)') + ';' +
        'border:1px solid ' + (isSelected ? 'var(--red)' : 'rgba(255,255,255,.08)') + ';' +
        'border-radius:12px;margin-bottom:8px;cursor:pointer;">' +
        '<div style="width:38px;height:38px;border-radius:10px;background:rgba(255,30,30,.1);' +
        'border:1px solid rgba(255,30,30,.2);display:flex;align-items:center;justify-content:center;' +
        'font-size:18px;flex-shrink:0;">' + s.icon + '</div>' +
        '<div style="flex:1;">' +
        '<p style="font-size:14px;font-weight:600;">' + s.name + '</p>' +
        (s.duration ? '<p style="font-size:11px;color:var(--text-muted);">⏱ ' + s.duration + '</p>' : '') +
        '</div>' +
        '<div style="text-align:right;">' +
        '<p style="font-size:15px;font-weight:700;color:var(--red);">R$ ' + (s.price||0) + '</p>' +
        '<p style="font-size:18px;color:' + (isSelected ? 'var(--red)' : 'rgba(255,255,255,.2)') + ';">' + (isSelected ? '✓' : '+') + '</p>' +
        '</div>' +
        '</div>';
    }).join('') +

    // Carrinho
    (agendarState.services.length > 0 ? `
    <div style="background:rgba(255,30,30,.08);border:1px solid rgba(255,30,30,.3);border-radius:14px;padding:14px;margin-top:8px;margin-bottom:16px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:.5px;color:var(--text-muted);margin-bottom:8px;">SELECIONADOS</p>
      ${agendarState.services.map(function(s) {
        return '<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:0.5px solid rgba(255,255,255,.06);">' +
          '<span style="font-size:13px;">' + s.name + '</span>' +
          '<span style="font-size:13px;font-weight:700;color:var(--red);">R$ ' + s.price + '</span>' +
          '</div>';
      }).join('')}
      <div style="display:flex;justify-content:space-between;margin-top:8px;">
        <span style="font-size:14px;font-weight:700;">Total</span>
        <span style="font-size:16px;font-weight:800;color:var(--red);">R$ ${total}</span>
      </div>
    </div>` : '<div style="height:16px;"></div>') +

    '<div style="display:flex;gap:8px;">' +
    '<button onclick="renderAgendarStep(1)" style="flex:1;padding:14px;border:1px solid rgba(255,255,255,.15);border-radius:12px;background:transparent;color:white;font-size:13px;font-weight:700;cursor:pointer;">← Voltar</button>' +
    '<button class="btn" style="flex:2;" onclick="goAgendarStep3()">PRÓXIMO →</button>' +
    '</div>';
}

function toggleServico(id, name, price, duration) {
  var idx = -1;
  for (var i = 0; i < agendarState.services.length; i++) {
    if (agendarState.services[i].id === id) { idx = i; break; }
  }
  if (idx >= 0) {
    agendarState.services.splice(idx, 1);
  } else {
    agendarState.services.push({ id:id, name:name, price:price, duration:duration });
  }
  renderAgendarStep(2);
}

function goAgendarStep3() {
  if (agendarState.services.length === 0) {
    alert('Escolha pelo menos um serviço!'); return;
  }
  renderAgendarStep(3);
  setTimeout(function() { renderCalendar(); }, 50);
}

// STEP 3 — Data e Hora
function renderStepDataHora() {
  return `
  <p style="font-size:12px;font-weight:700;letter-spacing:.5px;color:var(--text-muted);margin-bottom:10px;">ESCOLHA A DATA</p>
  <div class="cal-box">
    <div class="cal-header">
      <button onclick="changeMonth(-1)">‹</button>
      <span id="cal-month-label"></span>
      <button onclick="changeMonth(1)">›</button>
    </div>
    <div class="cal-days-header">
      <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
    </div>
    <div class="cal-grid" id="cal-grid"></div>
  </div>

  <p class="horarios-label">HORÁRIOS DISPONÍVEIS</p>
  <div class="horarios">
    ${['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00']
      .map(function(h,i) {
        var unavail = [3,10].indexOf(i) >= 0;
        return '<div class="hora' + (unavail?' unavail':'') + '"' +
          (!unavail?' onclick="selectHora(this,\'' + h + '\')"':'') + '>' + h + '</div>';
      }).join('')}
  </div>

  <p style="font-size:12px;font-weight:700;letter-spacing:.5px;color:var(--text-muted);margin-bottom:8px;margin-top:4px;">OBSERVAÇÕES (opcional)</p>
  <textarea id="agendar-notes" placeholder="Ex: degradê fechado nas laterais..."
    style="width:100%;padding:12px 14px;background:var(--card);border:1px solid rgba(255,255,255,.1);
    border-radius:12px;color:white;font-size:13px;outline:none;resize:none;height:65px;
    margin-bottom:16px;font-family:inherit;">${agendarState.notes}</textarea>

  <div style="display:flex;gap:8px;">
    <button onclick="renderAgendarStep(2)" style="flex:1;padding:14px;border:1px solid rgba(255,255,255,.15);border-radius:12px;background:transparent;color:white;font-size:13px;font-weight:700;cursor:pointer;">← Voltar</button>
    <button class="btn" style="flex:2;" onclick="goAgendarStep4()">PRÓXIMO →</button>
  </div>`;
}

function initCalendar() {
  renderCalendar();
}

function renderCalendar() {
  var grid = document.getElementById('cal-grid');
  if (!grid) return;
  grid.innerHTML = '';
  var year = calDate.getFullYear(), month = calDate.getMonth();
  var months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  var lbl = document.getElementById('cal-month-label');
  if (lbl) lbl.textContent = months[month] + ' ' + year;
  var firstDay = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month+1, 0).getDate();
  var today = new Date();
  for (var i = 0; i < firstDay; i++) {
    var e = document.createElement('div'); e.className = 'cal-day empty'; grid.appendChild(e);
  }
  for (var d = 1; d <= daysInMonth; d++) {
    var el = document.createElement('div'); el.className = 'cal-day'; el.textContent = d;
    var thisDate = new Date(year, month, d);
    var todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (thisDate < todayDate) {
      el.classList.add('past');
    } else if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      el.classList.add('today');
      agendarState.date = pad2(d)+'/'+pad2(month+1)+'/'+year;
      agendarState.dateISO = year+'-'+pad2(month+1)+'-'+pad2(d);
    } else {
      (function(day,m,y){
        el.onclick = function(){
          document.querySelectorAll('.cal-day').forEach(function(x){x.classList.remove('selected');});
          this.classList.add('selected');
          agendarState.date = pad2(day)+'/'+pad2(m+1)+'/'+y;
          agendarState.dateISO = y+'-'+pad2(m+1)+'-'+pad2(day);
        };
      })(d,month,year);
    }
    grid.appendChild(el);
  }
}

function pad2(n){ return n < 10 ? '0'+n : ''+n; }
function changeMonth(dir){ calDate.setMonth(calDate.getMonth()+dir); renderCalendar(); }
function selectHora(el,hora){
  document.querySelectorAll('.hora').forEach(function(h){h.classList.remove('selected');});
  el.classList.add('selected');
  agendarState.time = hora;
}

function goAgendarStep4() {
  agendarState.notes = (document.getElementById('agendar-notes')||{}).value || '';
  if (!agendarState.dateISO) { alert('Escolha uma data!'); return; }
  if (!agendarState.time)    { alert('Escolha um horário!'); return; }
  renderAgendarStep(4);
}

// STEP 4 — Confirmar
function renderStepConfirmar() {
  var total = agendarState.services.reduce(function(sum,s){ return sum+(s.price||0); }, 0);
  return `
  <p style="font-size:13px;font-weight:700;color:var(--text-muted);letter-spacing:.5px;margin-bottom:14px;">CONFIRME SEU AGENDAMENTO</p>

  <div style="background:var(--card);border-radius:16px;padding:16px;margin-bottom:16px;border:1px solid rgba(255,30,30,.25);">
    <div style="display:flex;align-items:center;gap:12px;padding-bottom:12px;border-bottom:0.5px solid rgba(255,255,255,.06);">
      <span style="font-size:20px;">💈</span>
      <div><p style="font-size:14px;font-weight:600;">Barbeiro</p><p style="font-size:13px;color:var(--text-muted);">${agendarState.barberName}</p></div>
    </div>
    <div style="padding:12px 0;border-bottom:0.5px solid rgba(255,255,255,.06);">
      <p style="font-size:12px;font-weight:700;color:var(--text-muted);margin-bottom:8px;">SERVIÇOS</p>
      ${agendarState.services.map(function(s){
        return '<div style="display:flex;justify-content:space-between;padding:3px 0;">' +
          '<span style="font-size:13px;">' + s.name + '</span>' +
          '<span style="font-size:13px;font-weight:700;color:var(--red);">R$ ' + s.price + '</span></div>';
      }).join('')}
      <div style="display:flex;justify-content:space-between;margin-top:8px;padding-top:8px;border-top:0.5px solid rgba(255,255,255,.06);">
        <span style="font-size:14px;font-weight:700;">Total</span>
        <span style="font-size:16px;font-weight:800;color:var(--red);">R$ ${total}</span>
      </div>
    </div>
    <div style="display:flex;align-items:center;gap:12px;padding-top:12px;">
      <span style="font-size:20px;">📅</span>
      <div><p style="font-size:14px;font-weight:600;">${agendarState.date}</p><p style="font-size:13px;color:var(--text-muted);">${agendarState.time}</p></div>
    </div>
    ${agendarState.notes ? '<div style="margin-top:12px;padding-top:12px;border-top:0.5px solid rgba(255,255,255,.06);"><p style="font-size:12px;color:var(--text-muted);">📝 ' + agendarState.notes + '</p></div>' : ''}
  </div>

  <div id="agendar-error" style="display:none;background:rgba(255,30,30,.1);border:1px solid rgba(255,30,30,.3);border-radius:10px;padding:12px;font-size:13px;color:#ff6666;margin-bottom:14px;text-align:center;"></div>

  <div style="display:flex;gap:8px;">
    <button onclick="renderAgendarStep(3)" style="flex:1;padding:14px;border:1px solid rgba(255,255,255,.15);border-radius:12px;background:transparent;color:white;font-size:13px;font-weight:700;cursor:pointer;">← Voltar</button>
    <button class="btn" id="agendar-btn" style="flex:2;" onclick="confirmarAgendamento()">✅ CONFIRMAR</button>
  </div>`;
}

async function confirmarAgendamento() {
  var errEl = document.getElementById('agendar-error');
  var btn   = document.getElementById('agendar-btn');
  if (errEl) errEl.style.display = 'none';
  if (btn) { btn.disabled = true; btn.textContent = 'Agendando...'; }

  try {
    // Busca UUID do barbeiro — tenta pelo nome completo
    var barberUUID = null;

    // 1) tenta pelo nick
    if (agendarState.barberNick) {
      var r1 = await sb.from('profiles').select('id').eq('nick', agendarState.barberNick).maybeSingle();
      if (r1.data) barberUUID = r1.data.id;
    }

    // 2) fallback: pelo nome completo
    if (!barberUUID && agendarState.barberName) {
      var r2 = await sb.from('profiles').select('id').eq('name', agendarState.barberName).maybeSingle();
      if (r2.data) barberUUID = r2.data.id;
    }

    // 3) fallback: lista barbeiros e acha por nome parcial
    if (!barberUUID) {
      var r3 = await sb.from('profiles').select('id,name,nick').eq('role','barbeiro');
      if (r3.data && r3.data.length > 0) {
        var match = r3.data.find(function(p) {
          return (p.name && p.name.toLowerCase().indexOf(agendarState.barberName.toLowerCase()) >= 0) ||
                 (p.nick && p.nick.toLowerCase().indexOf((agendarState.barberNick||'').toLowerCase()) >= 0);
        });
        if (match) barberUUID = match.id;
      }
    }

    if (!barberUUID) {
      throw new Error('Barbeiro "' + agendarState.barberName + '" não encontrado no Supabase. Verifique se o barbeiro tem role=barbeiro na tabela profiles.');
    }

    // Insere um agendamento para cada serviço
    var erros = [];

    for (var i = 0; i < agendarState.services.length; i++) {
      var svc = agendarState.services[i];
      var serviceId = null;

      var svcResult = await sb.from('services').select('id').eq('name', svc.name).maybeSingle();
      if (svcResult.data) serviceId = svcResult.data.id;

      var ins = await sb.from('appointments').insert({
        client_id:  authState.user.id,
        barber_id:  barberUUID,
        service_id: serviceId,
        date:       agendarState.dateISO,
        time:       agendarState.time + ':00',
        status:     'pendente',
        price:      svc.price,
        notes:      i === 0 ? agendarState.notes : ''
      });
      if (ins.error) erros.push(ins.error.message || JSON.stringify(ins.error));
    }

    if (btn) { btn.disabled = false; btn.textContent = '✅ CONFIRMAR'; }

    if (erros.length > 0) {
      throw new Error(erros.join(' | '));
    }

    goTo('confirmacao');

  } catch(e) {
    console.error('confirmarAgendamento erro:', e);
    if (errEl) { errEl.textContent = e.message || 'Erro ao agendar. Tente novamente.'; errEl.style.display = 'block'; }
    if (btn) { btn.disabled = false; btn.textContent = '✅ CONFIRMAR'; }
  }
}