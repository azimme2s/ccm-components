(function () {
    'use strict';

    var cacheName;
    var dataCacheName = "v1";
    var filesToCache;

    self.addEventListener('message',function(event) {
        console.log(event.data);
    });
    self.addEventListener('fetch', function (event) {
        event.respondWith(
            caches.open(cacheName).then(function (cache) {
                return cache.match(event.request).then(function (response) {
                    var fetchPromise = fetch(event.request).then(function (networkResponse) {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                    return response || fetchPromise;
                })
            })
        );
    });

    self.addEventListener('install', function (e) {
        console.log('[ServiceWorker] Install');
        e.waitUntil(
            /*caches.open(cacheName).then(function (cache) {
                console.log('[ServiceWorker] Caching app shell');
                return cache.addAll(filesToCache);
            })*/
            self.skipWaiting()
        );
    });
    self.addEventListener('activate', function (e) {
        console.log('[ServiceWorker] Activate');
        e.waitUntil(
            /*caches.keys().then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    if (key !== cacheName && key !== dataCacheName) {
                        console.log('[ServiceWorker] Removing old cache', key);
                        return caches.delete(key);
                    }
                }));
            })*/
        self.clients.claim()
        );
        //return e.waitUntil(self.clients.claim());
    });

}());