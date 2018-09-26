(function () {
    let component = {
        name: "progressbar",
        ccm: "https://akless.github.io/ccm/ccm.js",
        config: {
            html: {
                progressbar: {
                    tag: 'div',
                    class: 'progress-bar',
                    inner:{
                        tag: 'div',
                        class: 'progress-bar-inner',
                        inner: ''
                    }
                }
            },
            complete: 0,
            css: ['ccm.load', 'style.css'],
        },

        Instance: function () {
            let self = this;
            let my;

            this.ready = function (callback) {
                my = self.ccm.helper.privatize(self);
                if (callback) callback();
            };

            this.start = function (callback) {
                let main_elem = self.ccm.helper.html(my.html.progressbar);
                self.element.appendChild(main_elem);

                let _complete = this.getComplete();
                console.log(_complete);
                this.setComplete(_complete);
                
                self.element.addEventListener("click", function(){
                    _complete += 10;
                    self.setComplete(_complete);
                });
                
                if (callback) callback();
            };
            this.setComplete = function(value){
                let innerBar = self.element.querySelector('.progress-bar-inner');
                if(innerBar.style.width !== "100%") {
                    innerBar.style.width = value + '%';
                }
                if (value > 100) {
                    innerBar.style.width = '100%';
                }
            };
            this.getComplete = function() {
                return my.complete;
            };
            this.changeListener = function(value) {
                this.setComplete(value);
            }
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