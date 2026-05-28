function renderBarbeiros() {
  const list = APP_DATA.barbers.map(b => {
    const stars = '★'.repeat(b.stars) + '☆'.repeat(5 - b.stars);
    const photoHtml = b.photo && !b.photo.includes('_URL')
      ? `<img src="${b.photo}" alt="${b.name}" loading="lazy">`
      : `<div style="width:78px;height:78px;border-radius:50%;border:3px solid var(--red);
          background:linear-gradient(135deg,var(--card),var(--card2));
          display:flex;align-items:center;justify-content:center;
          font-size:26px;font-weight:800;color:var(--red);flex-shrink:0;">
          ${b.name.charAt(0)}
        </div>`;

    return `
    <div class="barber-card">
      ${photoHtml}
      <div class="barber-info">
        <h4>${b.name}</h4>
        <p>${b.nick}</p>
        <p style="color:var(--text-muted);font-size:12px;">${b.specialty}</p>
        <div class="rating">${stars} <span>${b.rating}</span></div>
        <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap;">
          <button class="btn-sm" onclick="goTo('agendar')">AGENDAR</button>
          <a href="tel:${b.phone}" class="btn-sm-outline" style="text-decoration:none;display:inline-flex;align-items:center;gap:4px;">
            📞 Ligar
          </a>
          <a href="${b.instagram}" target="_blank" class="btn-sm-outline" style="text-decoration:none;display:inline-flex;align-items:center;gap:4px;">
            📷 Insta
          </a>
        </div>
      </div>
    </div>`;
  }).join('');

  return `
  <div class="screen" id="screen-barbeiros">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('home')">←</button>
      <span class="page-title">BARBEIROS</span>
      <span style="width:24px"></span>
    </div>
    <div class="section">
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">
        📍 Estr. da Água Espraiada, 2940 · 
        <a href="tel:+5511919021251" style="color:var(--red);text-decoration:none;">(11) 91902-1251</a>
      </p>
      ${list}
    </div>
  </div>`;
}

function openBarberDash(id) {
  currentState.currentBarberDashId = id;
  goTo('barberDash');
}