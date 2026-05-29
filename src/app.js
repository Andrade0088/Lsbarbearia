var SCREENS = {
  login:          renderLogin,
  home:           renderHome,
  services:       renderServices,
  agendar:        renderAgendar,
  barbeiros:      renderBarbeiros,
  barberDash:     renderBarberDash,
  clienteDetalhe: renderClienteDetalhe,
  perfil:         renderPerfil,
  promos:         renderPromos,
  galeria:        renderGaleria,
  confirmacao:    renderConfirmacao,
  chat:           renderChat,
  ganhos:         renderGanhos,
  escala:         renderEscala,
  comanda:        renderComanda,
  meusAgendamentos: renderMeusAgendamentos,
  editarPerfil:   renderEditarPerfil,
  avaliacoes:     renderAvaliacoes,
  perfilBarbeiro: renderPerfilBarbeiro,
};

var HIDE_NAV = ['login', 'confirmacao'];
var currentScreen = '';

function buildApp() {
  var app = document.getElementById('app');
  app.innerHTML = renderSidebar() + renderBottomNav();
  initAuth();
}

function renderScreen(name) {
  if (!SCREENS[name]) { console.warn('Tela não encontrada:', name); return; }

  var old = document.getElementById('screen-' + currentScreen);
  if (old) old.parentNode.removeChild(old);

  currentScreen = name;

  var nav = document.getElementById('bottomNav');
  var html = SCREENS[name]();

  if (!nav) {
    document.getElementById('app').insertAdjacentHTML('beforeend', html);
  } else {
    nav.insertAdjacentHTML('beforebegin', html);
  }

  var el = document.getElementById('screen-' + name);
  if (el) {
    el.classList.add('active');
    window.scrollTo(0, 0);
  }

  var showNav = HIDE_NAV.indexOf(name) < 0 && authState && authState.user;
  if (nav) nav.style.display = showNav ? 'flex' : 'none';

  updateBottomNav();
  updateSidebarActive(name);

  if (name === 'agendar')          setTimeout(initAgendar, 50);
  if (name === 'confirmacao')      syncConfirmScreen();
  if (name === 'perfil')           setTimeout(loadNextBooking, 100);
  if (name === 'meusAgendamentos') setTimeout(loadMeusAgendamentos, 100);
  if (name === 'ganhos')           setTimeout(loadGanhos, 100);
  if (name === 'barberDash')       setTimeout(loadBarberAppointments, 100);
  if (name === 'chat')             setTimeout(loadChats, 100);
  if (name === 'galeria')          setTimeout(loadGaleriaFotos, 100);
  if (name === 'clienteDetalhe')   setTimeout(loadClienteDetalhe, 100);
}

function reRenderScreen(name) {
  var old = document.getElementById('screen-' + name);
  if (!old) return;
  var nav = document.getElementById('bottomNav');
  var html = SCREENS[name]();
  if (nav) nav.insertAdjacentHTML('beforebegin', html);
  else document.getElementById('app').insertAdjacentHTML('beforeend', html);
  old.parentNode.removeChild(old);
  var el = document.getElementById('screen-' + name);
  if (el) el.classList.add('active');
  updateBottomNav();
}

function goTo(name) { renderScreen(name); }

function syncConfirmScreen() {
  var cd = document.getElementById('confirm-data');
  var cs = document.getElementById('confirm-svc');
  if (cd && currentState.selectedDate)
    cd.textContent = currentState.selectedDate + ' - ' + currentState.selectedTime;
  if (cs) cs.textContent = currentState.selectedService.name;
}

function updateSidebarActive(page) {
  var items = document.querySelectorAll('.s-item');
  for (var i = 0; i < items.length; i++) items[i].classList.remove('active');
  var map = { home:0, services:1, agendar:2, barbeiros:3, promos:4, galeria:5, perfil:6, barberDash:7 };
  var idx = map[page];
  if (idx !== undefined && items[idx]) items[idx].classList.add('active');
}

buildApp();