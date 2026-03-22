// Service Worker para El Códice Secreto de Segovia
const CACHE_NAME = 'codice-segovia-v1';
const urlsToCache = [
    '/Codice-Segovia/',
    '/Codice-Segovia/index.html',
    '/Codice-Segovia/instrucciones.html',
    '/Codice-Segovia/styles.css',
    '/Codice-Segovia/icon-192.png',
    '/Codice-Segovia/icon-512.png'
];

// Instalación del Service Worker - cachea los archivos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch - sirve los archivos desde el caché si están disponibles
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si el archivo está en caché, lo devuelve
                if (response) {
                    return response;
                }
                // Si no, lo busca en la red
                return fetch(event.request);
            })
    );
});

// Activación - limpia cachés antiguas
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Eliminando caché antigua:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
