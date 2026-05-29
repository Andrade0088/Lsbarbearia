function renderEditarPerfil() {
  if (!requireAuth()) return '<div class="screen" id="screen-editarPerfil"></div>';

  var p = authState.profile || {};
  var avatarUrl = p.avatar_url || null;
  var initials = (p.name || 'U').charAt(0).toUpperCase();

  return `
  <div class="screen" id="screen-editarPerfil">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('perfil')">←</button>
      <span class="page-title">EDITAR PERFIL</span>
      <span style="width:24px"></span>
    </div>
    <div style="padding:24px 20px;">

      <!-- Foto de perfil -->
      <div style="text-align:center;margin-bottom:24px;">
        <div id="edit-avatar-preview" style="width:100px;height:100px;border-radius:50%;border:3px solid var(--red);
          background:var(--card);overflow:hidden;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;
          font-size:36px;font-weight:800;color:var(--red);">
          ${avatarUrl
            ? '<img src="' + avatarUrl + '?t=' + Date.now() + '" style="width:100%;height:100%;object-fit:cover;">'
            : initials}
        </div>
        <label style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:rgba(255,30,30,.15);
          border:1px solid rgba(255,30,30,.4);border-radius:20px;cursor:pointer;font-size:12px;font-weight:700;color:var(--red);">
          📷 Alterar foto
          <input type="file" accept="image/*" onchange="abrirCropFoto(this)" style="display:none;">
        </label>
        <div style="display:flex;gap:8px;justify-content:center;margin-top:10px;">
          <label style="display:inline-flex;align-items:center;gap:5px;padding:7px 14px;background:var(--card);
            border:1px solid rgba(255,255,255,.15);border-radius:20px;cursor:pointer;font-size:12px;color:white;">
            🖼️ Galeria
            <input type="file" accept="image/*" onchange="abrirCropFoto(this)" style="display:none;">
          </label>
          <label style="display:inline-flex;align-items:center;gap:5px;padding:7px 14px;background:var(--card);
            border:1px solid rgba(255,255,255,.15);border-radius:20px;cursor:pointer;font-size:12px;color:white;">
            📸 Câmera
            <input type="file" accept="image/*" capture="environment" onchange="abrirCropFoto(this)" style="display:none;">
          </label>
        </div>
        <p style="font-size:11px;color:var(--text-muted);margin-top:8px;">Após selecionar, recorte e clique em Salvar</p>
      </div>

      <!-- Modal de recorte -->
      <div id="crop-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.95);z-index:500;
        flex-direction:column;align-items:center;justify-content:center;padding:20px;">
        <p style="color:white;font-size:14px;font-weight:700;margin-bottom:12px;">Recorte sua foto</p>
        <div style="position:relative;width:280px;height:280px;overflow:hidden;border-radius:50%;border:3px solid var(--red);margin-bottom:16px;">
          <img id="crop-img" style="position:absolute;cursor:move;max-width:none;"
            onmousedown="startDrag(event)" ontouchstart="startDrag(event)">
        </div>
        <div style="display:flex;gap:8px;margin-bottom:12px;">
          <button onclick="zoomCrop(-0.15)" style="padding:8px 16px;background:var(--card);border:1px solid rgba(255,255,255,.2);border-radius:10px;color:white;cursor:pointer;font-size:18px;font-weight:700;">−</button>
          <span style="color:var(--text-muted);font-size:12px;padding:8px 4px;">Zoom / 2 dedos</span>
          <button onclick="zoomCrop(0.15)" style="padding:8px 16px;background:var(--card);border:1px solid rgba(255,255,255,.2);border-radius:10px;color:white;cursor:pointer;font-size:18px;font-weight:700;">+</button>
        </div>
        <div style="display:flex;gap:10px;width:100%;max-width:280px;">
          <button onclick="fecharCrop()" style="flex:1;padding:12px;background:transparent;border:1px solid rgba(255,255,255,.2);border-radius:12px;color:white;cursor:pointer;font-size:13px;font-weight:700;">Cancelar</button>
          <button onclick="confirmarCrop()" style="flex:1;padding:12px;background:var(--red);border:none;border-radius:12px;color:white;cursor:pointer;font-size:13px;font-weight:700;">✓ Usar foto</button>
        </div>
      </div>

      <div style="margin-bottom:14px;">
        <label style="font-size:12px;font-weight:600;color:var(--text-muted);letter-spacing:.5px;">NOME</label>
        <input id="edit-name" type="text" value="${p.name||''}"
          style="width:100%;margin-top:6px;padding:14px 16px;background:var(--card);border:1px solid rgba(255,255,255,.1);border-radius:12px;color:white;font-size:14px;outline:none;">
      </div>

      <div style="margin-bottom:14px;">
        <label style="font-size:12px;font-weight:600;color:var(--text-muted);letter-spacing:.5px;">APELIDO</label>
        <input id="edit-nick" type="text" value="${p.nick||''}" placeholder="@seunick"
          style="width:100%;margin-top:6px;padding:14px 16px;background:var(--card);border:1px solid rgba(255,255,255,.1);border-radius:12px;color:white;font-size:14px;outline:none;">
      </div>

      <div style="margin-bottom:24px;">
        <label style="font-size:12px;font-weight:600;color:var(--text-muted);letter-spacing:.5px;">WHATSAPP</label>
        <input id="edit-phone" type="tel" value="${p.phone||''}" placeholder="(11) 99999-9999"
          style="width:100%;margin-top:6px;padding:14px 16px;background:var(--card);border:1px solid rgba(255,255,255,.1);border-radius:12px;color:white;font-size:14px;outline:none;">
      </div>

      <div id="edit-msg" style="display:none;background:rgba(0,200,100,.1);border:1px solid rgba(0,200,100,.3);border-radius:10px;padding:12px;font-size:13px;color:#00c864;margin-bottom:14px;text-align:center;"></div>
      <div id="edit-error" style="display:none;background:rgba(255,30,30,.1);border:1px solid rgba(255,30,30,.3);border-radius:10px;padding:12px;font-size:13px;color:#ff6666;margin-bottom:14px;text-align:center;"></div>

      <button class="btn" id="salvar-btn" onclick="salvarPerfil()">💾 SALVAR ALTERAÇÕES</button>
    </div>
  </div>`;
}

