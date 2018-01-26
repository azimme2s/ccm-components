
    /* --- IndexedDB configs */
    const DB_NAME = "newsFeed";
    const DB_VERSION = "2";
    const SEND_POST_STORE = "send-post-requests";
    const GET_POSTS_STORE = "get-posts-requests";
    let idb;
    /* --- Message tags --- */
    const MSG_FROM_PAGE_GET_POSTS = "get-posts";
    const MSG_FROM_PAGE_SEND_POST = "send-post";
    const MSG_TO_PAGE_GOT_POSTS = "got-posts";
    const MSG_TO_PAGE_POSTS_SENT = "posts-sent";
    const SYNC_SEND_POSTS = "send-posts";
    const SYNC_GET_POSTS = "get-posts";
    let CACHE_NAME = 'SE1PWA';

    let cache_urls = [
        'ccm.se1-menu.js',
        'ccm.nav-hamburger.js',
        'style.css',
        'ccm.sw-notification.js',
        'configs.js',
        'right.css',
        'feedback.png',
        'ccm.feedback.js',
        'ccm.news_feed.js',
        'https://kaul.inf.h-brs.de/data/2017/se1/le00.html',
        'https://kaul.inf.h-brs.de/data/2017/se1/le01.html',
        'https://kaul.inf.h-brs.de/data/2017/se1/le02.html',
        'https://kaul.inf.h-brs.de/data/2017/se1/le03.html',
        'https://kaul.inf.h-brs.de/data/2017/se1/le04.html',
        'https://kaul.inf.h-brs.de/data/2017/se1/le05.html',
        'https://kaul.inf.h-brs.de/data/2017/se1/le06.html',
        'https://kaul.inf.h-brs.de/data/2017/se1/le07.html',
        'https://kaul.inf.h-brs.de/data/2017/se1/le08.html',
        'https://kaul.inf.h-brs.de/data/2017/se1/le09.html',
        'https://kaul.inf.h-brs.de/data/2017/se1/le10.html',
        'https://kaul.inf.h-brs.de/data/2017/se1/le11.html',
        'https://kaul.inf.h-brs.de/data/2017/se1/le12.html',
        'https://kaul.inf.h-brs.de/data/2017/se1/le13.html',
        'https://akless.github.io/ccm/version/ccm-11.5.0.min.js',
        'https://tkless.github.io/ccm-components/lib/bootstrap/css/font-face.css',
        'https://tkless.github.io/ccm-components/lib/bootstrap/css/bootstrap.css',
        'https://kaul.inf.h-brs.de/data/ccm/form/ccm.form.js',
        'https://kaul.inf.h-brs.de/data/ccm/upload/ccm.upload.js',
        'https://kaul.inf.h-brs.de/data/ccm/highlight/ccm.highlight.js',
        'https://kaul.inf.h-brs.de/data/ccm/show_solutions/ccm.show_solutions.js',
        'https://kaul.inf.h-brs.de/data/ccm/exercise/ccm.exercise.js',
        'https://kaul.inf.h-brs.de/data/ccm/form/resources/default.css',
        'https://akless.github.io/ccm-components/user/versions/ccm.user-2.0.0.min.js',
        'https://akless.github.io/ccm-components/log/versions/ccm.log-1.0.0.min.js',
        'https://akless.github.io/ccm-components/content/versions/ccm.content-2.0.0.min.js',
        'https://akless.github.io/ccm/ccm.js',
        'https://kaul.inf.h-brs.de/data/2017/se1/json/log_configs.js',
        'https://akless.github.io/ccm-components/libs/md5/md5.min.js'
    ];
    self.addEventListener('fetch', function (event) {
        if(/https:\/\/kaul.inf.h-brs.de\/login\/login.php.*/.test(event.request.url.href)){
            return;
        }
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
                        return fromNetwork(event.request, 400);
                    }
                )
        );
        //event.waitUntil(update(event.request));
    });

    self.addEventListener('install', function (e) {
        console.log('[ServiceWorker] Install');
        e.waitUntil(
            caches.open(CACHE_NAME).then(function (cache) {
                console.log('[ServiceWorker] Caching app shell');
                return cache.addAll(cache_urls);
            })
        );
    });
    self.addEventListener('activate', event =>{
        event.waitUntil(
            Promise.all([
                caches.keys()
                    .then( (cacheNames) =>{
                        return Promise.all(
                            cacheNames.map( (cacheName) =>{
                                if(CACHE_NAME !== cacheName && cacheName.startsWith("SE1PWA"))
                                    return caches.delete(cacheName);
                            })
                        );
                    }),
                console.log('[ServiceWorker] is activated'),
                openDatabase("newsFeed", "2")
            ])
        );
    });

    self.addEventListener('sync', event =>{
        if(event.tag === SYNC_SEND_POSTS){
            event.waitUntil(
                objectStore(SEND_POST_STORE, 'readwrite')
                    .then( (objectStore) =>{
                        return getAllObjects(objectStore);
                    })
                    .then( (allObjects)=>{
                        return Promise.all( allObjects.map( (object) =>{
                            return fetch( object.url )
                                .then(function( networkResponse ){
                                    if( networkResponse.ok)
                                        return deleteObject(object.id, SEND_POST_STORE);
                                    else
                                        return new Error("Could not send post with id: "+object.id);
                                })
                                .catch( () =>{
                                    return new Error("Seems to be still offline.");
                                });
                        }));
                    })
                    .then( ()=>{
                        notifyPagesPostsSent();
                    })

            );
        }
        if(event.tag === SYNC_GET_POSTS){
            event.waitUntil(
                objectStore(GET_POSTS_STORE, "readwrite")
                    .then( (objectStore) =>{
                        return getAllObjects(objectStore);
                    })
                    .then( (allObjects)=>{
                        return Promise.all( allObjects.map( (object) =>{
                            return fetch(object.url)
                                .then( (response) =>{
                                    if( response.ok){
                                        deleteObject(object.id, GET_POSTS_STORE);
                                        return response.json();
                                    }
                                    else
                                        new Error("Could not perform get-posts-request with id:"+object.id);
                                })
                                .then( (posts) =>{
                                    notifyPagesGotPosts(posts);
                                })
                                .catch( () =>{
                                    return new Error("Seems to be still offline.");
                                });
                        }));
                    })
            );
        }
    });

    self.addEventListener('message', event =>{
        console.log("[SW-News-Feed] Message: ", event);
        switch(event.data.tag){
            case MSG_FROM_PAGE_SEND_POST:
                sendNewPost(event.data.url);
                break;
            case MSG_FROM_PAGE_GET_POSTS:
                getPosts(event.data.url);
                break;
            default:
                console.log("No handler in sw for event:", event);
        }
    });
    // Sends a new post object to a remote store
