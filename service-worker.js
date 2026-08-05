const CACHE = 'plan90-v0.1.4-scale';
const ASSETS = [
  './?v=014',
  'index.html',
  'styles-base.css?v=014',
  'styles-components.css?v=014',
  'mobile-fullwidth-v013.css?v=014',
  'mobile-scale-v014.css',
  'app-data.js?v=014',
  'app-main.js?v=014',
  'manifest.json?v=014',
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
    }).catch(() => caches.match(request).then(cached => cached || caches.match('./?v=014'))));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
