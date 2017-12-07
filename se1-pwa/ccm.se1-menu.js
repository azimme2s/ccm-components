/*
* The MIT License
*
* Copyright 2017 Artur Zimmermann <artur.zimmermann at outlook.de>.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

/* global ccm */

(function () {
    var component = {
        name: 'se1-menu',
        ccm: 'https://akless.github.io/ccm/ccm.js',
        config: {
            'html': {
                'main': {
                    'inner': [
                        {'tag': 'div', 'class': 'nav'},
                        {'tag': 'div', 'class': 'content'}
                    ]
                }
            },
            'root_node': ['ccm.load','https://moritzkemp.github.io/ccm-route_node/ccm.route_node.js'],
            'navhamburger': ['ccm.component', 'ccm.nav-hamburger.js'],
            'content': ['ccm.component', 'https://akless.github.io/ccm-components/content/versions/ccm.content-2.0.0.min.js'],
            'css': ['ccm.load', 'style.css'],
            'inner': []
        },
        Instance: function () {
            let self = this;
            let my;

            this.ready = function (callback) {
                my = self.ccm.helper.privatize(self);
                if (callback) callback();
            };
            this.start = function (callback) {
                var main_elem = self.ccm.helper.html(my.html.main);
                self.element.appendChild(main_elem);
                self.ccm.start(my.root_node, {'isRoot': true,'patterns':['/home']}, instance => {
                    self.nav_tabs = instance;
                    instance.addObserver();
                });
                self.buildNav();
                if (callback) callback();
            };
            this.buildNav = function () {
                var content = my.content;
                var leCounter = 0;
                var domContent = self.element.querySelector('.content');
                var navInner = my.inner.map(function (element) {
                    leCounter++;
                    return {
                        'text': 'Software Engineering LE ' + leCounter,
                        'action': function () {
                            content.start({root: domContent, inner: ['ccm.load', element]}, function (instance) {
                                    console.log(instance);
                                }
                            );
                        }
                    }
                });

                this.ccm.start(my.navhamburger, {
                    root: self.element.querySelector('.nav'),
                    "section": navInner
                });
            }
        }
    };

    function p() {
        window.ccm[v].component(component);
    }

    var f = "ccm." + component.name + (component.version ? "-" + component.version.join(".") : "") + ".js";
    if (window.ccm && null === window.ccm.files[f]) window.ccm.files[f] = component; else {
        var n = window.ccm && window.ccm.components[component.name];
        n && n.ccm && (component.ccm = n.ccm), "string" === typeof component.ccm && (component.ccm = {url: component.ccm});
        var v = component.ccm.url.split("/").pop().split("-");
        if (v.length > 1 ? (v = v[1].split("."), v.pop(), "min" === v[v.length - 1] && v.pop(), v = v.join(".")) : v = "latest", window.ccm && window.ccm[v]) p(); else {
            var e = document.createElement("script");
            document.head.appendChild(e), component.ccm.integrity && e.setAttribute("integrity", component.ccm.integrity), component.ccm.crossorigin && e.setAttribute("crossorigin", component.ccm.crossorigin), e.onload = function () {
                p(), document.head.removeChild(e)
            }, e.src = component.ccm.url
        }
    }
}());