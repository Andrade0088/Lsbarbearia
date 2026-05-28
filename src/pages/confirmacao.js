function renderConfirmacao() {
  return `
  <div class="screen" id="screen-confirmacao">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('agendar')">←</button>
      <span style="width:24px"></span>
      <span style="width:24px"></span>
    </div>
    <div class="confirm-screen">
      <div class="confirm-icon">✔️</div>
      <h2>AGENDAMENTO<br><span>CONFIRMADO!</span></h2>
      <p>Seu horário foi reservado com sucesso.<br>Te esperamos!</p>
      <div class="confirm-details">
        <div class="confirm-row">
          <span class="cr-icon">📅</span>
          <div><p id="confirm-data">29/05/2025 - 15:00</p><span>Data e horário</span></div>
        </div>
        <div class="confirm-row">
          <span class="cr-icon">✂️</span>
          <div><p id="confirm-svc">Corte + Barba</p><span>Serviço</span></div>
        </div>
        <div class="confirm-row">
          <span class="cr-icon">👤</span>
          <div><p>Lucas Ferreira</p><span>Barbeiro</span></div>
        </div>
      </div>
      <button class="btn" onclick="goTo('perfil')" style="margin-bottom:12px;">VER MEUS AGENDAMENTOS</button>
      <button class="btn-outline" onclick="goTo('home')">VOLTAR PARA INÍCIO</button>
    </div>
  </div>`;
}
