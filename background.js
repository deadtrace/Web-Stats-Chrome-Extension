console.log("background.js is loaded"); 

function time() { 
    return (new Date()).getTime(); 
} 

lastTime = time();
currentURL = "";

function shrinkURL(url) {
    return (new URL(url)).hostname;
}

// function getActiveURL(callback){
//     chrome.tabs.query({
//         active: true,
//         currentWindow: true
//     }, function(tabs) {
//         callback(shrinkURL(tabs[0].url));
//     })
//     console.log("where am i");
// }

function getActiveURLfromTabs(tabs) {
    for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].active) {
            return shrinkURL(tabs[i].url);
        }
    }
}

chrome.tabs.query({active: true}, function(tabs) {
    var t = tabs[0].url;
    currentURL = shrinkURL(t);
})

function changePage(tab) {
    if (currentURL != "") {
		console.log("you were on", currentURL, time() - lastTime, "ms");
	}
    lastTime = time();
    currentURL = shrinkURL(tab.url);
}

counter = 0 
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == "loading") {
        counter++; 
        console.log(""); 
        console.log(counter + " tab content changed at " + time()); 
        //console.log("tabId", tabId); 
        //console.log("changeInfo", changeInfo); 
        //console.log("tab", tab) 
        changePage(tab);
    };
}); 

chrome.tabs.onActivated.addListener((activeInfo) => { 
    counter++; 
    console.log(""); 
    console.log(counter + " tab activated at " + time()) 
    //console.log("activeInfo", activeInfo);
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        changePage(tabs[0])
    })
});


chrome.windows.onFocusChanged.addListener(function() {
    console.log("");
    chrome.windows.getCurrent({populate: true}, function(window) {
        counter++;
        console.log(counter, window.tabs);
        
        console.log(getActiveURLfromTabs(window.tabs));

        // getActiveURL(function(a, b) {
        //     console.log(a, b);
        // })



    });
});
/*
window.onblur = function() {
	counter++;
    console.log("");
    console.log("window is blured");
}
*/