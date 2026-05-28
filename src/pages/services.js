function renderServices() {
  const filter = currentState.serviceFilter || 'todos';

  const categories = [
    { key:'todos',    label:'Todos' },
    { key:'corte',    label:'✂️ Cortes' },
    { key:'barba',    label:'🧔 Barba' },
    { key:'combo',    label:'⭐ Combos' },
    { key:'estetica', label:'💆 Estética' },
    { key:'produto',  label:'🫙 Produtos' },
    { key:'bebida',   label:'🍺 Bebidas' },
    { key:'lazer',    label:'🎱 Lazer' },
  ];

  const filtered = filter === 'todos'
    ? APP_DATA.services
    : APP_DATA.services.filter(s => s.category === filter);

  const isBookable = (s) => APP_DATA.bookableCategories.includes(s.category);

  const list = filtered.map(s => {
    const priceStr = s.price ? `R$ ${s.price}` : '—';
    const bookable = isBookable(s);
    return `
    <div class="service${bookable ? '' : ' non-bookable'}"
      onclick="${bookable ? `selectService(this,'${s.name}','R$ ${s.price}','${s.duration}')` : ''}">
      <div style="width:50px;height:50px;border-radius:12px;background:rgba(255,30,30,.1);
        border:1px solid rgba(255,30,30,.2);display:flex;align-items:center;justify-content:center;
        font-size:22px;flex-shrink:0;">${s.icon}</div>
      <div class="service-info">
        <h4>${s.name.toUpperCase()}</h4>
        ${s.duration ? `<p style="color:var(--text-muted);font-size:11px;">⏱ ${s.duration}</p>` : ''}
      </div>
      <div class="service-right">
        <div class="price">${priceStr}</div>
        ${s.badge ? `<div class="badge">${s.badge}</div>` : ''}
        ${bookable ? `<div style="font-size:10px;color:var(--text-muted);margin-top:4px;">toque para agendar</div>` : ''}
      </div>
    </div>`;
  }).join('');

  return `
  <div class="screen" id="screen-services">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('home')">←</button>
      <span class="page-title">SERVIÇOS</span>
      <span style="width:24px"></span>
    </div>

    <div style="padding:14px 20px 0;">
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:14px;">
        Ls. Barbearia · Estr. da Água Espraiada, 2940
      </p>
    </div>

    <!-- Filtros por categoria -->
    <div style="display:flex;gap:8px;padding:0 20px 16px;overflow-x:auto;">
      ${categories.map(c => `
        <button onclick="setServiceFilter('${c.key}')"
          style="padding:7px 14px;border-radius:20px;font-size:12px;font-weight:600;
          cursor:pointer;white-space:nowrap;border:1px solid ${filter===c.key ? 'var(--red)' : 'rgba(255,255,255,.1)'};
          background:${filter===c.key ? 'var(--red)' : 'transparent'};
          color:${filter===c.key ? 'white' : 'var(--text-muted)'};">
          ${c.label}
        </button>`).join('')}
    </div>

    <div class="section" style="padding-top:0;">
      ${list}
      ${filtered.filter(s => isBookable(s)).length > 0 ? `
        <button class="btn" style="margin-top:8px" onclick="goTo('agendar')">CONTINUAR →</button>
      ` : ''}
    </div>
  </div>`;
}

function setServiceFilter(f) {
  currentState.serviceFilter = f;
  reRenderScreen('services');
}

function selectService(el, name, price, duration) {
  document.querySelectorAll('.service').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  currentState.selectedService = { name, price, duration };
  const n = document.getElementById('agendar-svc-name');
  const p = document.getElementById('agendar-svc-price');
  const d = document.getElementById('agendar-svc-dur');
  const cs = document.getElementById('confirm-svc');
  if (n) n.textContent = name;
  if (p) p.textContent = price;
  if (d) d.textContent = 'Duração: ' + duration;
  if (cs) cs.textContent = name;
}