(function () {
    var component = {
        name: "todo-list",
        ccm: "https://akless.github.io/ccm/ccm.js",
        config: {
            html: {
                tag: 'section', class: 'todoapp', inner: 
                    [
                        {tag: 'header', class: 'header', inner: 
                            [
                                {tag:'h1', inner: 'todos'},
                                {tag:'input', class:'new-todo', placeholder: 'What needs to be done?'}
                            ]
                        },
                        {tag: 'section', class: 'main', inner: 
                            [
                                {tag:'input', class:'toggle-all', type: 'checkbox'},
                                {tag:'label', for:'toggle-all', inner: 'Mark all as complete'},
                                {tag:'ul', class:'todo-list'}
                            ]
                        },
                        {tag: 'footer', class: 'footer', inner: 
                            [
                                {tag:'span', class:'todo-count'},
                                {tag:'div', class:'filters', inner:
                                    [
                                        {tag:'a', href:'#/', class:'selected', inner: 'All'},
                                        {tag:'a', href:'#/active', inner: 'Active'},
                                        {tag:'a', href:'#/completed', inner: 'Completed'},
                                    ]
                                },
                                {tag:'button', class:'clear-completed', inner: 'Clear completed'}
                            ]
                        },
                    ] 
            },
            css:  ['ccm.load', 'style.css'],
        },
        Instance: function () {
            let self = this;
            let my;

            this.ready = function (callback) {
                my = self.ccm.helper.privatize(self);
                if (callback) callback();
            };
            this.start = function (callback) {
                let main_elem = self.ccm.helper.html(my.html);
                self.element.appendChild(main_elem);
                if (callback) callback();
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