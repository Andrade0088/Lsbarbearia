function renderGanhos() {
  if (!requireRole('barbeiro','adm')) return '<div class="screen" id="screen-ganhos"></div>';

  return `
  <div class="screen" id="screen-ganhos">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('barberDash')">←</button>
      <span class="page-title">GANHOS</span>
      <span style="width:24px"></span>
    </div>

    <!-- Filtro período -->
    <div style="display:flex;gap:8px;padding:16px 20px 0;overflow-x:auto;">
      ${['hoje','semana','mes','ano'].map(p => `
        <button onclick="setGanhosFilter('${p}')" id="gf-${p}"
          style="padding:8px 18px;border-radius:20px;font-size:12px;font-weight:700;
          cursor:pointer;white-space:nowrap;border:1px solid ${(currentState.ganhosFilter||'hoje')===p?'var(--red)':'rgba(255,255,255,.1)'};
          background:${(currentState.ganhosFilter||'hoje')===p?'var(--red)':'transparent'};
          color:${(currentState.ganhosFilter||'hoje')===p?'white':'var(--text-muted)'};">
          ${p==='hoje'?'Hoje':p==='semana'?'Semana':p==='mes'?'Mês':'Ano'}
        </button>`).join('')}
    </div>

    <!-- Cards principais -->
    <div class="stats-grid" style="margin-top:16px;">
      <div class="stat-card" style="grid-column:span 2;">
        <div class="stat-num" id="ganho-total" style="font-size:36px;">R$ 0</div>
        <div class="stat-label" id="ganho-periodo">Total hoje</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" id="ganho-qtd">0</div>
        <div class="stat-label">Atendimentos</div>
      </div>
      <div class="stat-card">
        <div class="stat-num" id="ganho-ticket">R$ 0</div>
        <div class="stat-label">Ticket médio</div>
      </div>
    </div>

    <!-- Por serviço -->
    <div style="padding:0 20px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin:16px 0 10px;">POR SERVIÇO</p>
      <div id="ganho-servicos">
        <div style="text-align:center;padding:20px;color:var(--text-muted);">Carregando...</div>
      </div>
    </div>

    <!-- Histórico -->
    <div style="padding:0 20px 24px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:1px;color:var(--text-muted);margin:16px 0 10px;">HISTÓRICO DE ATENDIMENTOS</p>
      <div id="ganho-historico">
        <div style="text-align:center;padding:20px;color:var(--text-muted);">Carregando...</div>
      </div>
    </div>
  </div>`;
}

async function loadGanhos() {
  if (!authState.user) return;

  const periodo = currentState.ganhosFilter || 'hoje';
  const today = new Date();
  let startDate;

  if (periodo === 'hoje') {
    startDate = today.toISOString().split('T')[0];
  } else if (periodo === 'semana') {
    const d = new Date(today);
    d.setDate(d.getDate() - 7);
    startDate = d.toISOString().split('T')[0];
  } else if (periodo === 'mes') {
    startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  } else {
    startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
  }

  const { data, error } = await sb
    .from('appointments')
    .select('*, services(name, price)')
    .eq('barber_id', authState.user.id)
    .eq('status', 'concluido')
    .gte('date', startDate)
    .order('date', { ascending: false });

  if (error || !data) return;

  // Soma só rows com price > 0 (rows extras do mesmo agendamento ficam com price=0)
  const total = data.reduce((sum, a) => sum + (parseFloat(a.price) || 0), 0);
  const qtd = data.length;
  const ticket = qtd > 0 ? (total / qtd).toFixed(0) : 0;

  const periodoLabel = { hoje:'Total hoje', semana:'Total semana', mes:'Total mês', ano:'Total ano' };

  const gt = document.getElementById('ganho-total');
  const gp = document.getElementById('ganho-periodo');
  const gq = document.getElementById('ganho-qtd');
  const gk = document.getElementById('ganho-ticket');
  if (gt) gt.textContent = `R$ ${total.toFixed(0)}`;
  if (gp) gp.textContent = periodoLabel[periodo];
  if (gq) gq.textContent = qtd;
  if (gk) gk.textContent = `R$ ${ticket}`;

  // Por serviço
  const porServico = {};
  data.forEach(a => {
    const nome = a.services?.name || 'Serviço';
    const preco = parseFloat(a.price) || 0; // rows extras têm price=0
    if (!porServico[nome]) porServico[nome] = { qtd:0, total:0 };
    porServico[nome].qtd++;
    porServico[nome].total += preco;
  });

  const gsEl = document.getElementById('ganho-servicos');
  if (gsEl) {
    if (Object.keys(porServico).length === 0) {
      gsEl.innerHTML = `<p style="color:var(--text-muted);font-size:13px;text-align:center;">Nenhum atendimento no período.</p>`;
    } else {
      gsEl.innerHTML = Object.entries(porServico)
        .sort((a,b) => b[1].total - a[1].total)
        .map(([nome, info]) => `
          <div style="display:flex;justify-content:space-between;align-items:center;
            padding:12px 14px;background:var(--card);border-radius:12px;margin-bottom:8px;
            border:1px solid var(--border);">
            <div>
              <p style="font-size:13px;font-weight:600;">✂️ ${nome}</p>
              <p style="font-size:11px;color:var(--text-muted);">${info.qtd}x atendimento${info.qtd>1?'s':''}</p>
            </div>
            <p style="font-size:15px;font-weight:800;color:var(--red);">R$ ${info.total.toFixed(0)}</p>
          </div>`).join('');
    }
  }

  // Histórico
  const ghEl = document.getElementById('ganho-historico');
  if (ghEl) {
    if (data.length === 0) {
      ghEl.innerHTML = `<p style="color:var(--text-muted);font-size:13px;text-align:center;">Nenhum atendimento no período.</p>`;
    } else {
      ghEl.innerHTML = data.map(a => `
        <div style="display:flex;justify-content:space-between;align-items:center;
          padding:10px 0;border-bottom:1px solid rgba(255,255,255,.05);">
          <div>
            <p style="font-size:13px;font-weight:600;">${a.services?.name || 'Serviço'}</p>
            <p style="font-size:11px;color:var(--text-muted);">
              ${new Date(a.date+'T00:00:00').toLocaleDateString('pt-BR')} · ${a.time?.slice(0,5)}
            </p>
          </div>
          <p style="font-size:14px;font-weight:700;color:var(--red);">R$ ${(parseFloat(a.price)||0).toFixed(0)}</p>
        </div>`).join('');
    }
  }
}

function setGanhosFilter(p) {
  currentState.ganhosFilter = p;
  reRenderScreen('ganhos');
}