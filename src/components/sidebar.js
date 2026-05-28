function renderSidebar() {
  return `
  <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
  <div class="sidebar" id="sidebar">
    <button class="sidebar-close" onclick="closeSidebar()">✕</button>
    <div class="sidebar-header">
      <div class="sidebar-logo">DOM <span>CORTES</span></div>
      <div class="sidebar-sub">BARBEARIA PREMIUM · DESDE 2018</div>
    </div>
    <div class="sidebar-menu">
      <div class="s-item active" onclick="goTo('home');closeSidebar()"><span class="s-icon">🏠</span><span class="s-label">Início</span></div>
      <div class="s-item" onclick="goTo('services');closeSidebar()"><span class="s-icon">✂️</span><span class="s-label">Serviços</span></div>
      <div class="s-item" onclick="goTo('agendar');closeSidebar()"><span class="s-icon">📅</span><span class="s-label">Agendar</span></div>
      <div class="s-item" onclick="goTo('barbeiros');closeSidebar()"><span class="s-icon">🧔</span><span class="s-label">Barbeiros</span></div>
      <div class="s-item" onclick="goTo('promos');closeSidebar()"><span class="s-icon">🔥</span><span class="s-label">Promoções</span></div>
      <div class="s-item" onclick="goTo('galeria');closeSidebar()"><span class="s-icon">📸</span><span class="s-label">Galeria</span></div>
      <div class="s-item" onclick="goTo('perfil');closeSidebar()"><span class="s-icon">👤</span><span class="s-label">Meu Perfil</span></div>
      <div class="s-item" onclick="goTo('barberDash');closeSidebar()"><span class="s-icon">💈</span><span class="s-label">Área do Barbeiro</span></div>
      <div class="s-item"><span class="s-icon">ℹ️</span><span class="s-label">Sobre nós</span></div>
      <div class="s-item"><span class="s-icon">📞</span><span class="s-label">Contato</span></div>
    </div>
    <div class="sidebar-footer">
      <a>📷</a><a>💬</a><a>📘</a>
    </div>
  </div>`;
}

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}
