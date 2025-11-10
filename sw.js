const CACHE_NAME = 'snake-cache-v1';
const urlsToCache = [
  './',                 // index.html
  './index.html',
  './music/menu.mp3',
  './sounds/apple.wav',
  './sw.js'
];


// Установка SW
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Активация SW
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// Перехват fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // Можно вернуть оффлайн-страницу, если нужно
      });
    })
  );
});
