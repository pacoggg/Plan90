const CACHE = 'plan90-v2-menu-variety';
const ASSETS = [
  './?v=101',
  'index.html',
  'styles-base.css?v=101',
  'styles-components.css?v=101',
  'mobile-fullwidth-v013.css?v=101',
  'mobile-scale-v014.css?v=101',
  'app-data.js?v=101',
  'menu-variety.js?v=101',
  'app-main.js?v=101',
  'dashboard-time-v023.js?v=101',
  'manifest.json?v=101',
  'icons/icon.svg',
  'assets/exercises/chair.png', 'assets/exercises/wall.png', 'assets/exercises/bridge.png',
  'assets/exercises/lunge.png', 'assets/exercises/bird.png', 'assets/exercises/plank.png', 'assets/exercises/calf.png',
  'assets/exercises/breathing.png', 'assets/exercises/pelvic-tilt.png', 'assets/exercises/cat-camel.png', 'assets/exercises/chin-tuck.png', 'assets/exercises/neck-turn.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  if (new URL(request.url).pathname.startsWith('/api/')) return;
  if (request.mode === 'navigate' || ['style','script','manifest'].includes(request.destination)) {
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, copy));
      return response;
    }).catch(() => caches.match(request).then(cached => cached || caches.match('./?v=101'))));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
