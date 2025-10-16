const CACHE_NAME = 'turnos-cache-v2';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './favicon.png',

    './icons/icon-192x192.png',
    './icons/icon-512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

/**
 * Se activa cada vez que la aplicación intenta hacer una petición de red.
 */
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // Si la petición es para un sitio diferente al nuestro (como googleapis.com),
    // no hacemos nada y dejamos que el navegador la gestione normalmente.
    if (requestUrl.origin !== location.origin) {
        return;
    }

    // Si la petición es para nuestros propios archivos, usamos la estrategia de "cache primero".
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si encontramos el archivo en la caché, lo devolvemos. Si no, vamos a la red.
                return response || fetch(event.request);
            })
    );
});