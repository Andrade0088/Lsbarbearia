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
};

// Telas que exibem bottom nav
const SHOW_NAV = ['home','services','agendar','barbeiros','perfil','barberDash','promos','galeria'];

// Nav por role
const NAV_CLIENTE  = ['home','services','agendar','barbeiros','perfil'];
const NAV_BARBEIRO = ['home','barberDash','agendar','chat','perfil'];
const NAV_ADM      = ['home','barberDash','services','barbeiros','perfil'];

const NAV_MAP = {
  home:'nav-home', services:'nav-services', agendar:'nav-agendar',
  barbeiros:'nav-barbeiros', perfil:'nav-perfil', barberDash:'nav-barbDash'
};

let currentScreen = '';

// ── Boot ──────────────────────────────────────────────────
function buildApp() {
  const app = document.getElementById('app');
  app.innerHTML = renderSidebar() + renderBottomNav();
  initAuth(); // auth.js cuida do redirecionamento
}

// ── Router ────────────────────────────────────────────────
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

  // Bottom nav
  const showNav = SHOW_NAV.includes(name) && authState.user;
  document.getElementById('bottomNav').style.display = showNav ? 'flex' : 'none';

  // Highlight nav item
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  if (NAV_MAP[name]) document.getElementById(NAV_MAP[name])?.classList.add('active');

  // Post-render hooks
  if (name === 'agendar')     initCalendar();
  if (name === 'confirmacao') syncConfirmScreen();

  updateSidebarActive(name);
}

function reRenderScreen(name) {
  const old = document.getElementById('screen-' + name);
  if (!old) return;
  const nav = document.getElementById('bottomNav');
  nav.insertAdjacentHTML('beforebegin', SCREENS[name]());
  old.remove();
  document.getElementById('screen-' + name)?.classList.add('active');
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
  const map = { home:0,services:1,agendar:2,barbeiros:3,promos:4,galeria:5,perfil:6,barberDash:7,login:8 };
  const idx = map[page];
  if (idx !== undefined) document.querySelectorAll('.s-item')[idx]?.classList.add('active');
}

buildApp();
