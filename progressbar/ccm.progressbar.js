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

                this.setComplete(my.min);
                let _complete = this.getComplete();


                for(let i= my.min; i <= my.max; i++){
                    setTimeout(function () {
                        _complete = i;
                        self.setComplete(_complete);
                    }, 100*i);
                }
                if (callback) callback();
            };
            this.setComplete = function(value){
                let newValue = value / my.max;
                newValue *= 100;
                let innerBar = self.element.querySelector('.progress-bar-inner');
                if(innerBar.style.width !== "100%") {
                    innerBar.style.width = newValue + '%';
                    if(my.showText){
                        innerBar.innerHTML = value + my.sign;
                    }
                }
                if (newValue > 100) {
                    innerBar.style.width = '100%';
                    if(my.showText){
                        innerBar.innerHTML = value + my.sign;
                    }
                }
            };
            this.getComplete = function() {
                return my.complete;
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