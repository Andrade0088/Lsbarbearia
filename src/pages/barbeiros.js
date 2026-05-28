function renderBarbeiros() {
  const stars = (n) => '★'.repeat(n) + '☆'.repeat(5 - n);
  const list = APP_DATA.barbers.map(b => `
    <div class="barber-card" onclick="openBarberDash(${b.id})">
      <img src="${b.photo}" alt="${b.name}" loading="lazy">
      <div class="barber-info">
        <h4>${b.name}</h4>
        <p>${b.specialty}</p>
        <div class="rating">${stars(b.stars)} <span>${b.rating} (${b.reviews})</span></div>
        <div style="display:flex;gap:8px;margin-top:10px;">
          <button class="btn-sm" onclick="event.stopPropagation();goTo('agendar')">AGENDAR</button>
          <button class="btn-sm-outline" onclick="event.stopPropagation();openBarberDash(${b.id})">VER AGENDA</button>
        </div>
      </div>
    </div>`).join('');

  return `
  <div class="screen" id="screen-barbeiros">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('home')">←</button>
      <span class="page-title">BARBEIROS</span>
      <span style="width:24px"></span>
    </div>
    <div class="section">${list}</div>
  </div>`;
}

function openBarberDash(id) {
  currentState.currentBarberDashId = id;
  goTo('barberDash');
}
