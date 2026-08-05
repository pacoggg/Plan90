const CACHE = 'plan90-v0.2-exercise-cards';
const ASSETS = [
  './?v=020',
  'index.html',
  'styles-base.css?v=020',
  'styles-components.css?v=020',
  'mobile-fullwidth-v013.css?v=020',
  'mobile-scale-v014.css?v=020',
  'app-data.js?v=020',
  'app-main.js?v=020',
  'manifest.json?v=020',
  'icons/icon.svg'
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
    }).catch(() => caches.match(request).then(cached => cached || caches.match('./?v=020'))));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
