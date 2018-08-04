function Actions(componentElement) {

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
                success(oneTag,"Scenario " +  this.scenarioName + " is empty")
            }
            else {
                fail(oneTag,"Scenario " +  this.scenarioName + " failed because " + oneTag + " is not empty");
                this.results.push("Scenario " +  this.scenarioName + " failed because " + oneTag + " is not empty");
            }
        });
    };
    this.intialize = function () {
        this.toTestTag.forEach(oneTag => {
            this.testData.forEach(entry => {
                oneTag.value = entry;
                let evt = new KeyboardEvent('keypress', {'keyCode':13, 'which':13});
                componentElement.onkeypress(evt);
                this.results.push("Scenario " +  this.scenarioName + " succeed, event fired");
                success(oneTag,"Scenario " +  this.scenarioName + " succeed, event fired");
            });
        });
    };
    this.checkAll = function () {
        this.toTestTag.forEach(oneTag => {
            this.testData.filter(data => {
                if(oneTag.querySelector('label').innerHTML == data){
                    this.results.push("Element " + oneTag.innerHTML + "have value " + data);
                    success(oneTag.querySelector('label'),"Element " + oneTag.querySelector('label').innerHTML + " have value " + data);
                    return;
                }
                fail(oneTag.querySelector('label'),"Element " + oneTag.querySelector('label').innerHTML + " don't have value " + data);
            });
        });
    };
}
function success (htmlElement, sucessMessage){
    let checkmark = document.createElement('span');
    checkmark.setAttribute('class','checkmark');
    checkmark.innerHTML= `
                                    <div class="checkmark_circle"></div>
                                        <div class="checkmark_stem"></div>
                                        <div class="checkmark_kick"></div>
                                        <span class="tooltiptext">${sucessMessage}</span>
                                `;
    htmlElement.parentNode.insertBefore(checkmark, htmlElement.nextSibling);
}
function fail (htmlElement,errorMessage) {
    let redcross = document.createElement('span');
    redcross.setAttribute('class','checkmark');
    redcross.innerHTML= `
                                    <div class="checkmark_circle_red">X</div>
                                       
                                        <span class="tooltiptext">${errorMessage}</span>
                                `;
    htmlElement.parentNode.insertBefore(redcross, htmlElement.nextSibling);
}