// If offline, stores post object and registers back-sync
    const sendNewPost = (url) =>{
        // 1. Try to send post object to remote store
        fetch(url)
            .then( (response) =>{
                // 2. If successfull, send message to client
                notifyPagesPostsSent();
            })
            .catch( () =>{
                // 3. If offline, store in IndexedDB
                objectStore(SEND_POST_STORE, "readwrite")
                    .then((objectStore)=>{
                        addObject(
                            objectStore,
                            {
                                "url":  url,
                                "id":   Math.floor((Math.random()*1000)+1)
                            }
                        );
                    })
                    .then(()=>{
                        // 4. Register back-sync
                        self.registration.sync.register(SYNC_SEND_POSTS);
                    })
                    .catch((error)=>{
                        console.log("Error: ", error);
                    });
            });
    };

// Gets all posts from remote store
// If offline, stores request and registers back-sync
    const getPosts = (url) =>{
        // 1. Try to send post object to remote store
        fetch(url)
            .then( (response) =>{
                return response.json();
            })
            .then( (posts) =>{
                // 2. If successfull, send message with data to client
                notifyPagesGotPosts(posts);
            })
            .catch( ()=>{
                // 3. If offline, store in IndexedDB
                objectStore(GET_POSTS_STORE, "readwrite")
                    .then((objectStore)=>{
                        addObject(
                            objectStore,
                            {
                                "url":  url,
                                "id":   Math.floor((Math.random()*1000)+1)
                            }
                        );
                    })
                    .then(()=>{
                        // 4. Register back-sync
                        self.registration.sync.register(SYNC_GET_POSTS);
                    })
                    .catch((error)=>{
                        console.log("Error: ", error);
                    });
            });
    };

    const notifyPagesPostsSent = () =>{
        self.clients.matchAll({includeUncontrolled: true}).then(function( clients ){
            clients.forEach(function( client ){
                client.postMessage(
                    {
                        "tag": MSG_TO_PAGE_POSTS_SENT,
                        "msg": "Post send"
                    }
                );
            });
        });
    };

    const notifyPagesGotPosts = (posts) =>{
        self.clients.matchAll({includeUncontrolled: true}).then(function( clients ){
            clients.forEach(function( client ){
                client.postMessage(
                    {
                        "tag": MSG_TO_PAGE_GOT_POSTS,
                        "posts": posts,
                        "msg": posts
                    }
                );
            });
        });
    };


    /* --- Database functions */
    /* Inspired from "Building Progressive Web Apps", Tal Ater */

    const openDatabase = function(dbName, dbVersion){
        return new Promise(( resolve, reject )=>{
            const request = self.indexedDB.open(dbName, dbVersion);
            request.onerror = function( event ){
                reject("Database error: " + event.target.error);
            };
            request.onupgradeneeded = function( event ){
                let db = event.target.result;
                db.createObjectStore(GET_POSTS_STORE, {keyPath: "id", autoIncrement: true});
                db.createObjectStore(SEND_POST_STORE, {keyPath: "id", autoIncrement: true});
                idb = db;
            };
            request.onsuccess = function( event ){
                idb = event.target.result;
                resolve( event.target.result);
            };
        });
    };

    const objectStore = function( storeName, transactionMode ){
        return new Promise((resolve, reject )=>{
            let objectStore = {};
            if(!idb){
                openDatabase(DB_NAME, DB_VERSION).then( ()=>{
                    objectStore = idb
                        .transaction(storeName, transactionMode)
                        .objectStore(storeName);
                });
            } else {
                objectStore = idb
                    .transaction(storeName, transactionMode)
                    .objectStore(storeName);
            }
            resolve(objectStore);
        });
    };

    const addObject = function( objectStore, object ){
        return new Promise(( resolve, reject)=>{
            const request = objectStore.add(object);
            request.onsuccess = resolve;
        });
    };

    const getAllObjects = function( objectStore ){
        return new Promise( function(resolve, reject){
            let request = objectStore.getAll();
            request.onsuccess = function( event ){
                resolve(event.target.result);
            };
            request.onerror = function( ){
                reject("Could not get all posts: "+request.error);
            };
        });
    };

    const deleteObject = function( key, objectStoreName ){
        return new Promise( (resolve, reject)=>{
            objectStore(objectStoreName, "readwrite").then(function( objectStore ){
                objectStore.delete(key).onsuccess = function( event ){
                    console.log("Delete successfull:", key);
                    resolve("Successfull delete key: "+ key);
                };
            });
        });
    };

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
        return caches.open(CACHE_NAME).then(function (cache) {
            return cache.match(request).then(function (matching) {
                return matching || Promise.reject('no-match');
            });
        });
    }

    function update(request) {
        return caches.open(CACHE_NAME).then(function (cache) {
            return fetch(request).then(function (response) {
                return cache.put(request, response);
            });
        });
    }
