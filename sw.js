const CACHE_NAME = 'rota-cache-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cached) => {
        const fetchPromise = fetch(event.request)
          .then((networkResp) => {
            cache.put(event.request, networkResp.clone());
            return networkResp;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    )
  );
});
