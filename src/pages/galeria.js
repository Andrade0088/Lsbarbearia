function renderGaleria() {
  var activeBarberId = currentState.galeriaBarber || 1;
  var activeBarber = null;
  for (var i = 0; i < APP_DATA.barbers.length; i++) {
    if (APP_DATA.barbers[i].id === activeBarberId) { activeBarber = APP_DATA.barbers[i]; break; }
  }

  var isBarbeiro = authState && (authState.role === 'barbeiro' || authState.role === 'adm');

  var tabs = APP_DATA.barbers.map(function(b) {
    var isActive = b.id === activeBarberId;
    return '<button onclick="setGaleriaBarber(' + b.id + ')" ' +
      'style="padding:7px 16px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;' +
      'border:1px solid ' + (isActive ? 'var(--red)' : 'rgba(255,255,255,.1)') + ';' +
      'background:' + (isActive ? 'var(--red)' : 'transparent') + ';' +
      'color:' + (isActive ? 'white' : 'var(--text-muted)') + ';">' +
      b.name + '</button>';
  }).join('');

  var hasPhoto = activeBarber && activeBarber.photo && activeBarber.photo.indexOf('_URL') < 0;

  return `
  <div class="screen" id="screen-galeria">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('barbeiros')">←</button>
      <span class="page-title">GALERIA</span>
      <span style="width:24px"></span>
    </div>

    <div style="display:flex;gap:8px;padding:14px 20px;overflow-x:auto;">
      ${tabs}
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between;padding:0 20px 14px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <div style="width:44px;height:44px;border-radius:50%;border:2px solid var(--red);overflow:hidden;
          flex-shrink:0;background:var(--card);display:flex;align-items:center;justify-content:center;
          font-size:18px;font-weight:800;color:var(--red);">
          ${hasPhoto ? '<img src="' + activeBarber.photo + '" style="width:100%;height:100%;object-fit:cover;">' : (activeBarber ? activeBarber.name.charAt(0) : '?')}
        </div>
        <div>
          <p style="font-size:15px;font-weight:700;">${activeBarber ? activeBarber.name : ''}</p>
          <p style="font-size:12px;color:var(--text-muted);" id="galeria-count">Carregando...</p>
        </div>
      </div>
      ${isBarbeiro ? `
      <label style="display:flex;align-items:center;gap:6px;padding:8px 14px;background:var(--red);
        border-radius:10px;cursor:pointer;font-size:12px;font-weight:700;color:white;">
        📷 Subir foto
        <input type="file" id="galeria-upload" accept="image/*" multiple
          onchange="uploadFotosGaleria(this)" style="display:none;">
      </label>` : ''}
    </div>

    <div id="galeria-grid" class="gallery-grid" style="padding:0 20px;">
      <div style="grid-column:span 3;text-align:center;padding:30px;color:var(--text-muted);">
        <div style="font-size:30px;margin-bottom:8px;">⏳</div>
        <p>Carregando fotos...</p>
      </div>
    </div>

    <div id="galeria-upload-progress" style="display:none;padding:14px 20px;">
      <div style="background:var(--card);border-radius:10px;padding:12px 14px;border:1px solid rgba(255,30,30,.3);">
        <p id="galeria-progress-text" style="font-size:13px;color:white;text-align:center;">Enviando...</p>
      </div>
    </div>

    <div style="height:20px;"></div>
  </div>`;
}

