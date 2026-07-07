const CACHE_NAME = 'fasten-timer-cache-v2';
const ASSETS = [
  './',
  'index.html',
  'style.css',
  'script.js',
  'favicon.ico',
  'manifest.json'
  'icon-128.png',
  'icon-256.png',
  'icon-512.png'
  'screenshot-mobile.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
          if (event.request.mode === 'navigate') {
              return caches.match('index.html');
          }
      });
    })
  );
});