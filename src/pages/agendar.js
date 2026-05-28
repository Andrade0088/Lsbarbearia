let calDate = new Date();

function renderAgendar() {
  return `
  <div class="screen" id="screen-agendar">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('services')">←</button>
      <span class="page-title">AGENDAR</span>
      <span style="width:24px"></span>
    </div>
    <div class="agendar-section">
      <div class="steps">
        <div class="step"><div class="step-circle done">✂️</div><span>Serviço</span></div>
        <div class="step-line done"></div>
        <div class="step"><div class="step-circle done">👤</div><span>Barbeiro</span></div>
        <div class="step-line done"></div>
        <div class="step"><div class="step-circle active">📅</div><span>Data e Hora</span></div>
        <div class="step-line"></div>
        <div class="step"><div class="step-circle todo">✓</div><span>Confirmar</span></div>
      </div>
      <div class="selected-service-box">
        <div>
          <div style="font-size:20px;margin-bottom:4px">✂️</div>
          <div class="svc-name" id="agendar-svc-name">Corte + Barba</div>
          <div class="svc-dur" id="agendar-svc-dur">Duração: 60 min</div>
        </div>
        <div class="price" id="agendar-svc-price">R$ 70,00</div>
      </div>
      <p style="font-size:12px;font-weight:700;letter-spacing:.5px;color:var(--text-muted);margin-bottom:10px;">ESCOLHA A DATA</p>
      <div class="cal-box">
        <div class="cal-header">
          <button onclick="changeMonth(-1)">‹</button>
          <span id="cal-month-label"></span>
          <button onclick="changeMonth(1)">›</button>
        </div>
        <div class="cal-days-header">
          <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
        </div>
        <div class="cal-grid" id="cal-grid"></div>
      </div>
      <p class="horarios-label">HORÁRIOS DISPONÍVEIS</p>
      <div class="horarios">
        ${['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00']
          .map((h, i) => {
            const unavail = [3, 10].includes(i);
            const sel = h === '15:00';
            return `<div class="hora${unavail ? ' unavail' : sel ? ' selected' : ''}" ${!unavail ? `onclick="selectHora(this,'${h}')"` : ''}>${h}</div>`;
          }).join('')}
      </div>
      <button class="btn" onclick="goTo('confirmacao')">CONTINUAR →</button>
    </div>
  </div>`;
}

function initCalendar() {
  renderCalendar();
}

function renderCalendar() {
  const grid = document.getElementById('cal-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const year = calDate.getFullYear(), month = calDate.getMonth();
  const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  document.getElementById('cal-month-label').textContent = months[month] + ' ' + year;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  for (let i = 0; i < firstDay; i++) {
    const d = document.createElement('div');
    d.className = 'cal-day empty';
    grid.appendChild(d);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const el = document.createElement('div');
    el.className = 'cal-day';
    el.textContent = d;
    const thisDate = new Date(year, month, d);
    if (thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      el.classList.add('past');
    } else if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      el.classList.add('today');
      currentState.selectedDate = `${String(d).padStart(2,'0')}/${String(month+1).padStart(2,'0')}/${year}`;
    } else {
      el.onclick = function () {
        document.querySelectorAll('.cal-day').forEach(x => x.classList.remove('selected'));
        this.classList.add('selected');
        currentState.selectedDate = `${String(d).padStart(2,'0')}/${String(month+1).padStart(2,'0')}/${year}`;
        updateConfirmDate();
      };
    }
    grid.appendChild(el);
  }
}

function changeMonth(dir) {
  calDate.setMonth(calDate.getMonth() + dir);
  renderCalendar();
}

function selectHora(el, hora) {
  document.querySelectorAll('.hora').forEach(h => h.classList.remove('selected'));
  el.classList.add('selected');
  currentState.selectedTime = hora;
  updateConfirmDate();
}

function updateConfirmDate() {
  const cd = document.getElementById('confirm-data');
  if (cd && currentState.selectedDate) {
    cd.textContent = currentState.selectedDate + ' - ' + currentState.selectedTime;
  }
}
