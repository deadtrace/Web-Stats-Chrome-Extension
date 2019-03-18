console.log("db.js is loaded");

let db;

promiseDB = new Promise(function(resolve, reject) {
    // let dbPromise = new Promise(function(resolve, reject) {
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
            
        }
        tx.oncomplete = function() {
            console.log('tx complete');
        }
    });
}

addTime("vitaly.hard.dick.uk", 17000);
addTime("maidan.ua", 133700);
addTime("hltv.org", 999999);