async function loadGaleriaFotos() {
  var activeBarberId = currentState.galeriaBarber || 1;
  var activeBarber = null;
  for (var i = 0; i < APP_DATA.barbers.length; i++) {
    if (APP_DATA.barbers[i].id === activeBarberId) { activeBarber = APP_DATA.barbers[i]; break; }
  }
  if (!activeBarber) return;

  var isBarbeiro = authState && (authState.role === 'barbeiro' || authState.role === 'adm');
  var folder = 'barbeiro-' + activeBarberId;

  var result = await sb.storage.from('galeria').list(folder, { sortBy: { column:'created_at', order:'desc' } });

  var grid = document.getElementById('galeria-grid');
  var countEl = document.getElementById('galeria-count');
  if (!grid) return;

  if (result.error || !result.data || result.data.length === 0) {
    grid.innerHTML = '<div style="grid-column:span 3;text-align:center;padding:30px;color:var(--text-muted);">' +
      '<div style="font-size:40px;margin-bottom:10px;">📷</div>' +
      '<p style="font-size:13px;">Nenhuma foto ainda.</p>' +
      (isBarbeiro ? '<p style="font-size:12px;margin-top:6px;">Toque em "Subir foto" para adicionar!</p>' : '') +
      '</div>';
    if (countEl) countEl.textContent = '0 fotos';
    return;
  }

  var fotos = result.data.filter(function(f){ return f.name !== '.emptyFolderPlaceholder'; });
  if (countEl) countEl.textContent = fotos.length + ' foto' + (fotos.length !== 1 ? 's' : '');

  grid.innerHTML = fotos.map(function(foto) {
    var url = sb.storage.from('galeria').getPublicUrl(folder + '/' + foto.name).data.publicUrl;
    var canDelete = isBarbeiro;
    return '<div style="position:relative;aspect-ratio:1;border-radius:8px;overflow:hidden;cursor:pointer;">' +
      '<img src="' + url + '" alt="corte" loading="lazy" style="width:100%;height:100%;object-fit:cover;transition:.3s;" ' +
      'onclick="abrirFotoGaleria(\'' + url + '\')">' +
      (canDelete ? '<button onclick="deletarFotoGaleria(\'' + folder + '/' + foto.name + '\')" ' +
        'style="position:absolute;top:4px;right:4px;width:24px;height:24px;border-radius:50%;' +
        'background:rgba(0,0,0,.7);border:none;color:white;font-size:12px;cursor:pointer;' +
        'display:flex;align-items:center;justify-content:center;">✕</button>' : '') +
      '</div>';
  }).join('');
}

async function uploadFotosGaleria(input) {
  if (!input.files || input.files.length === 0) return;

  var activeBarberId = currentState.galeriaBarber || 1;
  var folder = 'barbeiro-' + activeBarberId;
  var progressEl = document.getElementById('galeria-upload-progress');
  var progressText = document.getElementById('galeria-progress-text');

  progressEl.style.display = 'block';

  for (var i = 0; i < input.files.length; i++) {
    var file = input.files[i];
    var ext = file.name.split('.').pop();
    var fileName = folder + '/' + Date.now() + '-' + i + '.' + ext;

    if (progressText) progressText.textContent = 'Enviando ' + (i+1) + ' de ' + input.files.length + '...';

    var result = await sb.storage.from('galeria').upload(fileName, file, { upsert: true });
    if (result.error) {
      alert('Erro ao enviar ' + file.name + ': ' + result.error.message);
    }
  }

  progressEl.style.display = 'none';
  input.value = '';
  await loadGaleriaFotos();
}

async function deletarFotoGaleria(path) {
  if (!confirm('Excluir esta foto?')) return;

  var result = await sb.storage.from('galeria').remove([path]);
  if (result.error) { alert('Erro ao excluir: ' + result.error.message); return; }
  await loadGaleriaFotos();
}

function abrirFotoGaleria(url) {
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:999;display:flex;align-items:center;justify-content:center;';
  overlay.onclick = function(){ document.body.removeChild(overlay); };
  overlay.innerHTML = '<img src="' + url + '" style="max-width:95vw;max-height:95vh;object-fit:contain;border-radius:8px;">';
  document.body.appendChild(overlay);
}

function setGaleriaBarber(id) {
  currentState.galeriaBarber = id;
  reRenderScreen('galeria');
  setTimeout(loadGaleriaFotos, 100);
}