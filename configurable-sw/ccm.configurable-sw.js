(function (){
    var component = {
        name: "configurable-sw",
        ccm: "https://akless.github.io/ccm/ccm.js",
        config: {
            id: 1,
            cacheArray: [],
            cacheName: "test Cache",
            rules:[]
        },
        Instance: function(){
            this.start = function (callback) {
                if("serviceWorker" in navigator){
                    navigator.serviceWorker.register('service-worker.js')
                        .then(function(){
                            console.log("SW is registered");
                        });
                } else {
                    console.log("No support for sw");
                }
                navigator.serviceWorker.ready.then(function (registration){
                    console.log('A service worker is active:', registration.active);
                    if (navigator.serviceWorker.controller) {

                        navigator.serviceWorker.controller.postMessage({
                            "command": "oneWayCommunication",
                            "message": "Hi, SW"
                        });
                    } else {
                        console.log("No ServiceWorker controller");
                    }
                });
                if(callback) callback();
            };
        }
    };
        function p(){
        window.ccm[v].component(component);
    }
    var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}

})();