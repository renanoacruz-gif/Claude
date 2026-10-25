/* ============================================================
   LocaRetorno — Service Worker (PWA offline)
   Cache-first para o shell do app: funciona sem internet.
   ============================================================ */
const CACHE = 'locaretorno-v1';
const SHELL = [
  './',
  './index.html',
  './css/app.css',
  './js/store.js',
  './js/ui.js',
  './js/app.js',
  './manifest.webmanifest'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request)
        .then((resp) => {
          // cacheia recursos mesmos quando online (auto-população)
          try {
            const copy = resp.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          } catch (err) {}
          return resp;
        })
        .catch(() => caches.match('./index.html')); // fallback SPA offline
    })
  );
});
