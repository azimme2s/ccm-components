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
            css: ['ccm.load', './style.css'],
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
                self.element.querySelector('#delete-pwa-button').addEventListener('click', self.createModalDialog);
                if (callback) callback();
            };
            this.buildView = function () {
                let footer = self.ccm.helper.html(my.html.footer);
                self.element.appendChild(footer);
                let modal = self.ccm.helper.html(my.html.modal);
                self.element.appendChild(modal);
            };
            this.createModalDialog = function () {
                let myModal = self.element.querySelector('#myModal');
                myModal.style.display = 'block';
                let span = self.element.querySelector('.close');
                span.onclick = function () {
                    myModal.style.display = "none";
                };
                window.onclick = function () {
                    if (event.target === myModal) {
                        myModal.style.display = "none";
                    }
                };

                let modalHeader = self.element.querySelector('.modal-header');
                let h3 = document.createElement("h3");
                h3.innerHTML = 'Zu löschende Caches';
                modalHeader.appendChild(h3);

                caches.keys().then(keyList => keyList.map(item => {
                    let checkBox = document.createElement('input');
                    checkBox.setAttribute('type', 'checkbox');
                    checkBox.innerHTML = item;
                    console.log(checkBox);
                    self.element.querySelector('.modal-body').appendChild(checkBox);
                }));

                let modalFooter = self.element.querySelector('.modal-footer');
                let deleteBTN = document.createElement('button');
                deleteBTN.innerHTML = "Bestätigen";
                deleteBTN.addEventListener("click",self.deleteChoosenOne());
                modalFooter.appendChild(deleteBTN);
            };
            this.deleteChoosenOne = function () {
                let allInputs = self.element.querySelectorAll('input');
                console.log(allInputs);
                //let choosen = allInputs.map(item => item.getAttribute('checked'));

                navigator.serviceWorker.getRegistration().then(function (registration) {
                    console.log(registration);
                    //choosen.map(i => caches.delete(i));
                    //Unregsiter de Service Worker
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