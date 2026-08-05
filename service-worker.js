const CACHE = 'plan90-v0.2-montse-movilidad';
const ASSETS = [
  './?v=021',
  'index.html',
  'styles-base.css?v=021',
  'styles-components.css?v=021',
  'mobile-fullwidth-v013.css?v=021',
  'mobile-scale-v014.css?v=021',
  'app-data.js?v=021',
  'app-main.js?v=021',
  'manifest.json?v=021',
  'icons/icon.svg',
  'assets/exercises/chair.png', 'assets/exercises/wall.png', 'assets/exercises/bridge.png',
  'assets/exercises/lunge.png', 'assets/exercises/bird.png', 'assets/exercises/plank.png', 'assets/exercises/calf.png'
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
  if (request.mode === 'navigate' || ['style','script','manifest'].includes(request.destination)) {
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(request, copy));
      return response;
    }).catch(() => caches.match(request).then(cached => cached || caches.match('./?v=021'))));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
