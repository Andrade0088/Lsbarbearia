var escalaCalDate = new Date();
var escalaDatesSelecionadas = {}; // { 'YYYY-MM-DD': { start, end } }

function renderEscala() {
  if (!requireRole('barbeiro','adm')) return '<div class="screen" id="screen-escala"></div>';

  return `
  <div class="screen" id="screen-escala">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('barberDash')">←</button>
      <span class="page-title">MINHA ESCALA</span>
      <span style="width:24px"></span>
    </div>
    <div style="padding:18px 20px 100px;">

      <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">
        Toque nos dias que você vai trabalhar. Você pode definir horários diferentes por dia.
      </p>

      <!-- Calendário -->
      <div class="cal-box" style="margin-bottom:16px;">
        <div class="cal-header">
          <button onclick="escalaChangeMonth(-1)">‹</button>
          <span id="escala-month-label"></span>
          <button onclick="escalaChangeMonth(1)">›</button>
        </div>
        <div class="cal-days-header">
          <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
        </div>
        <div class="cal-grid" id="escala-cal-grid"></div>
      </div>

      <!-- Painel de horário do dia clicado -->
      <div id="escala-horario-panel" style="display:none;background:var(--card);border-radius:14px;padding:16px;margin-bottom:16px;border:1px solid rgba(255,30,30,.3);">
        <p id="escala-dia-label" style="font-size:13px;font-weight:700;color:var(--red);margin-bottom:12px;"></p>
        <div style="display:flex;gap:12px;align-items:center;">
          <div style="flex:1;">
            <label style="font-size:11px;color:var(--text-muted);">ENTRADA</label>
            <input type="time" id="escala-start" value="09:00"
              onchange="escalaUpdateHorario()"
              style="width:100%;margin-top:6px;padding:12px;background:var(--card2);
              border:1px solid rgba(255,255,255,.1);border-radius:10px;color:white;font-size:15px;outline:none;">
          </div>
          <p style="color:var(--text-muted);margin-top:16px;font-size:14px;">até</p>
          <div style="flex:1;">
            <label style="font-size:11px;color:var(--text-muted);">SAÍDA</label>
            <input type="time" id="escala-end" value="20:00"
              onchange="escalaUpdateHorario()"
              style="width:100%;margin-top:6px;padding:12px;background:var(--card2);
              border:1px solid rgba(255,255,255,.1);border-radius:10px;color:white;font-size:15px;outline:none;">
          </div>
        </div>
        <button onclick="escalaRemoverDia()" style="width:100%;margin-top:12px;padding:10px;
          background:rgba(255,30,30,.08);border:1px solid rgba(255,30,30,.3);border-radius:10px;
          color:var(--red);font-size:13px;font-weight:700;cursor:pointer;">🗑 Remover este dia</button>
      </div>

      <!-- Dias selecionados -->
      <div id="escala-lista" style="margin-bottom:20px;"></div>

      <div id="escala-msg" style="display:none;background:rgba(0,200,100,.1);border:1px solid rgba(0,200,100,.3);border-radius:10px;padding:12px;font-size:13px;color:#00c864;margin-bottom:14px;text-align:center;"></div>

      <button class="btn" onclick="salvarEscala()">💾 SALVAR ESCALA</button>
    </div>
  </div>`;
}

var escalaDiaSelecionado = null; // 'YYYY-MM-DD'

function initEscala() {
  escalaRenderCalendar();
}

function escalaChangeMonth(dir) {
  escalaCalDate.setMonth(escalaCalDate.getMonth() + dir);
  escalaRenderCalendar();
}

function pad2(n) { return n < 10 ? '0'+n : ''+n; }

function escalaRenderCalendar() {
  var grid = document.getElementById('escala-cal-grid');
  if (!grid) return;
  grid.innerHTML = '';
  var year = escalaCalDate.getFullYear(), month = escalaCalDate.getMonth();
  var months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  var lbl = document.getElementById('escala-month-label');
  if (lbl) lbl.textContent = months[month] + ' ' + year;

  var firstDay = new Date(year, month, 1).getDay();
  var daysInMonth = new Date(year, month+1, 0).getDate();
  var today = new Date();
  var todayISO = today.getFullYear()+'-'+pad2(today.getMonth()+1)+'-'+pad2(today.getDate());

  for (var i = 0; i < firstDay; i++) {
    var e = document.createElement('div'); e.className = 'cal-day empty'; grid.appendChild(e);
  }

  for (var d = 1; d <= daysInMonth; d++) {
    var dateISO = year+'-'+pad2(month+1)+'-'+pad2(d);
    var el = document.createElement('div');
    el.className = 'cal-day';
    el.textContent = d;

    var isPast = dateISO < todayISO;
    var isSelected = !!escalaDatesSelecionadas[dateISO];
    var isActive = escalaDiaSelecionado === dateISO;

    if (isPast) {
      el.classList.add('past');
    } else {
      if (isSelected) {
        el.style.background = 'var(--red)';
        el.style.color = 'white';
        el.style.fontWeight = '700';
        el.style.borderRadius = '8px';
      }
      if (isActive) {
        el.style.outline = '2px solid white';
        el.style.outlineOffset = '2px';
      }
      (function(iso) {
        el.onclick = function() { escalaToggleDate(iso); };
      })(dateISO);
    }
    grid.appendChild(el);
  }
}

function escalaToggleDate(iso) {
  if (escalaDatesSelecionadas[iso]) {
    // já selecionado — abre painel para editar ou remover
    escalaDiaSelecionado = iso;
    escalaAbrirPainel(iso);
  } else {
    // novo dia — adiciona com horário padrão
    escalaDatesSelecionadas[iso] = { start: '09:00', end: '20:00' };
    escalaDiaSelecionado = iso;
    escalaAbrirPainel(iso);
  }
  escalaRenderCalendar();
  escalaRenderLista();
}

