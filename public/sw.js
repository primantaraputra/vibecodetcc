/**
 * Service Worker SI-BANSOS Kecamatan
 * Mendukung instalasi PWA dan mode semi-offline untuk pengisian survei lapangan
 */

const CACHE_NAME = 'sibansos-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/cek-status',
  '/simulasi',
  '/survei',
  '/pengaduan',
  '/peta-transparansi',
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Caching static assets encountered an issue:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event (Network First with Cache Fallback for HTML pages, Cache First for Static Assets)
self.addEventListener('fetch', (event) => {
  // Hanya intercept GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Jangan intercept API routes atau Supabase Auth
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/auth')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback if root offline
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
      })
  );
});
