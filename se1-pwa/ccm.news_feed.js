(function(){
    var component = {
        name: 'news_feed',
        ccm: 'https://akless.github.io/ccm/version/ccm-11.5.0.min.js',
        config: {
            "storeConfig":  {
                "store":"newsFeed",
                "url":"https://ccm.inf.h-brs.de"
            },
            "store": '',
            "user" : ["ccm.instance", "https://akless.github.io/ccm-components/user/ccm.user.min.js"],
            "enableOffline" : "true",
            "useOwnServiceWorker": "true",
            "css" : ["ccm.load", "style.css"],
            "html" : {
                "inputArea" : {
                    "tag"   : "div",
                    "class" : "new-post-container",
                    "inner" : [
                        {
                            "tag"   : "form",
                            "class" : "new-post-form",
                            "onsubmit": "%action%",
                            "inner" : [
                                {
                                    "tag" : "div",
                                    "class": "new-post-input",
                                    "inner":[
                                        {
                                            "tag" : "input",
                                            "class": "new-post-title",
                                            "type" : "text",
                                            "placeholder": "Title goes here ..."
                                        },
                                        {
                                            "tag"   : "textarea",
                                            "class" : "new-post-text",
                                            "rows"  : "3",
                                            "placeholder":"Something really important ...   "
                                        }
                                    ]
                                },
                                {
                                    "tag"   : "input",
                                    "class" : "new-post-submit",
                                    "type"  : "submit",
                                    "disabled": "true"
                                }
                            ]
                        }
                    ]
                },
                "postsArea":{
                    "tag" : "div",
                    "class" : "posts-area"
                },
                "post": {
                    "tag": "div",
                    "class": "post",
                    "inner": [
                        {
                            "tag": "div",
                            "class": "head",
                            "inner": [
                                {
                                    "tag": "div",
                                    "class": "user",
                                    "inner": [
                                        {
                                            "tag": "div",
                                            "class": "name",
                                            "inner": "%user%"
                                        }
                                    ]
                                },
                                {
                                    "tag": "div",
                                    "class": "title",
                                    "inner": [

                                        {
                                            "tag": "div",
                                            "inner": "%title%"
                                        },
                                        {
                                            "tag": "div",
                                            "class": "date",
                                            "inner": "%date%"
                                        }
                                    ]
                                },
                                {
                                    "tag": "div",
                                    "class":"status-indicator",
                                    "inner":[
                                        {
                                            "tag" : "div",
                                            "class": "%status%"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "tag": "div",
                            "class": "content",
                            "inner": {
                                "tag": "div",
                                "inner": "%text%"
                            }
                        }
                    ]
                }
            }
        },
        Instance: function(){
            const self = this;
            let my = {};
            const MSG_TO_SW_GET_POSTS = "get-posts";
            const MSG_TO_SW_SEND_POST = "send-post";
            const MSG_FROM_SW_GOT_POSTS = "got-posts";
            const MSG_FROM_SW_POSTS_SENT = "posts-sent";

            /* --- Public standard ccm functions */

            this.ready = function( callback ){
                my = self.ccm.helper.privatize(self);
                if(
                    "serviceWorker" in navigator &&
                    my.enableOffline === 'true'
                ){
                    if(my.useOwnServiceWorker === 'true'){
                        navigator.serviceWorker.register("./serviceworker.js");
                    }
                    navigator.serviceWorker.addEventListener("message", handleMessageFromServiceWorker);
                }
                my.store = self.ccm.store(my.storeConfig);
                if(callback) callback();
            };

            this.start = function( callback ){
                self.user.addObserver('newsfeed', toggleSendButtonState);
                self.user.start();
                renderInputArea();
                if("serviceWorker" in navigator && my.enableOffline === 'true'){
                    if(navigator.serviceWorker.controller){
                        navigator.serviceWorker.controller.postMessage({
                            "tag" : MSG_TO_SW_GET_POSTS,
                            "url" : my.storeConfig.url +"?store="+my.storeConfig.store
                        });
                    } else {
                        navigator.serviceWorker.ready
                            .then((registration)=>{
                                registration.active.postMessage({
                                    "tag" : MSG_TO_SW_GET_POSTS,
                                    "url" : my.storeConfig.url +"?store="+my.storeConfig.store
                                });
                            });
                    }
                } else {
                    my.store.get( (response)=>{
                        renderPosts(response);
                    });
                }
                renderPostsArea();
                if(callback) callback();
            };

            /* --- Private render functions ---*/

            const renderInputArea = function(){
                let inputHtml = self.ccm.helper.html(
                    my.html.inputArea,
                    {
                        action: onPostSend
                    }
                );
                self.element.appendChild( inputHtml );
            };

            const renderPostsArea = function(){
                let oldPostArea = self.element.querySelector('.posts-area');
                let newPostArea = self.ccm.helper.html( my.html.postsArea );
                if(oldPostArea)
                    self.element.replaceChild( newPostArea, oldPostArea );
                else
                    self.element.appendChild( newPostArea );
            };

            const renderPosts = function( postsData ){
                renderPostsArea();
                postsData.sort(comparePosts);
                postsData.forEach( renderSinglePost );
            };

            const renderSinglePost = function( singlePostData, status='' ) {
                let postsArea = self.element.querySelector('.posts-area');
                let d = new Date(singlePostData.date);
                let newPostElem = self.ccm.helper.html(
                    my.html.post,
                    {
                        title:   singlePostData.title,
                        date:    d.toLocaleDateString(),
                        user:    singlePostData.user,
                        text:    singlePostData.text,
                        status:  status
                    }
                );
                if(postsArea.firstChild){
                    postsArea.insertBefore(
                        newPostElem,
                        postsArea.childNodes[0]
                    );
                } else {
                    postsArea.appendChild(newPostElem);
                }

            };

            /* --- Private functions to send a new post ---*/

            const onPostSend = function( event ){
                event.preventDefault();
                const newPostTextElem = self.element.querySelector('.new-post-text');
                const newPostTitleElem = self.element.querySelector('.new-post-title');
                const newText  = newPostTextElem.value;
                const newTitle = newPostTitleElem.value;
                newPostTextElem.value = '';
                newPostTitleElem.value = '';
                let d = new Date();
                const newPost = {
                    "title":    newTitle,
                    "text":     newText,
                    "date":     d.getTime(),
                    "user":     self.user.data().name || ''
                };
                if("serviceWorker" in navigator && my.enableOffline === 'true'){
                    renderSinglePost( newPost, 'waiting');
                    sendPostViaServiceWorker( newPost );
                } else {
                    renderSinglePost( newPost );
                    my.store.set( newPost );
                }
            };

            const sendPostViaServiceWorker = function( newPost ){
                let completeURL = '';
                let searchParams = new URLSearchParams();
                searchParams.append("store", my.storeConfig.store);
                searchParams.append("dataset[title]", newPost.title);
                searchParams.append("dataset[text]", newPost.text);
                searchParams.append("dataset[date]", newPost.date);
                searchParams.append("dataset[user]", newPost.user);
                searchParams.append("dataset[key]", Math.floor((Math.random()*1000)+1));
                completeURL = my.storeConfig.url+"?"+searchParams.toString();
                if(navigator.serviceWorker.controller){
                    navigator.serviceWorker.controller.postMessage( {
                        "tag"   : MSG_TO_SW_SEND_POST,
                        "url"   : completeURL
                    });
                } else {
                    navigator.serviceWorker.ready.then((registration)=>{
                        registration.active.postMessage( {
                            "tag"   : MSG_TO_SW_SEND_POST,
                            "url"   : completeURL
                        });
                    });
                }

            };

            /* --- Private event handlers --- */

            const toggleSendButtonState = function( isLoggedIn ){
                self.element.querySelector('.new-post-submit')
                    .disabled = !isLoggedIn;
            };

            // Get a fresh copy of remote post after all pending posts are send
            const allPostsShipped = function(){
                if(navigator.serviceWorker.controller){
                    navigator.serviceWorker.controller.postMessage({
                        "tag" : MSG_TO_SW_GET_POSTS,
                        "url" : my.storeConfig.url +"?store="+my.storeConfig.store
                    });
                }else{
                    navigator.serviceWorker.ready.then((registration)=>{
                        registration.active.postMessage({
                            "tag" : MSG_TO_SW_GET_POSTS,
                            "url" : my.storeConfig.url +"?store="+my.storeConfig.store
                        });
                    });
                }

            };

            const handleMessageFromServiceWorker = function( event ){
                console.log("[News-feed] Msg from sw: ", event);
                switch( event.data.tag ){
                    case MSG_FROM_SW_GOT_POSTS:
                        renderPosts(event.data.posts);
                        break;
                    case MSG_FROM_SW_POSTS_SENT:
                        allPostsShipped();
                        break;
                    default:
                        console.log("[News-feed] No handler for msg-tag: ", event.data.tag);
                }
            };

            const comparePosts = (a, b) =>{
                if(a.date >= b.date)
                    return 1;
                else
                    return -1;
            };
        }
    };

    //The following code gets the framework and registers component from above
    function p(){window.ccm[v].component(component);}
    var f="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[f])window.ccm.files[f]=component;else{var n=window.ccm&&window.ccm.components[component.name];n&&n.ccm&&(component.ccm=n.ccm),"string"==typeof component.ccm&&(component.ccm={url:component.ccm});var v=component.ccm.url.split("/").pop().split("-");if(v.length>1?(v=v[1].split("."),v.pop(),"min"===v[v.length-1]&&v.pop(),v=v.join(".")):v="latest",window.ccm&&window.ccm[v])p();else{var e=document.createElement("script");document.head.appendChild(e),component.ccm.integrity&&e.setAttribute("integrity",component.ccm.integrity),component.ccm.crossorigin&&e.setAttribute("crossorigin",component.ccm.crossorigin),e.onload=function(){p(),document.head.removeChild(e)},e.src=component.ccm.url}}
}());


