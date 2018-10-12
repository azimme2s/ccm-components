/**
 * @overview confirgurtion of the progress bar
 * @author Artur Zimmermann <artur.zimmermann@outlook.de> 2018
 * @license The MIT License (MIT)
 */

ccm.files[ 'configs.js' ] = {

    "local": {

        "key": "local",
        "complete": "0",
        "sign": '%',
        "showText": "true",
        "min": "0",
        "max": "100"

    },

    "demo": {

        "key": "demo",
        "questions": [
            {
                "text": "Question A",
                "answers": [ "Answer A", "Answer B", "Answer C" ]
            },
            {
                "text": "Which Letter?",
                "answers": [ "A", "B" ]
            },
            {
                "text": "Which Number?",
                "answers": [ "1", "2" ]
            },
            {
                "text": "Do you agree?",
                "answers": [ "Yes", "No" ]
            },
            {
                "text": "Which Fruit",
                "answers": [ "Apple", "Pear" ]
            },
            {
                "text": "Enough?",
                "answers": [ "Finish" ]
            }
        ]

    }

};