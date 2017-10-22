(function () {
    'use strict';
    var cacheName = 'SE1PWA';
    var dataCacheName = 'v1';

    var filesToCache = [
        '/',
        'ccm.se1-menu.js',
        'ccm.nav-hamburger.js',
        'resources/style.css',
        'ccm.min.js',
        'http://kaul.inf.h-brs.de/data/2017/se1/le00.html',
        'http://kaul.inf.h-brs.de/data/2017/se1/le01.html',
        'http://kaul.inf.h-brs.de/data/ccm/form/ccm.form.js',
        'http://kaul.inf.h-brs.de/data/ccm/upload/ccm.upload.js',
        'http://kaul.inf.h-brs.de/data/ccm/highlight/ccm.highlight.js',
        'http://kaul.inf.h-brs.de/data/ccm/show_solutions/ccm.show_solutions.js',
        'http://kaul.inf.h-brs.de/data/ccm/exercise/ccm.exercise.js',
        'http://kaul.inf.h-brs.de/data/ccm/form/resources/default.css',
        'https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js',
        'https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js',
        'http://kaul.inf.h-brs.de/data/2017/se1/json/log_configs.js',
        'https://akless.github.io/ccm-components/libs/md5/md5.min.js'
    ];
    self.addEventListener('fetch', function(event) {
        event.respondWith(
            caches.open(cacheName).then(function(cache) {
                return cache.match(event.request).then(function(response) {
                    var fetchPromise = fetch(event.request).then(function(networkResponse) {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    })
                    return response || fetchPromise;
                })
            })
        );
    });

    self.addEventListener('install', function(e) {
        console.log('[ServiceWorker] Install');
        e.waitUntil(
            caches.open(cacheName).then(function(cache) {
                console.log('[ServiceWorker] Caching app shell');
                return cache.addAll(filesToCache);
            })
        );
    });
    self.addEventListener('activate', function(e) {
        console.log('[ServiceWorker] Activate');
        e.waitUntil(
            caches.keys().then(function(keyList) {
                return Promise.all(keyList.map(function(key) {
                    if (key !== cacheName && key !== dataCacheName) {
                        console.log('[ServiceWorker] Removing old cache', key);
                        return caches.delete(key);
                    }
                }));
            })
        );
        return self.clients.claim();
    });
}());