// Reproductor sin barra de avance: un clic reproduce, otro pausa. No hay controles para saltar.
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
