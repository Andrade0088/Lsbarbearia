function renderPerfil() {
  return `
  <div class="screen" id="screen-perfil">
    <div class="topbar" style="background:transparent;position:absolute;z-index:10;">
      <button class="back-btn" onclick="goTo('home')">←</button>
      <span></span>
      <span style="font-size:20px;cursor:pointer">⚙️</span>
    </div>
    <div class="profile-hero">
      <img class="avatar" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop" alt="Avatar">
      <div class="profile-name">Olá, João Silva 👋</div>
      <div class="profile-email">joaosilva@email.com</div>
    </div>
    <div class="next-booking">
      <div class="nb-header">
        <span>PRÓXIMO AGENDAMENTO</span>
        <a onclick="goTo('agendar')">Ver todos</a>
      </div>
      <div class="booking-row">
        <div class="booking-icon">📅</div>
        <div class="booking-info">
          <p>29/05/2025 - 14:00</p>
          <span>Degradê + Barba · Lucas Ferreira</span>
        </div>
        <div class="booking-badge">Confirmado</div>
      </div>
    </div>
    <div class="menu-list">
      <div class="menu-item"><div class="mi-left"><span class="mi-icon">📋</span><span class="mi-label">Histórico de agendamentos</span></div><span class="mi-arrow">›</span></div>
      <div class="menu-item"><div class="mi-left"><span class="mi-icon">💳</span><span class="mi-label">Métodos de pagamento</span></div><span class="mi-arrow">›</span></div>
      <div class="menu-item"><div class="mi-left"><span class="mi-icon">⭐</span><span class="mi-label">Avaliações</span></div><span class="mi-arrow">›</span></div>
      <div class="menu-item"><div class="mi-left"><span class="mi-icon">💈</span><span class="mi-label">Área do Barbeiro</span></div><span class="mi-arrow">›</span></div>
      <div class="menu-item" onclick="goTo('barberDash')"><div class="mi-left"><span class="mi-icon">📊</span><span class="mi-label" style="color:var(--red);">Minha Agenda (barbeiro)</span></div><span class="mi-arrow" style="color:var(--red);">›</span></div>
      <div class="menu-item"><div class="mi-left"><span class="mi-icon">⚙️</span><span class="mi-label">Configurações</span></div><span class="mi-arrow">›</span></div>
      <div class="menu-item"><div class="mi-left"><span class="mi-icon">🚪</span><span class="mi-label" style="color:#ff4444;">Sair</span></div><span class="mi-arrow" style="color:#ff4444;">›</span></div>
    </div>
  </div>`;
}
