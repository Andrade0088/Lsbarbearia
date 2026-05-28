function renderBottomNav() {
  return `
  <div class="bottom-nav" id="bottomNav">
    <button class="nav-item active" id="nav-home" onclick="goTo('home')">
      <span class="nav-icon">🏠</span><span>Início</span>
    </button>
    <button class="nav-item" id="nav-services" onclick="goTo('services')">
      <span class="nav-icon">✂️</span><span>Serviços</span>
    </button>
    <button class="nav-item" id="nav-agendar" onclick="goTo('agendar')">
      <span class="nav-icon">📅</span><span>Agendar</span>
    </button>
    <button class="nav-item" id="nav-barbeiros" onclick="goTo('barbeiros')">
      <span class="nav-icon">🧔</span><span>Barbeiros</span>
    </button>
    <button class="nav-item" id="nav-perfil" onclick="goTo('perfil')">
      <span class="nav-icon">👤</span><span>Perfil</span>
    </button>
  </div>`;
}
