// Version: 5.2.0 // Project Thai // Living Portfolio & Showcase HUD
// ==========================================

const CACHE_NAME = 'project-thai-showcase-v5.2.0';

const PRECACHE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icons/icon.svg',
    // CSS Modular Files
    './css/base.css',
    './css/dock.css',
    './css/galaxy.css',
    './css/projects.css',
    './css/portfolio-hud.css',
    './css/profile.css',
    './css/portfolio-admin.css',
    './css/quick-notes.css',
    './css/audio.css',
    './css/search.css',
    './notes.html',
    // JS Modular Files
    './js/portfolio-data.js',
    './js/portfolio-controller.js',
    './js/portfolio-grid.js',
    './js/cyber-tree3d.js',
    './js/serial-monitor.js',
    './js/portfolio-hud.js',
    './js/portfolio-admin.js',
    './js/profile.js',
    './js/quick-notes.js',
    './js/audio.js',
    './js/search.js',
    './js/app.js',
    // Three.js 3D WebGL Engine & OrbitControls
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
    'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js'
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
