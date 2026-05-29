function renderBottomNav() {
  return '<div class="bottom-nav" id="bottomNav"></div>';
}

function updateBottomNav() {
  var nav = document.getElementById('bottomNav');
  if (!nav) return;

  var role = (authState && authState.role) ? authState.role : 'cliente';

  // Usando SVG inline para ícones mais modernos
  var icons = {
    home:     '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
    scissors: '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/></svg>',
    barber:   '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l7 4.5-7 4.5z"/></svg>',
    chat:     '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>',
    money:    '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>',
    profile:  '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
    agenda:   '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>',
  };

  var navCliente = [
    { id:'nav-home',      icon:icons.home,     label:'Início',    page:'home' },
    { id:'nav-services',  icon:icons.scissors, label:'Serviços',  page:'services' },
    { id:'nav-agendar',   icon:icons.calendar, label:'Agendar',   page:'agendar' },
    { id:'nav-barbeiros', icon:icons.barber,   label:'Barbeiros', page:'barbeiros' },
    { id:'nav-perfil',    icon:icons.profile,  label:'Perfil',    page:'perfil' },
  ];
  var navBarbeiro = [
    { id:'nav-home',     icon:icons.home,    label:'Início', page:'home' },
    { id:'nav-barbDash', icon:icons.agenda,  label:'Agenda', page:'barberDash' },
    { id:'nav-chat',     icon:icons.chat,    label:'Chat',   page:'chat' },
    { id:'nav-ganhos',   icon:icons.money,   label:'Ganhos', page:'ganhos' },
    { id:'nav-perfil',   icon:icons.profile, label:'Perfil', page:'perfilBarbeiro' },
  ];
  var navAdm = [
    { id:'nav-home',     icon:icons.home,     label:'Início',    page:'home' },
    { id:'nav-barbDash', icon:icons.agenda,   label:'Agenda',    page:'barberDash' },
    { id:'nav-services', icon:icons.scissors, label:'Serviços',  page:'services' },
    { id:'nav-barbeiros',icon:icons.barber,   label:'Barbeiros', page:'barbeiros' },
    { id:'nav-perfil',   icon:icons.profile,  label:'Perfil',    page:'perfil' },
  ];

  var items = role === 'barbeiro' ? navBarbeiro : role === 'adm' ? navAdm : navCliente;
  var html = '';
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var isActive = currentScreen === item.page;
    html += '<button class="nav-item' + (isActive?' active':'') + '" id="' + item.id + '" onclick="goTo(\'' + item.page + '\')">' +
      item.icon +
      '<span>' + item.label + '</span>' +
      '</button>';
  }
  nav.innerHTML = html;
}