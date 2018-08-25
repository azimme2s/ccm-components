(function () {
    let component = {
        name: "automated-test",
        ccm: "https://akless.github.io/ccm/ccm.js",
        config: {
            html: {},
            scenarios:['ccm.get', './fourth.json'],
            com: ['ccm.instance', '../todo-list/ccm.todo-list.js'],
            css: ['ccm.load', 'style.css'],
            //Actions: ['ccm.get', './Actions.js']
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
                self.com.start(function () {
                    self.element.appendChild(self.com.root);
                    if (callback) callback();
                });
                window.onkeypress = function(e){
                    let key = e.which || e.keyCode;
                    if (key === 84) { // 84 is T
                        self.runTest(my.scenarios);
                    }
                };
                if (callback) callback();

                Test.testFunc = function () {
                        console.log("Better Test");
                    };
                console.log(Test.test);
                Test.testFunc();
            };

            this.runTest = function (scenarios) {

               scenarios.map(testRun => {
                    let actions = new Actions(self.com.element);
                    actions.scenarioName = testRun.scenarioname;
                    testRun.scenario.map(s => {
                        actions.toTestTag = self.com.element.querySelectorAll(s.element);

                        if (actions.toTestTag) {
                            actions.testData = s.data;
                            if (actions.hasOwnProperty(s.action)) {
                                actions[s.action]();
                            }
                        }
                        else {
                           console.log("Test failed because no such element");
                        }
                    });
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