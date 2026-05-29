function renderAvaliacoes() {
  if (!requireAuth()) return '<div class="screen" id="screen-avaliacoes"></div>';
  return `
  <div class="screen" id="screen-avaliacoes">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('perfil')">←</button>
      <span class="page-title">AVALIAR BARBEIRO</span>
      <span style="width:24px"></span>
    </div>
    <div style="padding:20px;">
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:20px;">Avalie o barbeiro do seu último atendimento.</p>

      <div id="avaliacao-barbeiro-select" style="margin-bottom:20px;">
        ${APP_DATA.barbers.map(function(b) {
          var hasPhoto = b.photo && b.photo.indexOf('_URL') < 0;
          return '<div onclick="selecionarBarbeiroAvaliacao(' + b.id + ',\'' + b.name + '\',this)" ' +
            'style="display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--card);' +
            'border:1px solid rgba(255,255,255,.08);border-radius:12px;margin-bottom:8px;cursor:pointer;" ' +
            'id="avaliacao-barber-' + b.id + '">' +
            '<div style="width:44px;height:44px;border-radius:50%;border:2px solid rgba(255,30,30,.4);overflow:hidden;flex-shrink:0;background:var(--card2);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:var(--red);">' +
            (hasPhoto ? '<img src="' + b.photo + '" style="width:100%;height:100%;object-fit:cover;">' : b.name.charAt(0)) +
            '</div>' +
            '<p style="font-size:14px;font-weight:600;">' + b.name + '</p>' +
            '<span style="margin-left:auto;color:rgba(255,255,255,.2);font-size:18px;" id="avaliacao-check-' + b.id + '">○</span>' +
            '</div>';
        }).join('')}
      </div>

      <p style="font-size:12px;font-weight:700;color:var(--text-muted);letter-spacing:.5px;margin-bottom:10px;">NOTA</p>
      <div id="estrelas" style="display:flex;gap:8px;margin-bottom:16px;">
        ${[1,2,3,4,5].map(function(n) {
          return '<span onclick="selecionarEstrela(' + n + ')" style="font-size:32px;cursor:pointer;transition:.2s;" id="estrela-' + n + '">☆</span>';
        }).join('')}
      </div>

      <p style="font-size:12px;font-weight:700;color:var(--text-muted);letter-spacing:.5px;margin-bottom:8px;">COMENTÁRIO (opcional)</p>
      <textarea id="avaliacao-texto" placeholder="Conte como foi o atendimento..."
        style="width:100%;padding:12px 14px;background:var(--card);border:1px solid rgba(255,255,255,.1);
        border-radius:12px;color:white;font-size:13px;outline:none;resize:none;height:80px;margin-bottom:16px;font-family:inherit;"></textarea>

      <div id="avaliacao-error" style="display:none;background:rgba(255,30,30,.1);border:1px solid rgba(255,30,30,.3);border-radius:10px;padding:12px;font-size:13px;color:#ff6666;margin-bottom:14px;text-align:center;"></div>

      <button class="btn" onclick="enviarAvaliacao()">⭐ ENVIAR AVALIAÇÃO</button>
    </div>
  </div>`;
}

var avaliacaoState = { barberId: null, barberName: '', nota: 0 };

function selecionarBarbeiroAvaliacao(id, name, el) {
  avaliacaoState.barberId = id;
  avaliacaoState.barberName = name;
  document.querySelectorAll('[id^="avaliacao-barber-"]').forEach(function(e) {
    e.style.borderColor = 'rgba(255,255,255,.08)';
  });
  document.querySelectorAll('[id^="avaliacao-check-"]').forEach(function(e) {
    e.textContent = '○'; e.style.color = 'rgba(255,255,255,.2)';
  });
  el.style.borderColor = 'var(--red)';
  var check = document.getElementById('avaliacao-check-' + id);
  if (check) { check.textContent = '●'; check.style.color = 'var(--red)'; }
}

function selecionarEstrela(n) {
  avaliacaoState.nota = n;
  for (var i = 1; i <= 5; i++) {
    var el = document.getElementById('estrela-' + i);
    if (el) el.textContent = i <= n ? '★' : '☆';
    if (el) el.style.color = i <= n ? '#ffcc00' : 'white';
  }
}

async function enviarAvaliacao() {
  var errEl = document.getElementById('avaliacao-error');
  errEl.style.display = 'none';

  if (!avaliacaoState.barberId) { errEl.textContent = 'Escolha um barbeiro.'; errEl.style.display = 'block'; return; }
  if (!avaliacaoState.nota) { errEl.textContent = 'Selecione uma nota.'; errEl.style.display = 'block'; return; }

  var texto = (document.getElementById('avaliacao-texto')||{}).value || '';
  var btn = document.querySelector('#screen-avaliacoes .btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Enviando...'; }

  // Busca UUID do barbeiro
  var barberResult = await sb.from('profiles').select('id').eq('nick', APP_DATA.barbers.find(function(b){ return b.id === avaliacaoState.barberId; }).nick).single();
  var barberUUID = barberResult.data ? barberResult.data.id : null;

  var result = await sb.from('reviews').insert({
    client_id:  authState.user.id,
    barber_id:  barberUUID,
    rating:     avaliacaoState.nota,
    comment:    texto,
    created_at: new Date().toISOString()
  });

  if (btn) { btn.disabled = false; btn.textContent = '⭐ ENVIAR AVALIAÇÃO'; }

  if (result.error) {
    errEl.textContent = 'Erro ao enviar. Tente novamente.'; errEl.style.display = 'block'; return;
  }

  alert('Avaliação enviada! Obrigado 😊');
  goTo('perfil');
}