(function () {
    var component = {
        name: "delete-pwa-button",
        ccm: "https://akless.github.io/ccm/ccm.js",
        config: {
            html: {
                footer: {
                    tag: 'footer',
                    class: 'footer',
                    inner: {
                        tag: 'button',
                        class: 'button',
                        id: 'delete-pwa-button',
                        inner: 'Delete PWA'
                    }
                },
                modal: {
                    tag: 'div',
                    id: 'myModal',
                    class: 'modal',
                    inner: {
                        tag: 'div',
                        class: 'modal-content',
                        inner: [{
                            tag: 'div',
                            class: 'modal-header',
                            inner: {
                                tag: 'span',
                                class: 'close',
                                inner: '&times;'
                            }
                        },
                            {
                                tag: 'div',
                                class: 'modal-body'
                            },
                            {
                                tag: 'div',
                                class: 'modal-footer'
                            }
                        ]
                    }
                }
            },
        },
        Instance: function () {
            let self = this;
            let my;

            this.ready = function (callback) {
                my = self.ccm.helper.privatize(self);
                if (callback) callback();
            };
            this.start = function (callback) {
                this.buildView();
                self.element.querySelector('#delete-pwa-button').addEventListener('click', self.deleteNotifaction);
                if (callback) callback();
            };
            this.buildView = function () {
                let footer = self.ccm.helper.html(my.html.footer);
                self.element.appendChild(footer);
                let modal = self.ccm.helper.html(my.html.modal);
                self.element.appendChild(modal);
            };
            this.deleteNotifaction = function () {
                Notification.requestPermission().then(function (premission) {
                    if(premission === "granted"){
                        navigator.serviceWorker.ready.then(function(registration) {
                            registration.showNotification("App Löschen", {
                                body: "Soll der Cache der app "+self.appcachename+" gelöscht werden?",
                                tag: "delete-pwa",
                                actions: [
                                    {
                                        action: "deleteCache",
                                        title: "Ja",
                                    },
                                    {
                                        action: "confirm2",
                                        title: "Nein"
                                    }
                                ],
                                vibrate: [500,110,500,110,450,110,200,110,170,40,450,110,200,110,170,40,500],
                            });
                        });
                    }
                });
            };

            this.unregisterSW = function () {
                navigator.serviceWorker.getRegistration().then(function (registration) {
                    registration.unregister();
                });
            };
        }
    };

    function p() {
        window.ccm[v].component(component);
    }

    var f = "ccm." + component.name + (component.version ? "-" + component.version.join(".") : "") + ".js";
    if (window.ccm && null === window.ccm.files[f]) window.ccm.files[f] = component; else {
        var n = window.ccm && window.ccm.components[component.name];
        n && n.ccm && (component.ccm = n.ccm), "string" == typeof component.ccm && (component.ccm = {url: component.ccm});
        var v = component.ccm.url.split("/").pop().split("-");
        if (v.length > 1 ? (v = v[1].split("."), v.pop(), "min" === v[v.length - 1] && v.pop(), v = v.join(".")) : v = "latest", window.ccm && window.ccm[v]) p(); else {
            var e = document.createElement("script");
            document.head.appendChild(e), component.ccm.integrity && e.setAttribute("integrity", component.ccm.integrity), component.ccm.crossorigin && e.setAttribute("crossorigin", component.ccm.crossorigin), e.onload = function () {
                p(), document.head.removeChild(e)
            }, e.src = component.ccm.url
        }
    }

})();