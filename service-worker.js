(function () {
    'use strict';
    let cacheName = 'SE1PWA';

    let filesToCache = [
        './',
        './ccm.se1-menu.js',
        './ccm.nav-hamburger.js',
        './resources/style.css',
        'http://kaul.inf.h-brs.de/data/2017/se1/le00.html',
        'http://kaul.inf.h-brs.de/data/2017/se1/le01.html',
        'http://kaul.inf.h-brs.de/data/2017/se1/le02.html',
        'http://kaul.inf.h-brs.de/data/2017/se1/le03.html',
        'http://kaul.inf.h-brs.de/data/2017/se1/le04.html',
        'http://kaul.inf.h-brs.de/data/2017/se1/le05.html',
        'http://kaul.inf.h-brs.de/data/2017/se1/le06.html',
        'http://kaul.inf.h-brs.de/data/2017/se1/le07.html',
        /*'http://kaul.inf.h-brs.de/data/2017/se1/le08.html',
        'http://kaul.inf.h-brs.de/data/2017/se1/le09.html',
        'http://kaul.inf.h-brs.de/data/2017/se1/le10.html',
        'http://kaul.inf.h-brs.de/data/2017/se1/le11.html',
        'http://kaul.inf.h-brs.de/data/2017/se1/le12.html',
        'http://kaul.inf.h-brs.de/data/2017/se1/le13.html',*/
        'http://kaul.inf.h-brs.de/data/ccm/form/ccm.form.js',
        'http://kaul.inf.h-brs.de/data/ccm/upload/ccm.upload.js',
        'http://kaul.inf.h-brs.de/data/ccm/highlight/ccm.highlight.js',
        'http://kaul.inf.h-brs.de/data/ccm/show_solutions/ccm.show_solutions.js',
        'http://kaul.inf.h-brs.de/data/ccm/exercise/ccm.exercise.js',
        'http://kaul.inf.h-brs.de/data/ccm/form/resources/default.css',
        'https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js',
        'https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js',
        'https://akless.github.io/ccm-components/content/versions/ccm.content-2.0.0.min.js',
        'https://akless.github.io/ccm/ccm.js',
        'http://kaul.inf.h-brs.de/data/2017/se1/json/log_configs.js',
        'https://akless.github.io/ccm-components/libs/md5/md5.min.js'
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
                    if (key !== cacheName ) {
                        console.log('[ServiceWorker] Removing old cache', key);
                        self.postMessage('[ServiceWorker] Removing old cache', key);
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