const CACHE_NAME = 'dada-calendar-shell-v1';
const SHELL_FILES = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(SHELL_FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  const url = event.request.url;
  const isShellFile = SHELL_FILES.some(function(f) {
    return url.endsWith(f.replace('./', ''));
  });

  if (isShellFile) {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        return cached || fetch(event.request);
      })
    );
  }
  // Anything else (the calendar iframe content itself) always goes to the network
  // so the calendar data is never stale.
});