// ── Crop ──────────────────────────────────────────────────
var cropState = { scale:1, x:0, y:0, dragging:false, startX:0, startY:0, lastX:0, lastY:0, blob:null };

function abrirCropFoto(input) {
  if (!input.files || !input.files[0]) return;
  var file = input.files[0];

  // Usa FileReader para evitar problemas de CORS
  var reader = new FileReader();
  reader.onload = function(e) {
    var modal = document.getElementById('crop-modal');
    var img   = document.getElementById('crop-img');
    if (!modal || !img) return;

    // Cria nova imagem para garantir que carrega
    var tempImg = new Image();
    tempImg.onload = function() {
      img.src = e.target.result;
      img.onload = function() {
        // Calcula escala inicial para preencher o círculo de 280px
        var minDim = Math.min(img.naturalWidth, img.naturalHeight);
        cropState.scale = 280 / minDim;
        cropState.x = 0;
        cropState.y = 0;
        img.style.width  = (img.naturalWidth  * cropState.scale) + 'px';
        img.style.height = (img.naturalHeight * cropState.scale) + 'px';
        img.style.left   = cropState.x + 'px';
        img.style.top    = cropState.y + 'px';
      };
    };
    tempImg.src = e.target.result;
    modal.style.display = 'flex';
  };
  reader.readAsDataURL(file);
}

function zoomCrop(delta) {
  var img = document.getElementById('crop-img');
  if (!img) return;
  cropState.scale = Math.max(0.3, Math.min(5, cropState.scale + delta));
  img.style.width  = (img.naturalWidth  * cropState.scale) + 'px';
  img.style.height = (img.naturalHeight * cropState.scale) + 'px';
}

function startDrag(e) {
  e.preventDefault();

  // Pinch to zoom (2 dedos)
  if (e.touches && e.touches.length === 2) {
    var t1 = e.touches[0];
    var t2 = e.touches[1];
    cropState.pinchDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    cropState.pinchScale = cropState.scale;

    function onPinch(ev) {
      if (ev.touches.length < 2) return;
      ev.preventDefault();
      var d = Math.hypot(ev.touches[1].clientX - ev.touches[0].clientX, ev.touches[1].clientY - ev.touches[0].clientY);
      var newScale = Math.max(0.3, Math.min(5, cropState.pinchScale * (d / cropState.pinchDist)));
      cropState.scale = newScale;
      var img = document.getElementById('crop-img');
      if (img) {
        img.style.width  = (img.naturalWidth  * newScale) + 'px';
        img.style.height = (img.naturalHeight * newScale) + 'px';
      }
    }
    function onPinchEnd() {
      document.removeEventListener('touchmove', onPinch);
      document.removeEventListener('touchend',  onPinchEnd);
    }
    document.addEventListener('touchmove', onPinch, { passive: false });
    document.addEventListener('touchend',  onPinchEnd);
    return;
  }

  // Drag (1 dedo ou mouse)
  cropState.dragging = true;
  var touch = e.touches ? e.touches[0] : e;
  cropState.startX = touch.clientX - cropState.x;
  cropState.startY = touch.clientY - cropState.y;

  function onMove(ev) {
    if (!cropState.dragging) return;
    ev.preventDefault();
    var t = ev.touches ? ev.touches[0] : ev;
    cropState.x = t.clientX - cropState.startX;
    cropState.y = t.clientY - cropState.startY;
    var img = document.getElementById('crop-img');
    if (img) { img.style.left = cropState.x + 'px'; img.style.top = cropState.y + 'px'; }
  }
  function onEnd() {
    cropState.dragging = false;
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup',   onEnd);
    document.removeEventListener('touchmove', onMove);
    document.removeEventListener('touchend',  onEnd);
  }
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup',   onEnd);
  document.addEventListener('touchmove', onMove, { passive: false });
  document.addEventListener('touchend',  onEnd);
}

