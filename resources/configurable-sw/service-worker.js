!function(){"use strict";self.addEventListener("message",function(e){console.log(e.data)}),self.addEventListener("fetch",function(e){e.respondWith(caches.open(void 0).then(function(t){return t.match(e.request).then(function(n){var i=fetch(e.request).then(function(n){return t.put(e.request,n.clone()),n});return n||i})}))}),self.addEventListener("install",function(e){console.log("[ServiceWorker] Install"),e.waitUntil(self.skipWaiting())}),self.addEventListener("activate",function(e){console.log("[ServiceWorker] Activate"),e.waitUntil(self.clients.claim())})}();