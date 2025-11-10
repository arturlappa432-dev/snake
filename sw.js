const CACHE_NAME = 'snake-cache-v1';
const FILES_TO_CACHE = [
  '/',                     // index.html
  '/index.html',           // сам HTML
  '/music/menu.mp3',       // музыка
  '/sounds/apple.wav',     // звук яблока
  // Если появятся ещё ресурсы (картинки, шрифты и т.д.), добавляй сюда
];

// Установка Service Worker и кеширование файлов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => 
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Перехват запросов и отдача из кэша, если нет сети
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
  );
});
