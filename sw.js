const CACHE_NAME = 'snake-cache-v1';
const urlsToCache = [
  '/',                 // index.html
  '/index.html',
  '/music/menu.mp3',   // фоновая музыка
  '/sounds/apple.wav', // звук яблока
  '/sw.js'
];

// Установка SW и кеширование всех файлов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Активация SW
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Перехват запросов: отдаём из кеша или с сервера
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          // Кешируем новые файлы динамически
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // Если нет сети и файла в кеше, можно вернуть оффлайн-страницу (по желанию)
          // return caches.match('/offline.html');
        });
    })
  );
});
