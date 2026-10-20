const CACHE_NAME = 'pocketpetal-v1';

const FILES = [
  './',
  './index.html',
  './tests.html',
  './seed.json',
  './styles/main.css',
  './scripts/main.js',
  './scripts/state.js',
  './scripts/storage.js',
  './scripts/ui.js',
  './scripts/search.js',
  './scripts/validators.js',
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      const oldCaches = [];
      for (const name of names) {
        if (name !== CACHE_NAME) {
          oldCaches.push(caches.delete(name));
        }
      }
      return Promise.all(oldCaches);
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') {
    return;
  }
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, copy);
        });
        return response;
      })
      .catch(function () {
        return caches.match(event.request, { ignoreSearch: true }).then(function (cached) {
          if (cached) {
            return cached;
          }
          return caches.match('./index.html');
        });
      })
  );
});