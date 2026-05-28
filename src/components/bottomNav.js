function renderBottomNav() {
  return `<div class="bottom-nav" id="bottomNav"></div>`;
}

function updateBottomNav() {
  const nav = document.getElementById('bottomNav');
  if (!nav) return;

  const role = authState?.role || 'cliente';

  const navs = {
    cliente: [
      { id:'nav-home',      icon:'🏠', label:'Início',    page:'home' },
      { id:'nav-services',  icon:'✂️', label:'Serviços',  page:'services' },
      { id:'nav-agendar',   icon:'📅', label:'Agendar',   page:'agendar' },
      { id:'nav-barbeiros', icon:'💈', label:'Barbeiros', page:'barbeiros' },
      { id:'nav-perfil',    icon:'👤', label:'Perfil',    page:'perfil' },
    ],
    barbeiro: [
      { id:'nav-home',     icon:'🏠', label:'Início',   page:'home' },
      { id:'nav-barbDash', icon:'📋', label:'Agenda',   page:'barberDash' },
      { id:'nav-chat',     icon:'💬', label:'Chat',     page:'chat' },
      { id:'nav-ganhos',   icon:'💰', label:'Ganhos',   page:'ganhos' },
      { id:'nav-perfil',   icon:'👤', label:'Perfil',   page:'perfil' },
    ],
    adm: [
      { id:'nav-home',     icon:'🏠', label:'Início',    page:'home' },
      { id:'nav-barbDash', icon:'📋', label:'Agenda',    page:'barberDash' },
      { id:'nav-services', icon:'✂️', label:'Serviços',  page:'services' },
      { id:'nav-barbeiros',icon:'💈', label:'Barbeiros', page:'barbeiros' },
      { id:'nav-perfil',   icon:'👤', label:'Perfil',    page:'perfil' },
    ]
  };

  const items = navs[role] || navs.cliente;

  nav.innerHTML = items.map(item => `
    <button class="nav-item${currentScreen === item.page ? ' active' : ''}"
      id="${item.id}" onclick="goTo('${item.page}')">
      <span class="nav-icon">${item.icon}</span>
      <span>${item.label}</span>
    </button>`).join('');
}