const CACHE = 'plan90-v0.1.3-clean';
const ASSETS = [
  './?v=013',
  'index.html',
  'styles-base.css?v=013',
  'styles-components.css?v=013',
  'mobile-fullwidth-v013.css',
  'app-data.js?v=013',
  'app-main.js?v=013',
  'manifest.json?v=013',
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

  if (request.mode === 'navigate' || ['style', 'script', 'manifest'].includes(request.destination)) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match('./?v=013')))
    );
    return;
  }

  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});
