function renderEditarPerfil() {
  if (!requireAuth()) return '<div class="screen" id="screen-editarPerfil"></div>';

  var p = authState.profile || {};
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
        <div id="edit-avatar-preview" style="width:88px;height:88px;border-radius:50%;border:3px solid var(--red);
          background:var(--card);overflow:hidden;margin:0 auto 12px;display:flex;align-items:center;justify-content:center;
          font-size:32px;font-weight:800;color:var(--red);">
          ${(authState.profile && authState.profile.avatar_url)
            ? '<img src="' + authState.profile.avatar_url + '" style="width:100%;height:100%;object-fit:cover;">'
            : ((authState.profile && authState.profile.name) || 'U').charAt(0).toUpperCase()}
        </div>
        <label style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;background:rgba(255,30,30,.15);
          border:1px solid rgba(255,30,30,.4);border-radius:20px;cursor:pointer;font-size:12px;font-weight:700;color:var(--red);">
          📷 Alterar foto
          <input type="file" accept="image/*" onchange="previewAndUploadAvatar(this)" style="display:none;">
        </label>
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

      <div id="edit-error" style="display:none;background:rgba(255,30,30,.1);border:1px solid rgba(255,30,30,.3);border-radius:10px;padding:12px;font-size:13px;color:#ff6666;margin-bottom:14px;text-align:center;"></div>

      <button class="btn" onclick="salvarPerfil()">💾 SALVAR ALTERAÇÕES</button>
    </div>
  </div>`;
}

async function previewAndUploadAvatar(input) {
  if (!input.files || !input.files[0]) return;
  var file = input.files[0];

  // Preview
  var reader = new FileReader();
  reader.onload = function(e) {
    var preview = document.getElementById('edit-avatar-preview');
    if (preview) preview.innerHTML = '<img src="' + e.target.result + '" style="width:100%;height:100%;object-fit:cover;">';
  };
  reader.readAsDataURL(file);

  // Upload
  var ext = file.name.split('.').pop();
  var path = 'avatars/' + authState.user.id + '.' + ext;
  var result = await sb.storage.from('avatars').upload(path, file, { upsert: true });
  if (result.error) { alert('Erro ao enviar foto: ' + result.error.message); return; }

  var urlResult = sb.storage.from('avatars').getPublicUrl(path);
  if (urlResult.data) {
    await sb.from('profiles').update({ avatar_url: urlResult.data.publicUrl }).eq('id', authState.user.id);
    if (authState.profile) authState.profile.avatar_url = urlResult.data.publicUrl;
  }
}

async function salvarPerfil() {
  var name  = (document.getElementById('edit-name')||{}).value || '';
  var nick  = (document.getElementById('edit-nick')||{}).value || '';
  var phone = (document.getElementById('edit-phone')||{}).value || '';
  var errEl = document.getElementById('edit-error');

  if (!name.trim()) { errEl.textContent = 'Nome é obrigatório.'; errEl.style.display = 'block'; return; }

  var btn = document.querySelector('#screen-editarPerfil .btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Salvando...'; }

  var result = await sb.from('profiles').update({ name:name, nick:nick, phone:phone }).eq('id', authState.user.id);

  if (btn) { btn.disabled = false; btn.textContent = '💾 SALVAR ALTERAÇÕES'; }

  if (result.error) { errEl.textContent = 'Erro ao salvar.'; errEl.style.display = 'block'; return; }

  if (authState.profile) { authState.profile.name = name; authState.profile.nick = nick; authState.profile.phone = phone; }
  goTo('perfil');
}