function renderSidebar() {
  var isBarbeiro = authState && (authState.role === 'barbeiro' || authState.role === 'adm');
  var isAdm = authState && authState.role === 'adm';

  return `
  <div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>
  <div class="sidebar" id="sidebar">
    <button class="sidebar-close" onclick="closeSidebar()">✕</button>
    <div class="sidebar-header">
      <div class="sidebar-logo">LS<span>BARBEARIA</span></div>
      <div class="sidebar-sub">ESTILO · ATITUDE · CONFIANÇA</div>
    </div>
    <div class="sidebar-menu">
      <div class="s-item active" onclick="goTo('home');closeSidebar()">
        <span class="s-icon">🏠</span><span class="s-label">Início</span>
      </div>
      <div class="s-item" onclick="goTo('services');closeSidebar()">
        <span class="s-icon">✂️</span><span class="s-label">Serviços</span>
      </div>
      <div class="s-item" onclick="goTo('agendar');closeSidebar()">
        <span class="s-icon">📅</span><span class="s-label">Agendar</span>
      </div>
      <div class="s-item" onclick="goTo('barbeiros');closeSidebar()">
        <span class="s-icon">💈</span><span class="s-label">Barbeiros</span>
      </div>
      <div class="s-item" onclick="goTo('galeria');closeSidebar()">
        <span class="s-icon">📸</span><span class="s-label">Galeria</span>
      </div>
      <div class="s-item" onclick="goTo('chat');closeSidebar()">
        <span class="s-icon">💬</span><span class="s-label">Chat</span>
      </div>
      <div class="s-item" onclick="goTo('perfil');closeSidebar()">
        <span class="s-icon">👤</span><span class="s-label">Meu Perfil</span>
      </div>
      ${isBarbeiro ? `
      <div class="s-item" onclick="goTo('barberDash');closeSidebar()">
        <span class="s-icon">📋</span><span class="s-label">Minha Agenda</span>
      </div>
      <div class="s-item" onclick="goTo('ganhos');closeSidebar()">
        <span class="s-icon">💰</span><span class="s-label">Meus Ganhos</span>
      </div>
      <div class="s-item" onclick="goTo('escala');closeSidebar()">
        <span class="s-icon">🗓️</span><span class="s-label">Minha Escala</span>
      </div>` : ''}
      ${isAdm ? `
      <div class="s-item" onclick="goTo('barbeiros');closeSidebar()">
        <span class="s-icon">⚙️</span><span class="s-label">Gerenciar</span>
      </div>` : ''}
    </div>
    <div class="sidebar-footer">
      <a href="https://www.instagram.com/ls_barbearia00" target="_blank">📷</a>
      <a href="https://wa.me/5511919021251" target="_blank">💬</a>
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