function escalaAbrirPainel(iso) {
  var panel = document.getElementById('escala-horario-panel');
  var lbl = document.getElementById('escala-dia-label');
  var startEl = document.getElementById('escala-start');
  var endEl = document.getElementById('escala-end');
  if (!panel) return;

  var d = new Date(iso + 'T00:00:00');
  var dias = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
  if (lbl) lbl.textContent = '📅 ' + dias[d.getDay()] + ', ' + d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'});

  var data = escalaDatesSelecionadas[iso] || { start:'09:00', end:'20:00' };
  if (startEl) startEl.value = data.start;
  if (endEl) endEl.value = data.end;
  panel.style.display = 'block';
}

function escalaUpdateHorario() {
  if (!escalaDiaSelecionado) return;
  var s = (document.getElementById('escala-start')||{}).value || '09:00';
  var e = (document.getElementById('escala-end')||{}).value   || '20:00';
  if (!escalaDatesSelecionadas[escalaDiaSelecionado]) escalaDatesSelecionadas[escalaDiaSelecionado] = {};
  escalaDatesSelecionadas[escalaDiaSelecionado].start = s;
  escalaDatesSelecionadas[escalaDiaSelecionado].end = e;
  escalaRenderLista();
}

function escalaRemoverDia() {
  if (!escalaDiaSelecionado) return;
  delete escalaDatesSelecionadas[escalaDiaSelecionado];
  escalaDiaSelecionado = null;
  var panel = document.getElementById('escala-horario-panel');
  if (panel) panel.style.display = 'none';
  escalaRenderCalendar();
  escalaRenderLista();
}

function escalaRenderLista() {
  var el = document.getElementById('escala-lista');
  if (!el) return;
  var keys = Object.keys(escalaDatesSelecionadas).sort();
  if (keys.length === 0) {
    el.innerHTML = '<p style="font-size:12px;color:var(--text-muted);text-align:center;padding:10px;">Nenhum dia selecionado ainda.</p>';
    return;
  }
  var dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  el.innerHTML = '<p style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:10px;">DIAS SELECIONADOS (' + keys.length + ')</p>' +
    keys.map(function(iso) {
      var d = new Date(iso + 'T00:00:00');
      var data = escalaDatesSelecionadas[iso];
      var isActive = escalaDiaSelecionado === iso;
      return '<div onclick="escalaToggleDate(\'' + iso + '\')" style="display:flex;justify-content:space-between;align-items:center;' +
        'padding:10px 14px;background:' + (isActive ? 'rgba(255,30,30,.12)' : 'var(--card)') + ';' +
        'border:1px solid ' + (isActive ? 'var(--red)' : 'rgba(255,255,255,.08)') + ';' +
        'border-radius:10px;margin-bottom:6px;cursor:pointer;">' +
        '<div><p style="font-size:13px;font-weight:700;">' + dias[d.getDay()] + ' · ' + d.toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}) + '</p></div>' +
        '<span style="font-size:12px;color:var(--red);font-weight:700;">' + data.start + ' - ' + data.end + '</span>' +
        '</div>';
    }).join('');
}

async function loadEscala() {
  if (!authState.user) return;

  // Busca escala salva — tabela barber_dates (datas específicas)
  var result = await sb.from('barber_dates')
    .select('*')
    .eq('barber_id', authState.user.id)
    .gte('date', new Date().toISOString().split('T')[0]);

  escalaDatesSelecionadas = {};
  if (result.data && result.data.length > 0) {
    result.data.forEach(function(r) {
      escalaDatesSelecionadas[r.date] = {
        start: (r.start_time||'09:00').slice(0,5),
        end:   (r.end_time||'20:00').slice(0,5)
      };
    });
  }

  escalaRenderCalendar();
  escalaRenderLista();
}

async function salvarEscala() {
  if (!authState.user) return;
  var keys = Object.keys(escalaDatesSelecionadas);
  if (keys.length === 0) { alert('Selecione pelo menos um dia!'); return; }

  var btn = document.querySelector('#screen-escala .btn');
  var msgEl = document.getElementById('escala-msg');
  if (btn) { btn.disabled = true; btn.textContent = 'Salvando...'; }

  // Deleta datas futuras antigas
  var today = new Date().toISOString().split('T')[0];
  await sb.from('barber_dates').delete().eq('barber_id', authState.user.id).gte('date', today);

  // Insere as novas
  var rows = keys.map(function(iso) {
    var data = escalaDatesSelecionadas[iso];
    return { barber_id: authState.user.id, date: iso, start_time: data.start, end_time: data.end, active: true };
  });

  var result = await sb.from('barber_dates').insert(rows);

  if (btn) { btn.disabled = false; btn.textContent = '💾 SALVAR ESCALA'; }

  if (result.error) {
    // tabela barber_dates pode não existir — tenta work_schedules como fallback
    if (result.error.message && result.error.message.indexOf('barber_dates') >= 0) {
      if (msgEl) { msgEl.textContent = '⚠️ Crie a tabela barber_dates no Supabase (veja DEPLOY.md)'; msgEl.style.display = 'block'; }
    } else {
      alert('Erro ao salvar: ' + result.error.message);
    }
    return;
  }

  if (msgEl) { msgEl.textContent = '✅ Escala salva! ' + keys.length + ' dia(s) configurado(s).'; msgEl.style.display = 'block'; }
  setTimeout(function() { if (msgEl) msgEl.style.display = 'none'; }, 3000);
}