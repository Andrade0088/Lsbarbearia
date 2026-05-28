function renderServices() {
  const list = APP_DATA.services.map((s, i) => `
    <div class="service${i === 2 ? ' selected' : ''}" onclick="selectService(this,'${s.name}','${s.price}','${s.duration}')">
      <img src="${s.img}" alt="${s.name}" loading="lazy">
      <div class="service-info">
        <h4>${s.name.toUpperCase()}</h4>
        <p>${s.desc}</p>
      </div>
      <div class="service-right">
        <div class="price">${s.price}</div>
        ${s.badge ? `<div class="badge">${s.badge}</div>` : ''}
      </div>
    </div>`).join('');

  return `
  <div class="screen" id="screen-services">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('home')">←</button>
      <span class="page-title">SERVIÇOS</span>
      <span>🛒</span>
    </div>
    <div class="section">
      <p class="section-sub">Escolha o serviço ideal para você</p>
      ${list}
      <button class="btn" style="margin-top:8px" onclick="goTo('agendar')">CONTINUAR →</button>
    </div>
  </div>`;
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
