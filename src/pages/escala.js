function renderEscala() {
  if (!requireRole('barbeiro','adm')) return '<div class="screen" id="screen-escala"></div>';

  var dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  var diasCompletos = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];

  return `
  <div class="screen" id="screen-escala">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('perfilBarbeiro')">←</button>
      <span class="page-title">MINHA ESCALA</span>
      <span style="width:24px"></span>
    </div>
    <div style="padding:18px 20px;">

      <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">
        Selecione os dias que você trabalha e defina o horário.
      </p>

      <!-- Dias da semana - seleção visual -->
      <p style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:10px;">DIAS DE TRABALHO</p>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:20px;">
        ${dias.map(function(d, i) {
          return '<div onclick="toggleEscalaDia(' + i + ')" id="dia-btn-' + i + '" ' +
            'style="padding:10px 4px;border-radius:10px;text-align:center;cursor:pointer;' +
            'background:var(--card);border:1px solid rgba(255,255,255,.1);transition:.2s;">' +
            '<p style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">' + d + '</p>' +
            '<p style="font-size:11px;font-weight:700;" id="dia-num-' + i + '">' + (i === 0 ? 'D' : i === 6 ? 'S' : '') + '</p>' +
            '</div>';
        }).join('')}
      </div>

      <!-- Dias selecionados -->
      <div id="dias-selecionados" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:20px;min-height:28px;">
        <p style="font-size:12px;color:var(--text-muted);">Nenhum dia selecionado</p>
      </div>

      <!-- Horário único para todos os dias selecionados -->
      <p style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:10px;">HORÁRIO DE ATENDIMENTO</p>
      <div style="display:flex;gap:12px;align-items:center;margin-bottom:20px;">
        <div style="flex:1;">
          <label style="font-size:11px;color:var(--text-muted);">ENTRADA</label>
          <input type="time" id="escala-start" value="09:00"
            style="width:100%;margin-top:6px;padding:12px;background:var(--card);
            border:1px solid rgba(255,255,255,.1);border-radius:10px;color:white;font-size:15px;outline:none;">
        </div>
        <p style="color:var(--text-muted);margin-top:16px;font-size:14px;">até</p>
        <div style="flex:1;">
          <label style="font-size:11px;color:var(--text-muted);">SAÍDA</label>
          <input type="time" id="escala-end" value="20:00"
            style="width:100%;margin-top:6px;padding:12px;background:var(--card);
            border:1px solid rgba(255,255,255,.1);border-radius:10px;color:white;font-size:15px;outline:none;">
        </div>
      </div>

      <!-- Preview da escala atual -->
      <div id="escala-preview" style="background:var(--card);border-radius:12px;padding:14px;margin-bottom:20px;border:1px solid var(--border);">
        <p style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin-bottom:10px;">ESCALA ATUAL (SALVA)</p>
        <div id="escala-preview-content" style="color:var(--text-muted);font-size:13px;">Carregando...</div>
      </div>

      <div id="escala-msg" style="display:none;background:rgba(0,200,100,.1);border:1px solid rgba(0,200,100,.3);border-radius:10px;padding:12px;font-size:13px;color:#00c864;margin-bottom:14px;text-align:center;"></div>

      <button class="btn" onclick="salvarEscala()">💾 SALVAR ESCALA</button>
    </div>
  </div>`;
}

var diasSelecionados = [];

function toggleEscalaDia(i) {
  var idx = diasSelecionados.indexOf(i);
  if (idx >= 0) {
    diasSelecionados.splice(idx, 1);
  } else {
    diasSelecionados.push(i);
    diasSelecionados.sort();
  }
  atualizarDiasBtns();
  atualizarDiasTags();
}

function atualizarDiasBtns() {
  var dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  for (var i = 0; i < 7; i++) {
    var btn = document.getElementById('dia-btn-' + i);
    if (!btn) continue;
    var selecionado = diasSelecionados.indexOf(i) >= 0;
    btn.style.background = selecionado ? 'var(--red)' : 'var(--card)';
    btn.style.borderColor = selecionado ? 'var(--red)' : 'rgba(255,255,255,.1)';
    btn.querySelector('p:first-child').style.color = selecionado ? 'rgba(255,255,255,.8)' : 'var(--text-muted)';
  }
}

