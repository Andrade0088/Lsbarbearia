function renderBottomNav() {
  return '<div class="bottom-nav" id="bottomNav"></div>';
}

function updateBottomNav() {
  var nav = document.getElementById('bottomNav');
  if (!nav) return;

  var role = (authState && authState.role) ? authState.role : 'cliente';

  var navCliente = [
    { id:'nav-home',      icon:'🏠', label:'Início',    page:'home' },
    { id:'nav-services',  icon:'✂️', label:'Serviços',  page:'services' },
    { id:'nav-agendar',   icon:'📅', label:'Agendar',   page:'agendar' },
    { id:'nav-barbeiros', icon:'💈', label:'Barbeiros', page:'barbeiros' },
    { id:'nav-perfil',    icon:'👤', label:'Perfil',    page:'perfil' },
  ];
  var navBarbeiro = [
    { id:'nav-home',     icon:'🏠', label:'Início',  page:'home' },
    { id:'nav-barbDash', icon:'📋', label:'Agenda',  page:'barberDash' },
    { id:'nav-chat',     icon:'💬', label:'Chat',    page:'chat' },
    { id:'nav-ganhos',   icon:'💰', label:'Ganhos',  page:'ganhos' },
    { id:'nav-perfil',   icon:'👤', label:'Perfil',  page:'perfilBarbeiro' },
  ];
  var navAdm = [
    { id:'nav-home',     icon:'🏠', label:'Início',    page:'home' },
    { id:'nav-barbDash', icon:'📋', label:'Agenda',    page:'barberDash' },
    { id:'nav-services', icon:'✂️', label:'Serviços',  page:'services' },
    { id:'nav-barbeiros',icon:'💈', label:'Barbeiros', page:'barbeiros' },
    { id:'nav-perfil',   icon:'👤', label:'Perfil',    page:'perfil' },
  ];

  var items = role === 'barbeiro' ? navBarbeiro : role === 'adm' ? navAdm : navCliente;
  var html = '';
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var isActive = currentScreen === item.page ? ' active' : '';
    html += '<button class="nav-item' + isActive + '" id="' + item.id + '" onclick="goTo(\'' + item.page + '\')">' +
      '<span class="nav-icon">' + item.icon + '</span>' +
      '<span>' + item.label + '</span>' +
      '</button>';
  }
  nav.innerHTML = html;
}