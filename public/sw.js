const CACHE_NAME = 'root-cache-v1';
const OFFLINE_URL = '/offline';

const PRECACHE_ASSETS = [
  '/',
  OFFLINE_URL,
  '/manifest.json',
  '/icons/icon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/favicon.ico',
];

// Install: precache app shell & offline fallback
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: purge stale caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME) {
              return caches.delete(name);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: Strategy dispatch
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin and chrome-extension requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // 1. Navigation requests (HTML pages): Network-first with cache & offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return the dedicated offline page
          const offlinePage = await caches.match(OFFLINE_URL);
          if (offlinePage) {
            return offlinePage;
          }
          return new Response(
            '<h1>Root Advisory – Offline</h1><p>You are currently offline. Please reconnect to access this page.</p>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // 2. Static assets (_next/static, icons, images, fonts): Cache-first with stale-while-revalidate
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Revalidate in background
          fetch(request)
            .then((res) => {
              if (res.ok) {
                caches.open(CACHE_NAME).then((cache) => cache.put(request, res));
              }
            })
            .catch(() => {});
          return cached;
        }
        return fetch(request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // 3. API requests: Let them pass to network (offline queue handles offline data in IndexedDB)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(
        () =>
          new Response(
            JSON.stringify({
              error: 'Offline',
              offline: true,
              message: 'Device is offline. Request queued for sync.',
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' },
            }
          )
      )
    );
    return;
  }

  // Default: Network with cache fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// Support manual skip-waiting trigger
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
