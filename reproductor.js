// Reproductor sin barra de avance: un clic reproduce, otro pausa. No hay controles para saltar.
// Excepción: los vídeos pequeños (.player.small) se abren en grande en una ventana con controles.
var ventana = null;
function abrirGrande(src, poster, titulo) {
  if (!ventana) {
    ventana = document.createElement('dialog');
    ventana.className = 'vmodal';
    ventana.innerHTML = '<div class="vmodal-box"><div class="vmodal-top"><p class="vmodal-t"></p><button type="button" class="vmodal-x" aria-label="Cerrar el vídeo">✕</button></div><video controls playsinline controlsList="nodownload"></video></div>';
    document.body.appendChild(ventana);
    var cerrar = function () { var vv = ventana.querySelector('video'); vv.pause(); ventana.close(); };
    ventana.querySelector('.vmodal-x').addEventListener('click', cerrar);
    ventana.addEventListener('click', function (e) { if (e.target === ventana) cerrar(); });
    ventana.addEventListener('close', function () { ventana.querySelector('video').pause(); });
  }
  var vid = ventana.querySelector('video');
  ventana.querySelector('.vmodal-t').textContent = titulo;
  if (vid.getAttribute('src') !== src) { vid.src = src; if (poster) vid.poster = poster; }
  ventana.showModal();
  var pr = vid.play(); if (pr && pr.catch) pr.catch(function () {});
}
document.querySelectorAll('.player').forEach(function (p) {
  var v = p.querySelector('video');
  var b = p.querySelector('.player-btn');
  var src = p.getAttribute('data-src');
  var poster = p.getAttribute('data-poster');
  if (!src) return; // sin vídeo todavía: se queda el hueco
  v.src = src;
  if (poster) v.poster = poster;
  v.controls = false;
  v.disablePictureInPicture = true;
  v.setAttribute('controlsList', 'nodownload noplaybackrate');
  p.classList.add('ready');
  // Vídeos pequeños (página de gracias): se abren en grande en una ventana con su reproductor.
  if (p.classList.contains('small')) {
    b.addEventListener('click', function () {
      var t = p.closest('.vid'); var h = t && t.querySelector('h3');
      abrirGrande(src, poster, h ? h.textContent : 'Vídeo');
    });
    return;
  }
  b.addEventListener('click', function () {
    if (v.paused) { v.play(); } else { v.pause(); }
  });
  v.addEventListener('play', function () { p.classList.add('playing'); b.setAttribute('aria-label', 'Pausar el vídeo'); });
  // Píxel: ViewContent la primera vez que le dan al play del VSL.
  if (p.id === 'vsl') {
    v.addEventListener('play', function () {
      if (p.dataset.vc) return;
      p.dataset.vc = '1';
      if (window.fbq) fbq('track', 'ViewContent', { content_name: 'VSL Agent Marketing OS' });
    });
  }
  v.addEventListener('pause', function () { p.classList.remove('playing'); b.setAttribute('aria-label', 'Reproducir el vídeo'); });
  v.addEventListener('ended', function () { p.classList.remove('playing'); });
});
