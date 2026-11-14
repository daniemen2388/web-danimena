// Píxel de Meta «P. DaniMen [1]» (portfolio de la marca personal).
// PageView en todas las páginas. En /gracias (se llega tras reservar la llamada): Lead y Schedule.
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2039022273582697');
fbq('track', 'PageView');
if (location.pathname.indexOf('/gracias') === 0) {
  fbq('track', 'Lead');
  fbq('track', 'Schedule');
}
