// Fotos por barbeiro - substitua pelas URLs reais do Supabase Storage
var GALERIA_FOTOS = {
  1: [ // Leonardo
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503951458645-643d53bfd90f?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=400&auto=format&fit=crop'
  ],
  2: [ // Gabriel (Biel)
    'https://images.unsplash.com/photo-1503951458645-643d53bfd90f?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503951458645-643d53bfd90f?q=80&w=400&auto=format&fit=crop'
  ],
  3: [ // Pumpe
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503951458645-643d53bfd90f?q=80&w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=400&auto=format&fit=crop'
  ]
};

function renderGaleria() {
  var activeBarberId = currentState.galeriaBarber || 1;
  var activeBarber = null;
  for (var i = 0; i < APP_DATA.barbers.length; i++) {
    if (APP_DATA.barbers[i].id === activeBarberId) { activeBarber = APP_DATA.barbers[i]; break; }
  }

  var tabs = APP_DATA.barbers.map(function(b) {
    var isActive = b.id === activeBarberId;
    return '<button onclick="setGaleriaBarber(' + b.id + ')" ' +
      'style="padding:7px 16px;border-radius:20px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;' +
      'border:1px solid ' + (isActive ? 'var(--red)' : 'rgba(255,255,255,.1)') + ';' +
      'background:' + (isActive ? 'var(--red)' : 'transparent') + ';' +
      'color:' + (isActive ? 'white' : 'var(--text-muted)') + ';">' +
      b.name + '</button>';
  }).join('');

  var fotos = GALERIA_FOTOS[activeBarberId] || [];
  var grid = fotos.map(function(src) {
    return '<div class="g-item"><img src="' + src + '" alt="corte" loading="lazy"></div>';
  }).join('');

  var hasPhoto = activeBarber && activeBarber.photo && activeBarber.photo.indexOf('_URL') < 0;

  return `
  <div class="screen" id="screen-galeria">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('barbeiros')">←</button>
      <span class="page-title">GALERIA</span>
      <span style="width:24px"></span>
    </div>

    <!-- Tabs por barbeiro -->
    <div style="display:flex;gap:8px;padding:14px 20px;overflow-x:auto;">
      ${tabs}
    </div>

    <!-- Header do barbeiro ativo -->
    <div style="display:flex;align-items:center;gap:12px;padding:0 20px 16px;">
      <div style="width:48px;height:48px;border-radius:50%;border:2px solid var(--red);overflow:hidden;flex-shrink:0;
        background:var(--card);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:var(--red);">
        ${hasPhoto ? '<img src="' + activeBarber.photo + '" style="width:100%;height:100%;object-fit:cover;">' : (activeBarber ? activeBarber.name.charAt(0) : '?')}
      </div>
      <div>
        <p style="font-size:15px;font-weight:700;">${activeBarber ? activeBarber.name : ''}</p>
        <p style="font-size:12px;color:var(--text-muted);">${fotos.length} fotos</p>
      </div>
    </div>

    <!-- Grid de fotos -->
    <div class="gallery-grid" style="padding:0 20px;">
      ${grid.length > 0 ? grid : '<p style="color:var(--text-muted);font-size:13px;text-align:center;padding:30px 0;grid-column:span 3;">Nenhuma foto ainda.</p>'}
    </div>

    <div style="height:20px;"></div>
  </div>`;
}

function setGaleriaBarber(id) {
  currentState.galeriaBarber = id;
  reRenderScreen('galeria');
}

function setGalTab(el) {
  document.querySelectorAll('.g-tab').forEach(function(t) { t.classList.remove('active'); });
  el.classList.add('active');
}