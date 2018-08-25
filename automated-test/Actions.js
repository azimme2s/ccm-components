function Actions(componentElement) {

    this.toTestTag = [];
    this.testData = [];
    this.scenarioName = "";

    this.checkInner = function () {
        this.toTestTag.forEach(oneTag => {
            this.testData.forEach(data => {
                if (oneTag.innerHTML === data) {
                    success(oneTag, "Scenario " + this.scenarioName + " checkInner passed, " + oneTag + "innerHTML is " + data);
                }
                else {
                    fail(oneTag, "Scenario " + this.scenarioName + " failed because " + oneTag + "has no innerHTML with " + data)
                }
            });
        });

    };
    this.chechkForEmptyInner = function () {
        this.toTestTag.forEach(oneTag => {
            if (!oneTag.innerHTML) {
                success(oneTag, "Scenario " + this.scenarioName + " check for empty passed");
            }
            else {
                fail(oneTag,"Scenario " + this.scenarioName + " failed because " + oneTag + " is not empty");
            }
        });
    };
    this.replaceInner = function () {
        this.testData.forEach(e => {
            this.toTestTag.forEach(oneTag => {
                oneTag.innerHTML = e;
                if (oneTag.innerHTML === e) {
                    success(oneTag, "Scenario " + this.scenarioName + " passed because text could be replaced with " + e);
                }
                else {
                    fail(oneTag,"Scenario " + this.scenarioName + " failed because Text could be not replaced");
                }
            });
        });
    };
    this.isEmptyInput = function () {
        this.toTestTag.forEach(oneTag => {
            if (oneTag.value === "" || oneTag.value === null) {
                success(oneTag,"Scenario " +  this.scenarioName + " is empty")
            }
            else {
                fail(oneTag,"Scenario " +  this.scenarioName + " failed because " + oneTag + " is not empty");
            }
        });
    };
    this.intialize = function () {
        this.toTestTag.forEach(oneTag => {
            this.testData.forEach(entry => {
                oneTag.value = entry;
                let evt = new KeyboardEvent('keypress', {'keyCode':13, 'which':13});
                componentElement.onkeypress(evt);
                success(oneTag,"Scenario " +  this.scenarioName + " succeed, event fired");
            });
        });
    };
    this.checkAll = function () {
        this.toTestTag.forEach(oneTag => {
            this.testData.map(data => {
                if(oneTag.querySelector('label').innerHTML == data){
                    success(oneTag.querySelector('label'),"Element " + oneTag.querySelector('label').innerHTML + " have value " + data);
                    return;
                }
                fail(oneTag.querySelector('label'),"Element " + oneTag.querySelector('label').innerHTML + " don't have value " + data);
            });
        });
    };
    this.checkBoxUntrue = function () {
        this.toTestTag.forEach( oneTag => {
            if(!oneTag.querySelector('.toggle').checked){
                success(oneTag.querySelector('.toggle'),"Element " + oneTag.querySelector('.toggle').innerHTML + " is unset");
            }
            else{
                fail(oneTag.querySelector('.toggle'),"Element " + oneTag.querySelector('.toggle').innerHTML + " is set");
            }
        });
    };
    this.setCheckboxTrue = function () {
        this.toTestTag.forEach( oneTag => {
            if(!oneTag.querySelector('.toggle').checked){
                oneTag.querySelector('.toggle').click();
                oneTag.querySelector('.toggle').checked = true;
                success(oneTag.querySelector('.toggle'),"Element " + oneTag.querySelector('.toggle').innerHTML + " is set");
            }
            else{
                fail(oneTag.querySelector('.toggle'),"Element " + oneTag.querySelector('.toggle').innerHTML + " was already set");
            }
        });
    };
    this.checkForStrike = function () {
        this.toTestTag.forEach( oneTag => {
            let label = oneTag.querySelector('label');
            if(label.querySelector('strike')){
                success(label,"Element " + label + " is strike");
            }
            else{
                fail(label,"Element " + label + " is not striked");
            }
        });
    }

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
