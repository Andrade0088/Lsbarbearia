function renderHome() {
  return `
  <div class="screen active" id="screen-home">
    <div class="topbar">
      <button class="menu-btn" onclick="openSidebar()">☰</button>
      <span class="notif">🔔</span>
    </div>
    <div class="home-hero">
      <div class="logo">
        <p class="logo-sub">✦ BARBEARIA ✦</p>
        <h1>DOM <span>CORTES</span></h1>
      </div>
      <div class="hero-text">
        <h2>Seu estilo,<br><span>sua atitude.</span></h2>
        <p>Cortes modernos, barba premium e atendimento diferenciado para elevar sua autoestima.</p>
        <button class="btn" onclick="goTo('agendar')">📅 AGENDAR HORÁRIO</button>
      </div>
    </div>
    <div class="cards">
      <div class="card" onclick="goTo('services')"><div class="icon">✂️</div><h3>Serviços</h3></div>
      <div class="card" onclick="goTo('barbeiros')"><div class="icon">🧔</div><h3>Barbeiros</h3></div>
      <div class="card" onclick="goTo('promos')"><div class="icon">🔥</div><h3>Promoções</h3></div>
      <div class="card" onclick="goTo('galeria')"><div class="icon">📸</div><h3>Galeria</h3></div>
    </div>
    <div class="rating-bar">
      <div class="big-num">4,9</div>
      <div>
        <div class="stars">★★★★★</div>
        <p>+500 avaliações de clientes</p>
      </div>
    </div>
  </div>`;
}
