// Version: 3.1.5
// ==========================================

const CACHE_NAME = 'edge-ai-hub-v3.1.5';

const PRECACHE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icons/icon.svg',
    // CSS Modular Files
    './css/base.css',
    './css/menu.css',
    './css/learning.css',
    './css/simulator.css',
    './css/practice.css',
    './css/profile.css',
    './css/cheatsheet.css',
    './css/interview.css',
    './css/notebook.css',
    './css/projects.css',
    './css/hexmem.css',
    './css/auth.css',
    './css/search.css',
    './css/analytics.css',
    './css/audio.css',
    // JS Modular Files
    './js/auth.js',
    './js/state.js',
    './js/quotes.js',
    './js/practice.js',
    './js/decision.js',
    './js/roadmap.js',
    './js/simulator.js',
    './js/serial-monitor.js',
    './js/profile.js',
    './js/pomodoro.js',
    './js/backup.js',
    './js/cheatsheet.js',
    './js/interview.js',
    './js/notebook.js',
    './js/projects.js',
    './js/hexmem.js',
    './js/search.js',
    './js/analytics.js',
    './js/audio.js',
    './js/app.js'
];

// --- Install Event: Pre-cache Core Assets ---
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS).catch((err) => {
                console.warn('[SW] Precache asset fetch failure:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

// --- Activate Event: Cleanup Old Caches ---
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// --- Fetch Event: Smart Cache Strategy ---
self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Chỉ cache GET requests
    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    // 1. Navigation requests (HTML pages): Network first, fallback to Cache
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
                    }
                    return networkResponse;
                })
                .catch(async () => {
                    const cachedResponse = await caches.match(request);
                    if (cachedResponse) return cachedResponse;
                    return caches.match('./index.html');
                })
        );
        return;
    }

    // 2. Code Assets (JS, CSS): Network first, fallback to Cache (đảm bảo code luôn mới nhất)
    const isCodeAsset = url.pathname.endsWith('.js') || url.pathname.endsWith('.css');
    if (isCodeAsset) {
        event.respondWith(
            fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
                    }
                    return networkResponse;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // 3. Media & Static Assets (Fonts, Images, Audio, Icons): Cache First with Background Update (Stale-While-Revalidate)
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            const fetchPromise = fetch(request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
                    }
                    return networkResponse;
                })
                .catch(() => cachedResponse);

            return cachedResponse || fetchPromise;
        })
    );
});