function atualizarDiasTags() {
  var diasCompletos = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
  var el = document.getElementById('dias-selecionados');
  if (!el) return;
  if (diasSelecionados.length === 0) {
    el.innerHTML = '<p style="font-size:12px;color:var(--text-muted);">Nenhum dia selecionado</p>';
    return;
  }
  el.innerHTML = diasSelecionados.map(function(i) {
    return '<span style="padding:4px 10px;background:rgba(255,30,30,.15);border:1px solid rgba(255,30,30,.3);' +
      'border-radius:20px;font-size:12px;font-weight:600;color:var(--red);">' + diasCompletos[i] + '</span>';
  }).join('');
}

async function loadEscala() {
  if (!authState.user) return;

  var result = await sb.from('work_schedules').select('*').eq('barber_id', authState.user.id);
  var diasCompletos = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];

  var previewEl = document.getElementById('escala-preview-content');
  if (!previewEl) return;

  if (result.error || !result.data || result.data.length === 0) {
    previewEl.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">Nenhuma escala salva ainda.</p>';
    return;
  }

  var ativos = result.data.filter(function(d) { return d.active; });
  if (ativos.length === 0) {
    previewEl.innerHTML = '<p style="color:var(--text-muted);font-size:13px;">Nenhum dia ativo.</p>';
    return;
  }

  previewEl.innerHTML = ativos.map(function(d) {
    return '<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:0.5px solid rgba(255,255,255,.05);">' +
      '<span style="font-size:13px;font-weight:600;">' + diasCompletos[d.weekday] + '</span>' +
      '<span style="font-size:13px;color:var(--red);">' + (d.start_time||'09:00').slice(0,5) + ' - ' + (d.end_time||'20:00').slice(0,5) + '</span>' +
      '</div>';
  }).join('');

  // Pré-seleciona os dias já salvos
  diasSelecionados = ativos.map(function(d){ return d.weekday; });
  atualizarDiasBtns();
  atualizarDiasTags();

  if (ativos.length > 0) {
    var startEl = document.getElementById('escala-start');
    var endEl = document.getElementById('escala-end');
    if (startEl) startEl.value = (ativos[0].start_time||'09:00').slice(0,5);
    if (endEl) endEl.value = (ativos[0].end_time||'20:00').slice(0,5);
  }
}

async function salvarEscala() {
  if (!authState.user) return;
  if (diasSelecionados.length === 0) {
    alert('Selecione pelo menos um dia!'); return;
  }

  var start = (document.getElementById('escala-start')||{}).value || '09:00';
  var end   = (document.getElementById('escala-end')||{}).value   || '20:00';
  var btn = document.querySelector('#screen-escala .btn');
  var msgEl = document.getElementById('escala-msg');

  if (btn) { btn.disabled = true; btn.textContent = 'Salvando...'; }

  // Deleta escala antiga
  await sb.from('work_schedules').delete().eq('barber_id', authState.user.id);

  // Insere todos os dias selecionados com o mesmo horário
  var rows = [];
  for (var i = 0; i < 7; i++) {
    rows.push({
      barber_id:  authState.user.id,
      weekday:    i,
      active:     diasSelecionados.indexOf(i) >= 0,
      start_time: start,
      end_time:   end
    });
  }

  var result = await sb.from('work_schedules').insert(rows);

  if (btn) { btn.disabled = false; btn.textContent = '💾 SALVAR ESCALA'; }

  if (result.error) {
    alert('Erro ao salvar: ' + result.error.message); return;
  }

  if (msgEl) { msgEl.textContent = '✅ Escala salva com sucesso!'; msgEl.style.display = 'block'; }
  setTimeout(function() { if (msgEl) msgEl.style.display = 'none'; }, 3000);
  loadEscala();
}