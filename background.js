console.log("background.js is loaded"); 

function time() { 
    return (new Date()).getTime(); 
} 

lastTime = time();
currentURL = "None";

function shrinkURL(url) {
    return (new URL(url)).hostname;
}

function getActiveTab(tabs) {
    for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].active) {
            return tabs[i];
        }
    }
}

function stopTracking() {
    if (currentURL != "None") {
		console.log("you were on", currentURL, time() - lastTime, "ms");
    }
    currentURL = "None";
}

function changePage(tab) {
    if (currentURL != "None") {
		console.log("you were on", currentURL, time() - lastTime, "ms");
	}
    lastTime = time();
    currentURL = shrinkURL(tab.url);
}

counter = 0 
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == "complete") {
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
    chrome.windows.getLastFocused({populate: true}, function(window) {
        if (window.focused){
        counter++;
        console.log(counter, window);
        changePage(getActiveTab(window.tabs));
        } else {
            console.log("You're unfocused from Chrome now");
            stopTracking();
        }
    });
});
