function renderHome() {
  var logoUrl = '/public/Logo_Ls.jpeg';

  return `
  <div class="screen active" id="screen-home">
    <div class="topbar">
      <button class="menu-btn" onclick="openSidebar()">☰</button>
      <span class="notif">🔔</span>
    </div>
    <div class="home-hero">
      <div class="logo">
        <img src="${logoUrl}" alt="Ls. Barbearia"
          style="width:120px;height:120px;object-fit:contain;margin:0 auto 10px;display:block;
          filter:drop-shadow(0 0 20px rgba(255,30,30,.4));">
        <p style="font-size:10px;letter-spacing:4px;color:rgba(255,255,255,.4);margin-top:4px;">ESTILO · ATITUDE · CONFIANÇA</p>
      </div>
      <div class="hero-text">
        <h2>Não deixe para<br>amanhã o que pode<br><span>alinhar hoje.</span></h2>
        <p>Estr. da Água Espraiada, 2940 · (11) 91902-1251</p>
        <button class="btn" onclick="goTo('agendar')">📅 AGENDAR HORÁRIO</button>
        <a href="https://wa.me/5511919021251" target="_blank"
          style="display:flex;align-items:center;justify-content:center;gap:8px;
          margin-top:12px;padding:14px;border:1.5px solid #25D366;border-radius:14px;
          color:#25D366;font-size:14px;font-weight:600;text-decoration:none;">
          💬 WhatsApp
        </a>
      </div>
    </div>

    <div class="cards">
      <div class="card" onclick="goTo('services')"><div class="icon">✂️</div><h3>Serviços</h3></div>
      <div class="card" onclick="goTo('barbeiros')"><div class="icon">💈</div><h3>Barbeiros</h3></div>
      <div class="card" onclick="goTo('promos')"><div class="icon">🔥</div><h3>Promoções</h3></div>
      <div class="card" onclick="goTo('galeria')"><div class="icon">📸</div><h3>Galeria</h3></div>
    </div>

    <div class="rating-bar">
      <div class="big-num">5,0</div>
      <div>
        <div class="stars">★★★★★</div>
        <p>Ls. Barbearia · @ls_barbearia00</p>
      </div>
    </div>

    <div style="padding:0 20px 24px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:1.5px;color:var(--text-muted);margin-bottom:12px;">NOSSOS BARBEIROS</p>
      <div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:4px;">
        ${APP_DATA.barbers.map(function(b) {
          var hasPhoto = b.photo && b.photo.indexOf('_URL') < 0;
          return '<div onclick="goTo(\'barbeiros\')" style="flex-shrink:0;text-align:center;cursor:pointer;">' +
            '<div style="width:64px;height:64px;border-radius:50%;border:2px solid var(--red);' +
            'background:var(--card);display:flex;align-items:center;justify-content:center;' +
            'font-size:22px;font-weight:800;color:var(--red);margin:0 auto 6px;overflow:hidden;">' +
            (hasPhoto ? '<img src="' + b.photo + '" style="width:100%;height:100%;object-fit:cover;">' : b.name.charAt(0)) +
            '</div>' +
            '<p style="font-size:11px;font-weight:600;color:white;">' + b.name + '</p>' +
            '<p style="font-size:10px;color:var(--text-muted);">' + b.nick + '</p>' +
            '</div>';
        }).join('')}
      </div>
    </div>
  </div>`;
}