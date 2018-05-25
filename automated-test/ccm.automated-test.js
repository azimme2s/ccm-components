(function () {
    let component = {
        name: "automated-test",
        ccm: "https://akless.github.io/ccm/ccm.js",
        config: {
            html: {},
            scenario: [
                {
                    scenarioname: 'first',
                    element: 'a',
                    action: ['checkInner', 'replaceInner'],
                    data: ["Test", "Test1"]
                },
                {
                    scenarioname: 'check',
                    element: 'a',
                    action: ['checkInner'],
                    data: ["Test1"]
                }
            ],
            com: ['ccm.instance', '../todo-list/ccm.todo-list.js'],
            css:  ['ccm.load', 'style.css']
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
            let scenarioName;
            this.ready = function (callback) {
                my = self.ccm.helper.privatize(self);
                if (callback) callback();
            };

            this.start = function (callback) {
                
                //let main_elem = self.ccm.helper.html(my.html);
                //self.ccm.start(self.com, {root:main_elem});
                //self.element.appendChild(main_elem);
                //self.com.root = self.element;
                self.com.start(function(){
                    self.element.appendChild(self.com.root);
                    self.runTest(my.scenario);
                    self.showResults();
                    if (callback) callback();
                });
            };

            this.runTest = function (scenario) {
                scenario.forEach(testRun => {
                    scenarioName = testRun.scenarioname;
                    /**
                     * Getting the Element by Tag|ID|Class
                     * @type Node
                     */
                    toTestTag = self.com.element.querySelectorAll(testRun.element);
                    /**
                     * Checking if the Element exist, if not the test is done and the failure will be saved in an Array
                     */
                    if (toTestTag) {
                        testData = testRun.data;

                        testRun.action.forEach(a => {
                            if(actions.hasOwnProperty(a)){
                                actions[a]();
                            }
                        })
                    }
                    else{
                        console.log("No element found with " + testRun.element);
                        results.push("Scenario "+scenarioName+" failed because of missing element "+ testRun.element);
                    }
                });
            };

            let actions = {
                checkInner: function () {
                    toTestTag.forEach(oneTag => {
                        if(oneTag.innerHTML !== null || oneTag.innerHTML !== ""){
                            results.push("Scenario "+scenarioName+" checkInner passed");
                            return true;
                        }
                        else{
                            console.log("No Inner found");
                            results.push("Scenario "+scenarioName+" failed because "+ oneTag +"has no innerHTML");
                        }
                    });
                },
                chechkForEmpty: function() {
                    toTestTag.forEach(oneTag => {
                        if(oneTag.innerHTML.empty()){
                            results.push("Scenario "+ scenarioName +" check for empty passed");
                        }
                        else{
                            results.push("Scenario "+scenarioName+" failed because "+ oneTag +" is not empty");
                        }
                    });
                },
                replaceInner: function () {
                    testData.forEach(e =>{
                        toTestTag.forEach(oneTag => {
                            oneTag.innerHTML = e;
                            if(oneTag.innerHTML === e){
                                results.push("Scenario "+scenarioName+" passed because text could be replaced with "+e);
                            }
                            else{
                                results.push("Scenario "+scenarioName+" failed because Text could be not replaced");
                            }
                        });
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