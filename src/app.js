const SCREENS = {
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
};

const HIDE_NAV = ['login', 'confirmacao'];
let currentScreen = '';

function buildApp() {
  const app = document.getElementById('app');
  app.innerHTML = renderSidebar() + renderBottomNav();
  initAuth();
}

function renderScreen(name) {
  if (!SCREENS[name]) { console.warn('Tela não encontrada:', name); return; }

  const old = document.getElementById('screen-' + currentScreen);
  if (old) old.remove();

  currentScreen = name;

  const nav = document.getElementById('bottomNav');
  if (!nav) {
    document.getElementById('app').insertAdjacentHTML('beforeend', SCREENS[name]());
  } else {
    nav.insertAdjacentHTML('beforebegin', SCREENS[name]());
  }

  const el = document.getElementById('screen-' + name);
  if (el) { el.classList.add('active'); window.scrollTo(0,0); }

  const showNav = !HIDE_NAV.includes(name) && authState?.user;
  if (nav) nav.style.display = showNav ? 'flex' : 'none';

  updateBottomNav();
  updateSidebarActive(name);

  // Post-render hooks
  if (name === 'agendar')     initCalendar();
  if (name === 'confirmacao') syncConfirmScreen();
  if (name === 'perfil')      setTimeout(loadNextBooking, 100);
  if (name === 'ganhos')      setTimeout(loadGanhos, 100);
  if (name === 'barberDash')  setTimeout(loadBarberAppointments, 100);
  if (name === 'chat')        setTimeout(loadChats, 100);
  if (name === 'escala')      setTimeout(loadEscala, 100);
  if (name === 'clienteDetalhe') setTimeout(loadClienteDetalhe, 100);
}

function reRenderScreen(name) {
  const old = document.getElementById('screen-' + name);
  if (!old) return;
  const nav = document.getElementById('bottomNav');
  if (nav) nav.insertAdjacentHTML('beforebegin', SCREENS[name]());
  else document.getElementById('app').insertAdjacentHTML('beforeend', SCREENS[name]());
  old.remove();
  document.getElementById('screen-' + name)?.classList.add('active');
  updateBottomNav();
}

function goTo(name) { renderScreen(name); }

function syncConfirmScreen() {
  const cd = document.getElementById('confirm-data');
  const cs = document.getElementById('confirm-svc');
  if (cd && currentState.selectedDate)
    cd.textContent = currentState.selectedDate + ' - ' + currentState.selectedTime;
  if (cs) cs.textContent = currentState.selectedService.name;
}

function updateSidebarActive(page) {
  document.querySelectorAll('.s-item').forEach(i => i.classList.remove('active'));
  const map = { home:0,services:1,agendar:2,barbeiros:3,promos:4,galeria:5,perfil:6,barberDash:7 };
  const idx = map[page];
  if (idx !== undefined) document.querySelectorAll('.s-item')[idx]?.classList.add('active');
}

buildApp();