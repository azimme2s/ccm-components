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
            scenarios: [],
            com: ['ccm.instance', '../todo-list/ccm.todo-list.js'],
            css: ['ccm.load', 'style.css'],
            Actions: ['ccm.get', './Actions.js']
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
                            actions.results.push("Scenario " + actions.scenarioName + " failed because of missing element " + s.element);
                        }
                    });
                });
            };

            function Actionsl() {
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
                            this.results.push("Scenario " + scenarioName + " failed because " + oneTag + "has no innerHTML");
                            fail(oneTag)
                        }
                    });
                };
                this.chechkForEmptyInner = function () {
                    this.toTestTag.forEach(oneTag => {
                        if (!oneTag.innerHTML) {
                            this.results.push("Scenario " + this.scenarioName + " check for empty passed");
                            success(oneTag);
                        }
                        else {
                            this.results.push("Scenario " + this.scenarioName + " failed because " + oneTag + " is not empty");
                            fail(oneTag);
                        }
                    });
                };
                this.replaceInner = function () {
                    this.testData.forEach(e => {
                        this.toTestTag.forEach(oneTag => {
                            oneTag.innerHTML = e;
                            if (oneTag.innerHTML === e) {
                                this.results.push("Scenario " + this.scenarioName + " passed because text could be replaced with " + e);
                                success(oneTag);
                            }
                            else {
                                this.results.push("Scenario " + this.scenarioName + " failed because Text could be not replaced");
                                fail(oneTag);
                            }
                        });
                    });
                };
                this.isEmptyInput = function () {
                    this.toTestTag.forEach(oneTag => {
                        if (oneTag.value === "" || oneTag.value === null) {
                            this.results.push("Scenario " +  this.scenarioName + " is empty");
                            success(oneTag)
                        }
                        else {
                            fail(oneTag);
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
                            success(oneTag);
                        });
                    });
                };
                this.checkAll = function () {
                    this.toTestTag.forEach(oneTag => {
                        this.testData.filter(data => {
                            if(oneTag.querySelector('label').innerHTML == data){
                                this.results.push("Element " + oneTag.innerHTML + "have value " + data);
                                success(oneTag.querySelector('label'));
                                return;
                            }
                            fail(oneTag.querySelector('label'));
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
            function success (htmlElement){
                let checkmark = document.createElement('span');
                checkmark.setAttribute('class','checkmark');
                checkmark.innerHTML= `
                                    <div class="checkmark_circle"></div>
                                        <div class="checkmark_stem"></div>
                                        <div class="checkmark_kick"></div>
                                `;
                htmlElement.parentNode.insertBefore(checkmark, htmlElement.nextSibling);
            }
            function fail (htmlElement) {
                let redcross = document.createElement('span');
                redcross.setAttribute('class','redcross');
                redcross.innerHTML= 'X';
                htmlElement.parentNode.insertBefore(redcross, htmlElement.nextSibling);
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