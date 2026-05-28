function renderBarbeiros() {
  var list = APP_DATA.barbers.map(function(b) {
    var stars = '★'.repeat(b.stars) + '☆'.repeat(5 - b.stars);
    var hasPhoto = b.photo && b.photo.indexOf('_URL') < 0;
    var photoHtml = hasPhoto
      ? '<img src="' + b.photo + '" alt="' + b.name + '" loading="lazy" style="width:78px;height:78px;border-radius:50%;object-fit:cover;border:3px solid var(--red);flex-shrink:0;">'
      : '<div style="width:78px;height:78px;border-radius:50%;border:3px solid var(--red);background:linear-gradient(135deg,var(--card),var(--card2));display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;color:var(--red);flex-shrink:0;">' + b.name.charAt(0) + '</div>';

    return `
    <div class="barber-card" onclick="openBarberGaleria(${b.id})" style="cursor:pointer;">
      ${photoHtml}
      <div class="barber-info">
        <h4>${b.name}</h4>
        <p style="color:var(--text-muted);font-size:12px;">${b.nick}</p>
        <div class="rating">${stars} <span>${b.rating}</span></div>
        <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap;">
          <button onclick="event.stopPropagation();goTo('agendar')"
            style="display:flex;align-items:center;gap:5px;padding:8px 14px;border:none;border-radius:10px;
            background:linear-gradient(90deg,var(--red),var(--blue));color:white;font-size:12px;font-weight:700;cursor:pointer;">
            📅 Agendar
          </button>
          <a href="${b.instagram}" target="_blank" onclick="event.stopPropagation()"
            style="display:flex;align-items:center;gap:5px;padding:8px 14px;border:1px solid var(--red);
            border-radius:10px;color:var(--red);font-size:12px;font-weight:700;text-decoration:none;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
              style="width:14px;height:14px;border-radius:3px;" alt="Instagram">
            Instagram
          </a>
          <a href="tel:${b.phone}" onclick="event.stopPropagation()"
            style="display:flex;align-items:center;gap:5px;padding:8px 14px;border:1px solid rgba(255,255,255,.15);
            border-radius:10px;color:white;font-size:12px;font-weight:700;text-decoration:none;">
            📞 Ligar
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
      <p style="font-size:11px;color:var(--text-muted);margin-bottom:16px;">Toque no barbeiro para ver os cortes dele 👆</p>
      ${list}
    </div>
  </div>`;
}

function openBarberGaleria(barberId) {
  currentState.galeriaBarber = barberId;
  goTo('galeria');
}