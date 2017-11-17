(function () {
    'use strict';
    var cacheName = 'SE1PWA';
    var dataCacheName = 'v1';

    var filesToCache = [
        './',
    ];
    self.addEventListener('fetch', function (event) {
        event.respondWith(
            caches.match(event.request)
                .then(function (response) {
                        if (response) {
                            console.log(
                                '[fetch] Returning from ServiceWorker cache: ',
                                event.request.url
                            );
                            return fromCache(event.request);
                        }
                        console.log('[fetch] Returning from server: ', event.request.url);
                        return fromNetwork(event.request, 200);
                    }
                )
        );
    });

    self.addEventListener('install', function (e) {
        console.log('[ServiceWorker] Install');
        e.waitUntil(
            caches.open(cacheName).then(function (cache) {
                console.log('[ServiceWorker] Caching app shell');
                return cache.addAll(filesToCache);
            })
        );
    });
    self.addEventListener('activate', function (e) {
        console.log('[ServiceWorker] Activate');
        e.waitUntil(
            caches.keys().then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    if (key !== cacheName && key !== dataCacheName) {
                        console.log('[ServiceWorker] Removing old cache', key);
                        return caches.delete(key);
                    }
                }));
            })
        );
        return self.clients.claim();
    });

    function fromNetwork(request, timeout) {
        return new Promise(function (fulfill, reject) {
            var timeoutId = setTimeout(reject, timeout);
            fetch(request).then(function (response) {
                clearTimeout(timeoutId);
                fulfill(response);
            }, reject);
        });
    }

    function fromCache(request) {
        return caches.open(cacheName).then(function (cache) {
            return cache.match(request).then(function (matching) {
                return matching || Promise.reject('no-match');
            });
        });
    }
}());