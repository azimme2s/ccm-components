(function (){
    var component = {
        name: "delete-pwa-button",
        ccm: "https://akless.github.io/ccm/ccm.js",
        config: {
            html:{
                footer:{
                    tag: 'footer',
                    class: 'footer',
                    inner:{
                        tag: 'button',
                        class: 'button',
                        id: 'delete-pwa-button',
                        inner: 'Delete PWA'
                    }
                }
            }
        },
        Instance: function(){
            let self = this;
            let my;

            this.ready = function( callback ) {
                my = self.ccm.helper.privatize( self );
                if( callback ) callback();
            };
            this.start = function (callback) {
                this.buildView();
                self.element.querySelector('#delete-pwa-button').addEventListener('click', self.deletePWA);
                if(callback) callback();
            };
            this.buildView = function(){
                let footer = self.ccm.helper.html(my.html.footer);
                self.element.appendChild(footer);
            };
            this.deletePWA = function(){
                navigator.serviceWorker.getRegistration().then(function(registration) {
                    console.log(registration);
                    //magic where all the caches get Deleted, an by all, I mean really all caches!!!
                    caches.keys().then(keyList => keyList.map(key => caches.delete(key)));
                    //Unregsiter de Service Worker
                    registration.unregister();
                });
            }
        }
    };
    function p(){
        window.ccm[v].component(component);
    }
    var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}

})();