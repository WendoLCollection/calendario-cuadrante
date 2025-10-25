// Definimos el nombre y la versión de nuestro "almacén" (caché).
// ¡IMPORTANTE! Cada vez que subas una actualización, cambia este número (ej: v3, v4...).
const CACHE_NAME = 'turnos-cache-v1';

// Lista de los archivos fundamentales de nuestra aplicación.
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './manifest.json',
    './favicon.png',
    './logo.png', // Asegúrate de que este es el nombre correcto de tu logo.
    './icons/icon-192x192.png',
    './icons/icon-512x512.png'
];

// --- FASE DE INSTALACIÓN ---
// Se ejecuta cuando el navegador descarga un nuevo Service Worker.
self.addEventListener('install', event => {
    // Orden para que el nuevo Service Worker se active inmediatamente sin esperar.
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierta. Guardando archivos...');
                return cache.addAll(urlsToCache);
            })
    );
});

// --- FASE DE ACTIVACIÓN ---
// Se ejecuta cuando el nuevo Service Worker toma el control.
self.addEventListener('activate', event => {
    event.waitUntil(
        // Buscamos todos los "almacenes" (cachés) que no coincidan con el nombre de la nueva versión.
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        // Si encontramos un almacén viejo, lo borramos.
                        console.log('Borrando caché antigua:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// --- FASE DE INTERCEPTACIÓN (FETCH) ---
// Se ejecuta cada vez que la aplicación intenta hacer una petición de red.
self.addEventListener('fetch', event => {
    const requestUrl = new URL(event.request.url);

    // Si la petición es para un sitio diferente (como Firebase), la ignoramos.
    if (requestUrl.origin !== location.origin) {
        return;
    }

    // Si la petición es para nuestros propios archivos, usamos la estrategia de "caché primero".
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si encontramos el archivo en la caché, lo devolvemos. Si no, vamos a la red.
                return response || fetch(event.request);
            })
    );
});