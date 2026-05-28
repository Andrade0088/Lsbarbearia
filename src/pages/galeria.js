function renderGaleria() {
  const imgs = [
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503951458645-643d53bfd90f?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503951458645-643d53bfd90f?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=300&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=300&auto=format&fit=crop',
  ];
  return `
  <div class="screen" id="screen-galeria">
    <div class="topbar">
      <button class="back-btn" onclick="goTo('home')">←</button>
      <span class="page-title">GALERIA</span>
      <span style="width:24px"></span>
    </div>
    <div class="gallery-tabs">
      <button class="g-tab active" onclick="setGalTab(this)">CORTES</button>
      <button class="g-tab" onclick="setGalTab(this)">BARBAS</button>
      <button class="g-tab" onclick="setGalTab(this)">DEGRADÊS</button>
      <button class="g-tab" onclick="setGalTab(this)">PIGMENTAÇÃO</button>
    </div>
    <div class="gallery-grid">
      ${imgs.map(src => `<div class="g-item"><img src="${src}" alt="corte" loading="lazy"></div>`).join('')}
    </div>
    <div style="padding:18px 20px;">
      <button class="btn-outline">VER MAIS FOTOS</button>
    </div>
  </div>`;
}

function setGalTab(el) {
  document.querySelectorAll('.g-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}
