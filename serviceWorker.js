const CACHE_ELEMENTS = [
    "./",
    "https://unpkg.com/react@17/umd/react.production.min.js",
    "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
    "https://unpkg.com/@babel/standalone/babel.min.js",
    "./style.css",
    "./components/Contador.js"
];

const CACHE_NAME = "v1_cache_contador_react";


// Agrego los elementos del listado CACHE_ELEMENTS al navegador.
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            cache.addAll(CACHE_ELEMENTS)
            .then( () =>{
                self.skipWaiting();
            })
            .catch(console.log)
        })
    );
});

// Reviso si hay un cache mas nuevo y elimino el anterior.
self.addEventListener("activate", (e) => {

    const cacheWhiteList = [CACHE_NAME];

    e.waitUntil(
        caches
        .keys()
        .then( (cacheNames) => {
            return Promise.all(cacheNames.map(cacheName => {
                return (
                    cacheWhiteList.indexOf(cacheName) === -1 && caches.delete(cacheName)
                );
            }));
        })
        .then( () => self.clients.claim())
    );
});

// Busca nuevas versiones de los archivos.
self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => {
            if (res) {
                return res;
            }
            return fetch(e.request);
        })
    );
});