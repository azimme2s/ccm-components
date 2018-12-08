/**
 * @overview ccm component for progress bar
 * @author Arthur Zimmermann 2018
 * @license MIT License
 * @version 1.0.0
 * @changes
 * version 1.0.0 (12.10.2018)
 */

( function () {

    const component = {

        name: 'progressbar',

        ccm: 'https://ccmjs.github.io/ccm/ccm.js',

        config: {
            "html": {
                "progressbar": {
                    "tag": "div",
                    "class": "progress-bar",
                    "inner": {
                        "tag": "div",
                        "class": "progress-bar-inner",
                        "inner": ""
                    }
                }
            },
            "css": [ "ccm.load", "https://ccmjs.github.io/azimmer-components/progressbar/resources/default.css" ],
        },

        Instance: function () {

            this.start = async () => {

                this.ccm.helper.setContent( this.element, this.ccm.helper.html( this.html.progressbar ) );

                this.setComplete( this.min );
                let _complete = this.getComplete();

                for ( let i = this.min; i <= this.max; i++ )
                    setTimeout( () => { _complete = i; this.setComplete( _complete ); }, 100 * i );

            };

            this.setComplete = value => {

                let newValue = value / this.max;
                newValue *= 100;
                let innerBar = this.element.querySelector( '.progress-bar-inner' );
                if ( innerBar.style.width !== '100%' ) {
                    innerBar.style.width = newValue + '%';
                    if ( this.showText )
                        innerBar.innerHTML = value + this.sign;
                }
                if ( newValue > 100 ) {
                    innerBar.style.width = '100%';
                    if ( this.showText )
                        innerBar.innerHTML = value + this.sign;
                }

            };

            this.getComplete = () => this.complete;

        }

    };

    let b="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[b])return window.ccm.files[b]=component;(b=window.ccm&&window.ccm.components[component.name])&&b.ccm&&(component.ccm=b.ccm);"string"===typeof component.ccm&&(component.ccm={url:component.ccm});let c=(component.ccm.url.match(/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/)||["latest"])[0];if(window.ccm&&window.ccm[c])window.ccm[c].component(component);else{var a=document.createElement("script");document.head.appendChild(a);component.ccm.integrity&&a.setAttribute("integrity",component.ccm.integrity);component.ccm.crossorigin&&a.setAttribute("crossorigin",component.ccm.crossorigin);a.onload=function(){window.ccm[c].component(component);document.head.removeChild(a)};a.src=component.ccm.url}
} )();