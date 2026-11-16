// Reproductores de la web.
// - VSL (#vsl): se abre en grande en una ventana, SIN barra de avance (no se puede saltar).
//   Un toque reproduce o pausa; botón de pantalla completa (en el móvil, en horizontal).
// - Vídeos pequeños (.player.small, página de gracias): se abren en grande con el reproductor normal.

function crearVentana(clase, html) {
  var d = document.createElement('dialog');
  d.className = 'vmodal ' + clase;
  d.innerHTML = html;
  document.body.appendChild(d);
  return d;
}

// ── Vídeos pequeños: reproductor normal con controles ──
var ventana = null;
function abrirGrande(src, poster, titulo) {
  if (!ventana) {
    ventana = crearVentana('', '<div class="vmodal-box"><div class="vmodal-top"><p class="vmodal-t"></p><button type="button" class="vmodal-x" aria-label="Cerrar el vídeo">✕</button></div><video controls playsinline controlsList="nodownload"></video></div>');
    var cerrar = function () { ventana.querySelector('video').pause(); ventana.close(); };
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

// ── VSL: cuánto se ve. Avisa al píxel (evento personalizado) y a Clarity al pasar el 25, 50, 75 y 100 %.
//    Como no hay barra de avance, el porcentaje es tiempo visto de verdad. Cada hito, una vez por visita.
var hitosVsl = {};
function medirVsl(video) {
  if (video.dataset.mide) return;
  video.dataset.mide = '1';
  var marcar = function (pct) {
    if (hitosVsl[pct]) return;
    hitosVsl[pct] = true;
    if (window.fbq) fbq('trackCustom', 'VSL_' + pct, { porcentaje: pct, content_name: 'VSL Agent Marketing OS' });
    if (window.clarity) { clarity('event', 'vsl_' + pct); clarity('set', 'vsl_visto', String(pct)); }
  };
  video.addEventListener('timeupdate', function () {
    var d = video.duration;
    if (!d || !isFinite(d)) return;
    var p = video.currentTime / d;
    if (p >= 0.25) marcar(25);
    if (p >= 0.5) marcar(50);
    if (p >= 0.75) marcar(75);
    if (p >= 0.98) marcar(100);
  });
  video.addEventListener('ended', function () { marcar(25); marcar(50); marcar(75); marcar(100); });
}

// ── VSL: ventana grande sin barra de avance ──
var ventanaVsl = null;
function abrirVsl(src, poster, alPrimerPlay) {
  if (!ventanaVsl) {
    ventanaVsl = crearVentana('vmodal-vsl',
      '<div class="vmodal-box">' +
        '<div class="vmodal-top"><p class="vmodal-t">Mira el vídeo completo</p>' +
          '<div class="vmodal-acc"><button type="button" class="vmodal-fs" aria-label="Pantalla completa">⛶</button>' +
          '<button type="button" class="vmodal-x" aria-label="Cerrar el vídeo">✕</button></div></div>' +
        '<div class="vmodal-stage"><video playsinline disablepictureinpicture controlslist="nodownload noplaybackrate nofullscreen"></video>' +
          '<button type="button" class="vmodal-play" aria-label="Reproducir o pausar"><span class="play-icon" aria-hidden="true"></span></button></div>' +
      '</div>');
    var v = ventanaVsl.querySelector('video');
    var stage = ventanaVsl.querySelector('.vmodal-stage');
    var bp = ventanaVsl.querySelector('.vmodal-play');
    v.controls = false;
    var alternar = function () { if (v.paused) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else { v.pause(); } };
    bp.addEventListener('click', alternar);
    v.addEventListener('play', function () { stage.classList.add('playing'); });
    v.addEventListener('pause', function () { stage.classList.remove('playing'); });
    v.addEventListener('ended', function () { stage.classList.remove('playing'); });
    var salirFs = function () {
      ventanaVsl.classList.remove('girado');
      if (document.fullscreenElement) { document.exitFullscreen().catch(function () {}); }
      if (screen.orientation && screen.orientation.unlock) { try { screen.orientation.unlock(); } catch (e) {} }
    };
    ventanaVsl.querySelector('.vmodal-fs').addEventListener('click', function () {
      var box = ventanaVsl.querySelector('.vmodal-box');
      if (document.fullscreenElement || ventanaVsl.classList.contains('girado')) { salirFs(); return; }
      if (box.requestFullscreen) {
        box.requestFullscreen().then(function () {
          if (screen.orientation && screen.orientation.lock) { screen.orientation.lock('landscape').catch(function () {}); }
        }).catch(function () { ventanaVsl.classList.add('girado'); });
      } else {
        // iPhone: no deja pantalla completa sin barra; giramos la ventana para verlo en horizontal.
        ventanaVsl.classList.add('girado');
      }
    });
    var cerrar = function () { v.pause(); salirFs(); ventanaVsl.close(); };
    ventanaVsl.querySelector('.vmodal-x').addEventListener('click', cerrar);
    ventanaVsl.addEventListener('click', function (e) { if (e.target === ventanaVsl) cerrar(); });
    ventanaVsl.addEventListener('close', function () { v.pause(); salirFs(); });
    v.addEventListener('play', function () { if (alPrimerPlay) { alPrimerPlay(); alPrimerPlay = null; } });
    medirVsl(v);
  }
  var vid = ventanaVsl.querySelector('video');
  if (vid.getAttribute('src') !== src) { vid.src = src; if (poster) vid.poster = poster; }
  ventanaVsl.showModal();
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
  // Vídeos pequeños (página de gracias): se abren en grande con su reproductor.
  if (p.classList.contains('small')) {
    b.addEventListener('click', function () {
      var t = p.closest('.vid'); var h = t && t.querySelector('h3');
      abrirGrande(src, poster, h ? h.textContent : 'Vídeo');
    });
    return;
  }
  // VSL: en el móvil se abre en grande; en el ordenador se ve en la página. Sin barra de avance.
  // Píxel: ViewContent la primera vez que le dan al play.
  var vistaVsl = function () {
    if (p.dataset.vc) return;
    p.dataset.vc = '1';
    if (window.fbq) fbq('track', 'ViewContent', { content_name: 'VSL Agent Marketing OS' });
  };
  if (p.id === 'vsl') {
    v.preload = 'metadata';
    var esMovil = window.matchMedia('(max-width: 768px)');
    b.addEventListener('click', function () {
      if (esMovil.matches) { if (!v.paused) v.pause(); abrirVsl(src, poster, vistaVsl); return; }
      if (v.paused) { v.play(); } else { v.pause(); }
    });
    v.addEventListener('play', vistaVsl);
    medirVsl(v);
  } else {
    b.addEventListener('click', function () {
      if (v.paused) { v.play(); } else { v.pause(); }
    });
  }
  v.addEventListener('play', function () { p.classList.add('playing'); b.setAttribute('aria-label', 'Pausar el vídeo'); });
  v.addEventListener('pause', function () { p.classList.remove('playing'); b.setAttribute('aria-label', 'Reproducir el vídeo'); });
  v.addEventListener('ended', function () { p.classList.remove('playing'); });
});
