    /* 
 * The MIT License
 *
 * Copyright 2017 Moritz Kemp <moritz at kemp-thelen.de>.
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

(function() {
    var component = {
        name: 'nav-hamburger',
        ccm: 'https://akless.github.io/ccm/ccm.js',
        config: {
            'html': {
                'sidebar': {
                    'tag': 'aside',
                    'class': 'sidebar',
                    'inner':
                        {
                            'tag': 'nav',
                            'class': 'sidebar-container',
                            'inner': [
                                {
                                    'tag': 'div',
                                    'class': 'sidebar-header',
                                    'inner': [
                                         {
                                            'tag': 'button',
                                            'type': 'button',
                                            'class': 'button-close',
                                            'inner': 'Close'
                                        },
                                        {
                                            'tag': 'div',
                                            'inner': 'Navigation'
                                        }
                                    ]
                                }
                            ]

                        }
                },
                'header': {
                    'tag': 'div',
                    'class': 'header',
                    'inner':[
                        {
                            'tag': 'div',
                            'class': 'button-container',
                            'inner': {
                                'tag': 'button',
                                'type': 'button',
                                'class': 'button-open',
                                'inner': 'Menu'
                            }
                        },
                        {
                            'tag':'div',
                            'class':'text-container'
                        },
                        {
                            'tag':'div',
                            'class':'spacer'
                        }
                    ]
                },
                'list': {
                    'tag': 'ul',
                    'inner': ''
                }
            },
            'css': ['ccm.load', './resources/style.css'],
            'headerText' : '',
            'section': []
        },
        
        Instance: function() {
            var self = this;
            var my;
            var touchXstart = 0;
            var touchXdistance = 0;
            
            
            this.ready = function( callback ) {
                my = self.ccm.helper.privatize( self );                
                if( callback ) callback();
            };
            
            this.start = function( callback ) {
                
                // Build view
                self.buildView();
                
                // add interaction functionality
                self.element.querySelector('.button-open')
                            .addEventListener('click', self.openNavigation);
                self.element.querySelector('.button-close')
                            .addEventListener('click', self.closeNavigation);
                self.element.querySelector('.sidebar-container')
                            .addEventListener('click', function( e ) {
                            e.stopPropagation();
                        });
                self.element.querySelector('.sidebar')
                            .addEventListener('click', self.closeNavigation);
                
                // Touch gesture control
                self.element.querySelector('.sidebar-container')
                            .addEventListener('touchstart', self.touchstart);
                self.element.querySelector('.sidebar-container')
                            .addEventListener('touchmove', self.touchmove);
                
                self.element.querySelector('.sidebar-container')
                            .addEventListener('touchend', self.touchend);
                
                if( callback ) callback();
            };
            
            this.buildView = function( ) {
                 // build the view
                var header  = self.ccm.helper.html(my.html.header);
                var sidebar = self.ccm.helper.html(my.html.sidebar);
                var list    = self.ccm.helper.html(my.html.list);
                
                if(my.headerText !== '' && (typeof my.headerText === 'string')) {
                    header.querySelector('.text-container').appendChild(
                        document.createTextNode(my.headerText)
                    );
                }
                self.element.appendChild( header );
                
                // build sections and add click events
                for(i=0; i < my.section.length; i++){
                    var listItem = document.createElement('LI');
                    var textEl = document.createTextNode(my.section[i].text);
                    listItem.appendChild(textEl);
                    listItem.addEventListener( 'click', this.onSectionClick );
                    listItem.action = my.section[i].action;
                    list.appendChild(listItem);
                }
                
                sidebar.querySelector('.sidebar-container')
                       .appendChild( list );
                
               
                self.element.appendChild( sidebar );
            };
            
            this.openNavigation = function ( ) {
                self.element.querySelector('.sidebar-container').classList.add('sidebar-container-animatable');
                self.element.querySelector('.sidebar').classList.add('visible');
                self.element.querySelector('.sidebar-container').addEventListener('transitionend', self.onTransistionEnd);
            };
            
            this.closeNavigation = function ( ) {
                self.element.querySelector('.sidebar-container').classList.add('sidebar-container-animatable');
                self.element.querySelector('.sidebar').classList.remove('visible');
                self.element.querySelector('.sidebar-container').addEventListener('transitionend', self.onTransistionEnd);
            };
                      
            this.onSectionClick = function ( e ) {
                self.closeNavigation();
                if(typeof(e.target.action) === 'function') {
                    e.target.action();
                }
            };
            
            // Touch functionality
            this.onTransistionEnd = function ( ) {
                self.element.querySelector('.sidebar-container').classList.remove('sidebar-container-animatable');
                self.element.querySelector('.sidebar-container').removeEventListener('transitionend', self.onTransistionEnd);
            };
            
            this.touchstart = function ( e ) {
                self.touchXstart = e.touches[0].pageX;
            };
            
            this.touchmove = function ( e ) {
                self.touchXdistance = Math.min(0, e.touches[0].pageX - self.touchXstart);
                self.element.querySelector('.sidebar-container').style.transform = 'translateX('+ self.touchXdistance +'px)';
            };
            
            this.touchend = function ( e ) {
                self.element.querySelector('.sidebar-container').style.transform = '';
                if(self.touchXdistance < -50) {
                    self.closeNavigation();
                    self.touchXdistance = 0;
                }
            };
        }
    };
    
    //The following code gets the framework and registers component from above
    function p(){
        window.ccm[v].component(component);
    }
    var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}());