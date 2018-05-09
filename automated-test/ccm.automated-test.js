(function () {
    let component = {
        name: "automated-test",
        ccm: "https://akless.github.io/ccm/ccm.js",
        config: {
            html: {},
            scenario: [
                {
                    element: 'h1',
                    action: ['checkInner', 'replaceInner'],
                    data: ["Test", "Test1"]
                }
            ]
        },

        Instance: function () {
            let self = this;
            let my;
            /**
             * Needed Variabels
             */
            let toTestTag = [];
            let testData = [];
            let results = [];
            let scenarioCounter = 0;
            this.ready = function (callback) {
                my = self.ccm.helper.privatize(self);
                if (callback) callback();
            };

            this.start = function (callback) {
                //let main_elem = self.ccm.helper.html(my.com.config.html);
                //self.element.appendChild(main_elem);
                this.runTest(my.scenario);
                this.showResults();
                if (callback) callback();
            };

            this.runTest = function (scenario) {
                scenario.forEach(testRun => {
                    scenarioCounter++;
                    /**
                     * Getting the Element by Tag|ID|Class
                     * @type Node
                     */
                    console.log(self.element);
                    let tag = self.element.querySelector(testRun.element);
                    /**
                     * Checking if the Element exist, if not the test is done and the failure will be saved in an Array
                     */
                    if (tag) {
                        console.log(tag);
                        toTestTag = tag;
                        testData = testRun.data;

                        testRun.action.forEach(a => {
                            if(actions.hasOwnProperty(a)){
                                actions[a]();
                            }
                        })
                    }
                    else{
                        console.log("No element found with " + testRun.element);
                        results.push("Scenario "+scenarioCounter+" failed because of missing element "+ testRun.element);
                    }
                });
            };

            let actions = {
                checkInner: function () {
                    if(toTestTag.innerHTML !== null){
                        results.push("Scenario "+scenarioCounter+" checkInner passed");
                        return true;
                    }
                    else{
                        console.log("No Inner found");
                        results.push("Scenario "+scenarioCounter+" failed because "+ toTestTag +"has no innerHTML")
                    }
                },
                replaceInner: function () {
                    testData.forEach(e =>{
                        toTestTag.innerHTML = e;
                        if(toTestTag.innerHTML === e){
                            results.push("Scenario "+scenarioCounter+" passed because text could be replaced with "+e);
                        }
                        else{
                            results.push("Scenario "+scenarioCounter+" failed because Text coud be not replaced");
                        }
                    });
                }
            };
            this.showResults = function () {
                results.forEach(element => {
                    console.log(element);
                })
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