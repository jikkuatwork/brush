// sw.js
const CACHE_NAME = 'brush-cache-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/src/style.css',
    '/src/main.js',
    '/public/meta/manifest.json',
    '/public/meta/favicon-16x16.png',
    '/public/meta/favicon-32x32.png',
    '/public/meta/android-chrome-192x192.png',
    '/public/meta/android-chrome-512x512.png',
    '/public/meta/apple-touch-icon.png',
    '/public/meta/logo.svg',
    'https://code.jquery.com/jquery-3.7.1.min.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            })
        ))
    );
});

// Add to index.html (in the script section before closing body tag):
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registered:', registration);
        }).catch(error => {
            console.log('ServiceWorker registration failed:', error);
        });
    });
}