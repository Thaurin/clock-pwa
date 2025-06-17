const CACHE_NAME = 'clock-pwa-v1.2';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js',
  '/Orbitron-VariableFont_wght.ttf',
  // add any other static assets like CSS/JS here if separate
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting()) // activate immediately
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    ).then(() => self.clients.claim()) // take control of clients immediately
  );
});

self.addEventListener('fetch', event => {
  // Serve from cache first, fallback to network
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
