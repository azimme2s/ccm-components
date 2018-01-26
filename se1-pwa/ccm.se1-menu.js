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
                        {'tag': 'div', 'class': 'login'},
                        {'tag': 'div', 'class': 'content'}
                    ]
                }
            },
            'root_node': ['ccm.load', 'https://moritzkemp.github.io/ccm-route_node/ccm.route_node.js'],
            'navhamburger': ['ccm.component', 'ccm.nav-hamburger.js'],
            'content': ['ccm.component', 'https://akless.github.io/ccm-components/content/versions/ccm.content-2.0.0.min.js'],
            'css': ['ccm.load', 'style.css'],
            'feedback': ['ccm.component', 'ccm.feedback.js'],
            'news_feed': [
                'ccm.load',
                'ccm.news_feed.js'
            ],
            'inner': [],
            'subnodeArray': []
        },
        Instance: function () {
            let self = this;
            let my;
            let route_1 = {};

            this.ready = function (callback) {
                my = self.ccm.helper.privatize(self);
                if (callback) callback();
            };
            this.start = function (callback) {
                let main_elem = self.ccm.helper.html(my.html.main);
                self.element.appendChild(main_elem);
                let content = my.content;
                let domContent = self.element.querySelector('.content');
                let login = self.element.querySelector('.login');

                self.buildNav();


                while (login.hasChildNodes()) {
                    login.removeChild(login.firstChild);
                }
                let route = self.getUrlRoutes(window.location.href);
                if (route === "newsfeed") {
                    self.ccm.start(
                        my.news_feed,
                        {
                            "root": domContent,
                            "user": ["ccm.instance", "https://akless.github.io/ccm-components/user/ccm.user.min.js", {
                                'root': self.element.querySelector('.login'),
                                "sign_on": "hbrsinfkaul"
                            }],
                            "enableOffline": "false",
                            "storeConfig": {
                                "store": "SE1_news_feed",
                                "url": "https://ccm.inf.h-brs.de"
                            }
                        });
                } else {
                    let htmlContent = self.getHTMLContent(my.inner, route);
                    content.start({root: domContent, inner: ['ccm.load', htmlContent]}, function (instance) {
                            console.log(instance);
                        }
                    );
                }


                self.ccm.start("https://moritzkemp.github.io/ccm-route_node/ccm.route_node.js", {
                    "isRoot": true,
                    "patterns": [""],
                    "observer": [
                        (route) => {
                            console.log("[Route 1 Observer] ", route);
                        }
                    ]
                }, function (instance) {
                    route_1 = instance;
                    console.log(my.subnodeArray);
                    self.ccm.start("https://moritzkemp.github.io/ccm-route_node/ccm.route_node.js", {
                        "patterns": my.subnodeArray,
                        "prevNode": {"route": "", "node": route_1},
                        "observer": [
                            (route) => {
                                console.log("[Route 2 Observer] ", route);
                            }
                        ]

                    })
                }, function (instance_1) {
                    console.log(instance_1);
                });
                if (callback) callback();
            };

            this.buildNav = function () {
                let content = my.content;
                let domContent = self.element.querySelector('.content');
                let login = self.element.querySelector('.login');
                let navInner = my.inner.map(function (element) {
                    my.subnodeArray.push(element[0]);
                    return {
                        'text': 'Software Engineering LE ' + element[0],
                        'id': element[0],
                        'action': function () {
                            while (login.hasChildNodes()) {
                                login.removeChild(login.firstChild);
                            }
                            content.start({root: domContent, inner: ['ccm.load', element[1]]}, function (instance) {
                                    console.log(instance);
                                }
                            );
                            route_1.navigatedTo('/' + element[0]);
                        }
                    }
                });
                navInner.push({
                    'text': 'News Feed',
                    'id': 'newsfeed',
                    'action': function () {
                        self.ccm.start(
                            my.news_feed,
                            {
                                "root": domContent,
                                "user": ["ccm.instance", "https://akless.github.io/ccm-components/user/ccm.user.min.js", {
                                    'root': self.element.querySelector('.login'),
                                    "sign_on": "hbrsinfkaul"
                                }],
                                "enableOffline": "false",
                                "storeConfig": {
                                    "store": "SE1_news_feed",
                                    "url": "https://ccm.inf.h-brs.de"
                                }
                            });
                        route_1.navigatedTo('/' + this.id);
                    }
                });
                my.subnodeArray.push("/newsfeed");
                let nav = self.element.querySelector('.nav');
                self.ccm.start(my.navhamburger, {
                    root: nav,
                    "section": navInner
                });

            };
            this.getUrlRoutes = url => {
                console.log(url);
                let pathname = new URL(url).hash;
                let route = pathname.split('/');
                return route[1];
            };
            this.getHTMLContent = (inner, value) => {
                for (let i = 0; i < inner.length; i++) {
                    if (inner[i][0] === value) {
                        return inner[i][1];
                    }
                }
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