function fecharCrop() {
  var modal = document.getElementById('crop-modal');
  if (modal) modal.style.display = 'none';
}

function confirmarCrop() {
  var img = document.getElementById('crop-img');
  if (!img) return;

  var size = 280;
  var canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  var ctx = canvas.getContext('2d');

  // Círculo de recorte
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, Math.PI*2);
  ctx.clip();

  // Pega o container circular
  var container = img.parentElement;
  var containerRect = container.getBoundingClientRect();
  var imgRect = img.getBoundingClientRect();

  // Calcula offset da imagem dentro do container
  var offsetX = imgRect.left - containerRect.left;
  var offsetY = imgRect.top  - containerRect.top;

  // Escala: pixels reais da imagem / pixels exibidos
  var displayW = img.offsetWidth;
  var displayH = img.offsetHeight;
  var scaleX = img.naturalWidth  / displayW;
  var scaleY = img.naturalHeight / displayH;

  // Desenha a parte visível da imagem no canvas
  ctx.drawImage(
    img,
    -offsetX * scaleX,
    -offsetY * scaleY,
    displayW * scaleX,
    displayH * scaleY,
    0, 0, size, size
  );

  fecharCrop();

  canvas.toBlob(function(blob) {
    if (!blob) { alert('Erro ao processar imagem. Tente novamente.'); return; }
    cropState.blob = blob;
    var url = URL.createObjectURL(blob);
    var preview = document.getElementById('edit-avatar-preview');
    if (preview) preview.innerHTML = '<img src="' + url + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">';
  }, 'image/jpeg', 0.9);
}

// ── Upload e Salvar ───────────────────────────────────────
async function previewAndUploadAvatar(input) {
  abrirCropFoto(input);
}

async function salvarPerfil() {
  var name  = (document.getElementById('edit-name')||{}).value || '';
  var nick  = (document.getElementById('edit-nick')||{}).value || '';
  var phone = (document.getElementById('edit-phone')||{}).value || '';
  var errEl = document.getElementById('edit-error');
  var msgEl = document.getElementById('edit-msg');
  var btn   = document.getElementById('salvar-btn');

  errEl.style.display = 'none';
  msgEl.style.display = 'none';

  if (!name.trim()) { errEl.textContent = 'Nome é obrigatório.'; errEl.style.display = 'block'; return; }

  btn.disabled = true; btn.textContent = 'Salvando...';

  var avatarUrl = authState.profile ? authState.profile.avatar_url : null;

  // Upload da foto se tiver recortado
  if (cropState.blob) {
    var ext  = 'jpg';
    var path = 'avatars/' + authState.user.id + '.' + ext;
    var upResult = await sb.storage.from('avatars').upload(path, cropState.blob, { upsert:true, contentType:'image/jpeg' });
    if (upResult.error) {
      errEl.textContent = 'Erro ao enviar foto: ' + upResult.error.message;
      errEl.style.display = 'block';
      btn.disabled = false; btn.textContent = '💾 SALVAR ALTERAÇÕES';
      return;
    }
    var urlData = sb.storage.from('avatars').getPublicUrl(path);
    avatarUrl = urlData.data.publicUrl + '?t=' + Date.now();
    cropState.blob = null;
  }

  // Salva perfil no banco
  var updateData = { name:name, nick:nick, phone:phone };
  if (avatarUrl) updateData.avatar_url = avatarUrl;

  var result = await sb.from('profiles').update(updateData).eq('id', authState.user.id);

  btn.disabled = false; btn.textContent = '💾 SALVAR ALTERAÇÕES';

  if (result.error) {
    errEl.textContent = 'Erro ao salvar: ' + result.error.message;
    errEl.style.display = 'block'; return;
  }

  // Atualiza o estado local
  if (authState.profile) {
    authState.profile.name       = name;
    authState.profile.nick       = nick;
    authState.profile.phone      = phone;
    if (avatarUrl) authState.profile.avatar_url = avatarUrl;
  }

  msgEl.textContent = '✅ Perfil salvo com sucesso!';
  msgEl.style.display = 'block';
  setTimeout(function() { goTo('perfil'); }, 1200);
}