function renderEscala() {
  if (!requireRole('barbeiro','adm')) return '<div class="screen" id="screen-escala"></div>';

  const dias = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];

  return `
  <div class="screen" id="screen-escala">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('barberDash')">←</button>
      <span class="page-title">MINHA ESCALA</span>
      <span style="width:24px"></span>
    </div>

    <div style="padding:18px 20px;">
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:20px;">
        Configure os dias e horários que você trabalha.
      </p>

      <div id="escala-lista">
        <div style="text-align:center;padding:30px;color:var(--text-muted);">Carregando...</div>
      </div>

      <button class="btn" style="margin-top:20px;" onclick="salvarEscala()">
        💾 SALVAR ESCALA
      </button>
    </div>
  </div>`;
}

let escalaData = {};

async function loadEscala() {
  if (!authState.user) return;

  const { data } = await sb
    .from('work_schedules')
    .select('*')
    .eq('barber_id', authState.user.id);

  const dias = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];

  // Monta estado
  escalaData = {};
  for (let i = 0; i < 7; i++) {
    const found = data?.find(d => d.weekday === i);
    escalaData[i] = {
      active: found?.active ?? (i >= 1 && i <= 6),
      start: found?.start_time?.slice(0,5) || '09:00',
      end: found?.end_time?.slice(0,5) || '20:00'
    };
  }

  const el = document.getElementById('escala-lista');
  if (!el) return;

  el.innerHTML = dias.map((dia, i) => `
    <div style="background:var(--card);border-radius:14px;padding:14px 16px;margin-bottom:10px;
      border:1px solid ${escalaData[i].active ? 'rgba(255,30,30,.3)' : 'rgba(255,255,255,.06)'};"
      id="escala-row-${i}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:${escalaData[i].active?'12px':'0'};">
        <p style="font-size:15px;font-weight:600;">${dia}</p>
        <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
          <input type="checkbox" id="esc-active-${i}" ${escalaData[i].active?'checked':''}
            onchange="toggleEscalaDia(${i})"
            style="width:18px;height:18px;accent-color:var(--red);cursor:pointer;">
          <span style="font-size:12px;color:var(--text-muted);">${escalaData[i].active?'Trabalhando':'Folga'}</span>
        </label>
      </div>
      <div id="esc-horarios-${i}" style="display:${escalaData[i].active?'flex':'none'};gap:12px;align-items:center;">
        <div style="flex:1;">
          <label style="font-size:11px;color:var(--text-muted);">ENTRADA</label>
          <input type="time" id="esc-start-${i}" value="${escalaData[i].start}"
            style="width:100%;margin-top:4px;padding:10px;background:var(--card2);
            border:1px solid rgba(255,255,255,.1);border-radius:10px;color:white;font-size:14px;outline:none;">
        </div>
        <p style="color:var(--text-muted);margin-top:14px;">até</p>
        <div style="flex:1;">
          <label style="font-size:11px;color:var(--text-muted);">SAÍDA</label>
          <input type="time" id="esc-end-${i}" value="${escalaData[i].end}"
            style="width:100%;margin-top:4px;padding:10px;background:var(--card2);
            border:1px solid rgba(255,255,255,.1);border-radius:10px;color:white;font-size:14px;outline:none;">
        </div>
      </div>
    </div>`).join('');
}

function toggleEscalaDia(i) {
  const active = document.getElementById(`esc-active-${i}`).checked;
  const horarios = document.getElementById(`esc-horarios-${i}`);
  const row = document.getElementById(`escala-row-${i}`);
  escalaData[i].active = active;
  if (horarios) horarios.style.display = active ? 'flex' : 'none';
  if (row) row.style.borderColor = active ? 'rgba(255,30,30,.3)' : 'rgba(255,255,255,.06)';
  const label = document.querySelector(`#escala-row-${i} label span`);
  if (label) label.textContent = active ? 'Trabalhando' : 'Folga';
}

async function salvarEscala() {
  if (!authState.user) return;

  const btn = document.querySelector('#screen-escala .btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Salvando...'; }

  const rows = [];
  for (let i = 0; i < 7; i++) {
    const active = document.getElementById(`esc-active-${i}`)?.checked ?? false;
    const start  = document.getElementById(`esc-start-${i}`)?.value || '09:00';
    const end    = document.getElementById(`esc-end-${i}`)?.value   || '20:00';
    rows.push({ barber_id: authState.user.id, weekday: i, active, start_time: start, end_time: end });
  }

  // Upsert
  await sb.from('work_schedules').delete().eq('barber_id', authState.user.id);
  const { error } = await sb.from('work_schedules').insert(rows);

  if (btn) { btn.disabled = false; btn.textContent = error ? '❌ Erro ao salvar' : '✅ Salvo!'; }
  setTimeout(() => { if (btn) btn.textContent = '💾 SALVAR ESCALA'; btn.disabled = false; }, 2000);
}