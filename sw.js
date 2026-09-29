// Minimal service worker — enough to satisfy PWA installability
// requirements (Chrome/Android in particular checks for a registered
// service worker before offering "Add to Home Screen"). This caches
// the app shell so it loads instantly on repeat visits, but doesn't
// attempt full offline support for the live Stripe checkout flow,
// which genuinely needs a network connection.

const CACHE_NAME = "omni-work-v1";
const APP_SHELL = ["/", "/index.html", "/manifest.json", "/icon-192.png", "/icon-512.png", "/icon-192-maskable.png", "/icon-512-maskable.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
