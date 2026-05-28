function renderPromos() {
  return `
  <div class="screen" id="screen-promos">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('home')">←</button>
      <span class="page-title">PROMOÇÕES</span>
      <span style="width:24px"></span>
    </div>
    <div class="promo-banner">
      <img src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop" alt="Promo" loading="lazy">
      <div class="promo-content">
        <div class="day">TODA QUARTA-FEIRA</div>
        <h2>QUARTA<br><span>PREMIUM</span></h2>
        <p>20% OFF em todos os serviços</p>
      </div>
    </div>
    <div class="section" style="padding-top:8px;">
      <h2 class="section-title">Outras ofertas</h2>
      <div class="promo-card">
        <div class="pc-left"><span class="pc-icon">🎁</span><div><h4>Indique um amigo</h4><p>Ganhe 10% de desconto</p></div></div>
        <span class="arrow">›</span>
      </div>
      <div class="promo-card">
        <div class="pc-left"><span class="pc-icon">🏆</span><div><h4>Pacote Fidelidade</h4><p>5 cortes e ganhe 1 grátis</p></div></div>
        <span class="arrow">›</span>
      </div>
      <div class="promo-card">
        <div class="pc-left"><span class="pc-icon">🌙</span><div><h4>Happy Hour</h4><p>18h–20h: R$10 OFF em qualquer serviço</p></div></div>
        <span class="arrow">›</span>
      </div>
    </div>
  </div>`;
}
