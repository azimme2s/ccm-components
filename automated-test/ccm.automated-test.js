(function () {
    let component = {
        name: "automated-test",
        ccm: "https://akless.github.io/ccm/ccm.js",
        config: {
            html: {},
            scenario: [
                {
                    number: 1,
                    element: "h1",
                    action: [
                        {
                            action: 'checkInner',
                            data: ["todos"]
                        },
                        {
                            action: 'replaceInner',
                            data: ["Test", "Test2"]
                        },
                        {
                            action: 'checkInner',
                            data: ["Test2"]
                        }
                    ],
                    
                }
            ],
            com: ['ccm.load', '../todo-list/ccm.todo-list.js'],
            css: ['ccm.load', 'style.css']
        },

        Instance: function () {
            let self = this;
            let my;
            /**
             * Needed Variabel, to know which element is mean
             * and where to safe the Results
             */
            let toTestTag;
            let results = [];
           
            this.ready = function (callback) {
                my = self.ccm.helper.privatize(self);
                if (callback) callback();
            };

            this.start = function (callback) {
                let main_elem = self.ccm.helper.html(my.com.config.html);
                self.element.appendChild(main_elem);
                this.runTest(my.scenario);
                this.showResults();
                if (callback) callback();
            };

            this.runTest = function (scenario) {
                scenario.forEach(testRun => {
                    /**
                     * Getting the Element by Tag|ID|Class
                     * @type Node
                     */
                    let tag = self.element.querySelector(testRun.element);
                    /**
                     * Checking if the Element exist, if not the test is done and the failure will be saved in an Array
                     */
                    if (tag !== null) {
                        toTestTag = tag;
                        testRun.action.forEach(a => {
                            actions.scenarioTitle = testRun.number
                            if(actions.hasOwnProperty(a.action)){
                                actions.actionData = a.data;
                                actions[a.action]();
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
                actionData: [],
                scenarioTitle: "",
                checkInner: function () {
                    this.actionData.forEach(e => {
                        if(toTestTag.innerHTML === e){
                            results.push("Scenario "+this.scenarioTitle+" checkInner passed with "+e);
                            return true;
                        }
                        else{
                            results.push("Scenario "+this.scenarioTitle+" failed because "+ toTestTag +"has no innerHTML with "+ e);
                        }
                    });
                },
                replaceInner: function () {
                    this.actionData.forEach(e =>{
                        toTestTag.innerHTML = e;
                        if(toTestTag.innerHTML === e){
                            results.push("Scenario "+this.scenarioTitle+" passed because text could be replaced with "+e);
                        }
                        else{
                            results.push("Scenario "+this.scenarioTitle+" failed because Text coud be not replaced");
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