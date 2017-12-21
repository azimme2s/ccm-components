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
                        {'tag': 'div', 'class': 'content', 'inner':[
                                {'tag': 'div', 'class': 'login'},
                                {'tag': 'div', 'class': 'newsfeed'}
                            ]}
                    ]
                }
            },
            'root_node': ['ccm.load','https://moritzkemp.github.io/ccm-route_node/ccm.route_node.js'],
            'navhamburger': ['ccm.component', 'ccm.nav-hamburger.js'],
            'content': ['ccm.component', 'https://akless.github.io/ccm-components/content/versions/ccm.content-2.0.0.min.js'],
            'css': ['ccm.load', 'style.css'],
            'user' : ["ccm.load", "https://akless.github.io/ccm-components/user/ccm.user.min.js"],
            'feedback': ['ccm.component', 'ccm.feedback.js'],
            'news_feed': [
                'ccm.load',
                'https://moritzkemp.github.io/ccm-news_feed/ccm.news_feed.min.js'
            ],
            'inner': []
        },
        Instance: function () {
            let self = this;
            let my;
            let route_1 = {};
            let route_2 = {};

            this.ready = function (callback) {
                my = self.ccm.helper.privatize(self);
                if (callback) callback();
            };
            this.start = function (callback) {


                var main_elem = self.ccm.helper.html(my.html.main);
                self.element.appendChild(main_elem);
                self.buildNav();
                self.ccm.start(my.root_node, {
                    "isRoot": true,
                    "observer" : [
                        (route)=>{
                            console.log("[Route 1 Observer] ", route);
                        }
                    ]
                }, function(instance){
                    route_1 = instance;
                    ccm.start(my.root_node, {
                        "patterns": subnodeArray,
                        "prevNode": {"route": "", "node":route_1},
                        "observer" : [
                            (route)=>{
                                console.log("[Route 2 Observer] ", route);
                            }
                        ]

                    }, instance_1 =>{
                        route_2 = instance_1;
                    })
                });
                if (callback) callback();
            };
            let subnodeArray = [];
            this.buildNav = function () {
                let content = my.content;
                let leCounter = 0;
                let domContent = self.element.querySelector('.content');
                let navInner = my.inner.map(function (element) {
                    leCounter++;
                    subnodeArray.push("/le"+leCounter);
                    return {
                        'text': 'Software Engineering LE ' + leCounter,
                        'id': 'le'+leCounter,
                        'action': function () {
                            content.start({root: domContent, inner: ['ccm.load', element]}, function (instance) {
                                    console.log(instance);
                                }
                            );
                            route_2.navigatedTo('/'+this.id);
                        }
                    }
                });
                navInner.push({
                        'text': 'News Feed',
                        'id': 'newsfeed',
                        'action': function () {
                            self.ccm.start(
                                my.user,
                                {
                                    'root': self.element.querySelector('.login'),
                                    "sign_on": "guest"
                                }, function(user){
                                   self.ccm.start(
                                        my.news_feed,
                                        {
                                            "root" : self.element.querySelector('.newsfeed'),
                                            //"user": my.user,
                                            "enableOffline": "false",
                                            "storeConfig":{
                                                "store":"SE1_news_feed",
                                                "url":"https://ccm.inf.h-brs.de"
                                            }
                                        }
                                    );
                                });
                        }
                });
                let nav = self.element.querySelector('.nav');
                this.ccm.start(my.navhamburger, {
                    root: nav,
                    "section": navInner
                });

               /*this.ccm.start(my.feedback,{
                    root: nav,
                    position: 'right',
                    key: ["ccm.get","resources/configs.js","local"],
                    function(instance){

                    }
                });*/
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