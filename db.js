console.log("db.js is loaded");

let db;

promiseDB = new Promise(function(resolve, reject) {
    let openRequest = window.indexedDB.open("store", 1);

    openRequest.onupgradeneeded = function(e) {
        db = e.target.result;
        let urlOS = db.createObjectStore('urlOS', { keyPath: "url" });
        urlOS.createIndex("urlIndex", "url", {unique: true});
        urlOS.createIndex("timeIndex", "time", {unique: false});
        console.log("Created urlOS and indexes");
    };
    
    openRequest.onsuccess = function(e) {
        db = e.target.result;
        console.log('db is gotten');
        resolve();
    }
    
    openRequest.onerror = function(e) {
        reject();
    }
});

function addTime(url, time) {
    promiseDB.then(function() {
        let tx = db.transaction(["urlOS"], "readwrite");
        let urlOS = tx.objectStore("urlOS");
        
        request1 = urlOS.get(url);
        request1.onsuccess = function(e) {
            let item = e.target.result;
            if (typeof item !== "undefined") {
                item.time += time;
            } else {
                item = {
                    url: url,
                    time: time
                }
            }
            let request2 = urlOS.put(item);
            request2.onsuccess = function(e) {
                console.log("added or changed item: ", item);
            }
            request2.onerror = function() {
                console.log("smth is wrong");
            }
        }
        request1.onerror = function(e) {
            console.log("smth is wrong");            
        }
        tx.oncomplete = function() {
            console.log('tx complete');
        }
    });
}

function clearDB(){
    promiseDB.then(function() {
        tx = db.transaction(["urlOS"], "readwrite");
        urlOS = tx.objectStore("urlOS");
        request = urlOS.clear();
        request.onsuccess = function(e) {
            console.log("DB was cleared");
        }
    });
}

function getList(callback) {
    promiseDB.then(function() {
        let tx = db.transaction(["urlOS"], "readonly");
        let urlOS = tx.objectStore("urlOS");
        let index = urlOS.index("timeIndex");
        index.openCursor(null, "prev").onsuccess = function(e) {
            var cursor = e.target.result;
            if (cursor) {
            callback(cursor.value);
            console.log(cursor.key, " ", cursor.value.time);
            cursor.continue();
            } else {
                console.log("All items were displayed")
            }
        }
    });
}