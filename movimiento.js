// Movimiento de la página del VSL. Si este archivo falla, todo se ve igual (sin animar).
(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');
  if (!('IntersectionObserver' in window)) return;

  // Bloques que suben y se enfocan al entrar en pantalla (una sola vez).
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting && e.boundingClientRect.top > 0) return;
      e.target.classList.add('on');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.rv').forEach(function (r) {
    if (r.getBoundingClientRect().top < window.innerHeight) { r.classList.add('on'); return; }
    io.observe(r);
  });

  // Botón fijo: aparece al pasar el botón de arriba y se esconde cuando se ve el calendario o el cierre.
  var bar = document.getElementById('sticky-cta');
  var hero = document.getElementById('cta-hero') || document.querySelector('.video-wrap');
  var zonas = [document.querySelector('.calendar'), document.querySelector('.final')].filter(Boolean);
  if (!bar || !hero) return;
  var pasado = false, tapado = new Set();
  function pinta() {
    var ver = pasado && tapado.size === 0;
    bar.classList.toggle('show', ver);
    bar.setAttribute('aria-hidden', ver ? 'false' : 'true');
    bar.tabIndex = ver ? 0 : -1;
  }
  new IntersectionObserver(function (es) {
    es.forEach(function (e) { pasado = !e.isIntersecting && e.boundingClientRect.top < 0; });
    pinta();
  }).observe(hero);
  var oz = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) tapado.add(e.target); else tapado.delete(e.target); });
    pinta();
  });
  zonas.forEach(function (z) { oz.observe(z); });
})();
