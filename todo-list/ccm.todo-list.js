(function () {
    let component = {
        name: "todo-list",
        ccm: "https://ccmjs.github.io/ccm/ccm.js",
        config: {
            html: {
                tag: 'section', class: 'todoapp', inner: 
                    [
                        {tag: 'header', class: 'header', inner: 
                            [
                                {tag:'h1', inner: 'todos'},
                                {tag:'input', class:'new-todo', placeholder: 'What needs to be done?'}
                            ]
                        },
                        {tag: 'section', class: 'main', inner: 
                            [
                                {tag:'input', class:'toggle-all', type: 'checkbox'},
                                {tag:'label', for:'toggle-all', inner: 'Mark all as complete'},
                                {tag:'ul', class:'todo-list'}
                            ]
                        },
                        {tag: 'footer', class: 'footer', inner: 
                            [
                                {tag:'span', class:'todo-count'},
                                {tag:'div', class:'filters', inner:
                                    [
                                        {tag:'a', href:'#/', class:'selected',id:'all', inner: 'All'},
                                        {tag:'a', href:'#/active', id: 'active',inner: 'Active'},
                                        {tag:'a', href:'#/completed', id: 'completed',inner: 'Completed'},
                                    ]
                                },
                                {tag:'button', class:'clear-completed', inner: 'Clear completed'}
                            ]
                        }
                    ] 
            },
            css:  ['ccm.load', 'style.css']
        },
        Instance: function () {

            this.start = async () => {
                let indexedDB = window.indexedDB || this.window.mozIndexedDB || this.window.webkitIndexedDB || this.window.msIndexedDB || this.window.shimIndexedDB;
                let open = indexedDB.open("TodoDB", 1);
                let db;
                open.onerror = function(event) {
                    console.log("Datenbankfehler: " + event.target.errorCode);
                };
                open.onsuccess = function(event) {
                    db = open.result;
                    this.readAll(db, null);
                };
                open.onupgradeneeded = function() {
                    let db = open.result;
                    let store = db.createObjectStore("todos", {keyPath: "id"});
                };
                let counter = 0;

                this.ccm.helper.setContent( this.element, this.ccm.helper.html( this.html ) );


                this.element.onkeypress = function (e) {
                    let key = e.which || e.keyCode;
                    if (key === 13) { // 13 is enter
                        let inputString = element.querySelector('.new-todo').value;
                        if(!(inputString.length === 0) || inputString.trim()){
                            let entry = {id:"b"+ counter++,todo:inputString,done:false};
                            let request = db.transaction(["todos"], "readwrite")
                                .objectStore("todos")
                                .add(entry);
                            this.createNewTodo(entry, db);
                            request.onsuccess = function(event) {
                            this.element.querySelector('.new-todo').value = null;
                            };

                            request.onerror = function(event) {
                                console.log(event);
                            };
                        }
                    }
                };
                
                this.element.querySelector('#all').addEventListener('click', function(){
                    this.element.querySelectorAll('a').forEach(element => {
                        element.removeAttribute('class');
                    });

                    this.element.querySelectorAll('li').forEach(element => {
                        element.remove();
                    });

                    this.readAll(db,null);
                    this.element.querySelector('#all').className ='selected';
                });
                this.element.querySelector('#active').addEventListener('click', function(){
                    this.element.querySelectorAll('a').forEach(element => {
                        element.removeAttribute('class');
                    });
                    this.element.querySelectorAll('li').forEach(element => {
                        element.remove();
                    });
                    this.readAll(db,false);
                    this.element.querySelector('#active').className ='selected';
                });
                this.element.querySelector('#completed').addEventListener('click', function(){
                    this.element.querySelectorAll('a').forEach(element => {
                        element.removeAttribute('class');
                    });
                    this.element.querySelectorAll('li').forEach(element => {
                        element.remove();
                    });
                    this.readAll(db,true);
                    this.element.querySelector('#completed').className = '.selected';
                });


                this.element.querySelector('.clear-completed').addEventListener('click', function(){
                        let items = this.element.querySelectorAll('.toggle');
                        let ids = [];
                        items.forEach(element => {
                            if(element.checked){
                               ids.push(
                                   {
                                        key: element.parentElement.parentElement.id,
                                        value: element.parentElement.parentElement
                                   }
                                       
                                );
                            }
                        });
                        ids.map(element => {
                            let request = db.transaction(["todos"], "readwrite")
                            .objectStore("todos")
                            .delete(element.key);
                            request.onsuccess = function(event) {
                                element.value.remove();
                            };
                        });  
                });
            };

            this.readAll =  (db, flag) => {
                let objectStore = db.transaction("todos").objectStore("todos");
                objectStore.openCursor().onsuccess = function(event) {
                    let cursor = event.target.result;
                    if (cursor) {
                        if(cursor.value.done === flag){
                            counter = Number(cursor.value.id.slice(1)) + 1;
                            this.createNewTodo(cursor.value, db);
                        }
                        else if(flag === null){
                            counter = Number(cursor.value.id.slice(1)) + 1;
                            this.createNewTodo(cursor.value, db);
                        }
                        cursor.continue();
                    }
                    else {
                        console.log("No more entries!");
                    }
                };
            };

            this.createNewTodo = (todo, db) => {
                let newTodo = document.createElement('li');
                newTodo.setAttribute('id',todo.id);
                let div = document.createElement('div');
                div.setAttribute('class', 'view');
                let input = document.createElement('input');
                input.setAttribute('class','toggle');
                input.setAttribute('type','checkbox');
                input.addEventListener('click', () => {
                    let string = label.innerHTML;
                    if(input.checked){
                        label.innerHTML = string.strike();
                        let objectStore = db.transaction("todos","readwrite").objectStore("todos");
                        let entry = objectStore.get(todo.id);
                        entry.onsuccess = function() {
                            let data = entry.result;
                            data.done = true;
                            objectStore.put(data);
                        }
                    }
                    else if(!input.checked){
                        label.innerHTML = todo.todo;
                        let objectStore = db.transaction("todos","readwrite").objectStore("todos");
                        let entry = objectStore.get(todo.id);
                        entry.onsuccess = function() {
                            let data = entry.result;
                            data.done = false;
                            objectStore.put(data);
                        }
                    }
                });
                let label = document.createElement('label');
                label.innerHTML = todo.todo;
                let button = document.createElement('button');
                button.setAttribute('class','destroy');
                button.addEventListener('click', function () {
                    let id = newTodo.getAttribute('id');
                    let request = db.transaction(["todos"], "readwrite")
                        .objectStore("todos")
                        .delete(id);
                    request.onsuccess = function(event) {
                        newTodo.remove();
                    };

                });
                if(todo.done === true){
                    input.checked = true;
                    let string = label.innerHTML;
                    if(input.checked){
                        label.innerHTML = string.strike();
                    }
                }
                div.appendChild(input);
                div.appendChild(label);
                div.appendChild(button);
                newTodo.appendChild(div);


                let main = this.element.querySelector('.todo-list');
                main.appendChild(newTodo);
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