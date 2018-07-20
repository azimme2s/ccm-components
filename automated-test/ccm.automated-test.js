(function () {
    let component = {
        name: "automated-test",
        ccm: "https://akless.github.io/ccm/ccm.js",
        config: {
            html:
                {tag: 'div', class: 'modal', inner:
                    [
                        {tag: 'div', class:'modal-content', inner:
                                [
                                    {tag:'span', class:'close', inner: '&times;'},
                                    {tag:'p'},
                                ]
                        }
                    ]
                },
            scenarios: [
                {
                    scenarioname: 'Initial Data',
                    scenario: [
                        {
                            element: '.new-todo',
                            action: 'isEmptyInput',
                            data: []
                        },
                        {
                            element: '.new-todo',
                            action: 'intialize',
                            data: [1,2,3,'banane',5]
                        },
                        {
                            element: 'li',
                            action: 'checkAll',
                            data: [1,2,3,'banane',5]
                        }
                ]
                }
            ],
            com: ['ccm.instance', '../todo-list/ccm.todo-list.js'],
            css: ['ccm.load', 'style.css']
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
                    //self.runTest(my.scenarios);

                    if (callback) callback();
                });
                window.onkeypress = function(e){
                    let key = e.which || e.keyCode;
                    if (key === 84) { // 84 is T
                        self.runTest(my.scenarios);
                    }
                };
                if (callback) callback();
            };

            this.runTest = function (scenarios) {
                scenarios.forEach(testRun => {
                    let actions = new Actions();

                    actions.scenarioName = testRun.scenarioname;
                    testRun.scenario.forEach(s => {
                        actions.toTestTag = self.com.element.querySelectorAll(s.element);

                        if (actions.toTestTag) {
                            actions.testData = s.data;
                            if (actions.hasOwnProperty(s.action)) {
                                actions[s.action]();
                            } 
                        }
                        else {
                            actions.results.push("Scenario " + actions.scenarioName + " failed because of missing element " + s.element);
                        }
                    });
                    actions.showResults();
                });
            };

            function Actions() {
                this.toTestTag = [];
                this.testData = [];
                this.results = [];
                this.scenarioName;

                this.checkInner = function () {
                    this.toTestTag.forEach(oneTag => {
                        if (oneTag.innerHTML !== null || oneTag.innerHTML !== "") {
                            this.results.push("Scenario " + this.scenarioName + " checkInner passed");
                        }
                        else {
                            console.log("No Inner found");
                            this.results.push("Scenario " + scenarioName + " failed because " + oneTag + "has no innerHTML");
                        }
                    });
                };
                this.chechkForEmptyInner = function () {
                    this.toTestTag.forEach(oneTag => {
                        if (!oneTag.innerHTML) {
                            this.results.push("Scenario " + this.scenarioName + " check for empty passed");
                        }
                        else {
                            this.results.push("Scenario " + this.scenarioName + " failed because " + oneTag + " is not empty");
                        }
                    });
                };
                this.replaceInner = function () {
                    this.testData.forEach(e => {
                        this.toTestTag.forEach(oneTag => {
                            oneTag.innerHTML = e;
                            if (oneTag.innerHTML === e) {
                                this.results.push("Scenario " + this.scenarioName + " passed because text could be replaced with " + e);
                            }
                            else {
                                this.results.push("Scenario " + this.scenarioName + " failed because Text could be not replaced");
                            }
                        });
                    });
                };
                this.isEmptyInput = function () {
                    this.toTestTag.forEach(oneTag => {
                        if (oneTag.value === "" || oneTag.value === null) {
                            this.results.push("Scenario " +  this.scenarioName + " is empty");
                        }
                        else {
                            this.results.push("Scenario " +  this.scenarioName + " failed because " + oneTag + " is not empty");
                        }
                    });
                };
                this.intialize = function () {
                    this.toTestTag.forEach(oneTag => {
                        this.testData.forEach(entry => {
                            oneTag.value = entry;
                            let evt = new KeyboardEvent('keypress', {'keyCode':13, 'which':13});
                            self.com.element.onkeypress(evt);
                            this.results.push("Scenario " +  this.scenarioName + " succeed, event fired");
                        });
                    });
                };
                this.checkAll = function () {
                    this.toTestTag.forEach(oneTag => {
                        this.testData.forEach(data => {
                            if(oneTag.querySelector('label').innerHTML == data){
                                this.results.push("Element " + oneTag + "have value " + data);
                            }
                        });
                    });
                };

                this.showResults = function () {
                    let modal = self.element.querySelector('.modal');
                    modal.style.display = 'block';
                    let close = self.element.querySelector('.close');
                    close.onclick = function(){
                        modal.style.display = "none";
                    };
                    self.element.onclick = function(event) {
                        if (event.target === modal) {
                            modal.style.display = "none";
                        }
                    };
                    let modalContent = self.element.querySelector('.modal-content');
                    this.results.forEach(element => {
                        let p = document.createElement('p');
                        p.innerHTML = element;
                        modalContent.appendChild(p);
                        console.log(element);
                    })
                };
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