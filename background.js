console.log("background.js is loaded"); 

function time() { 
    return (new Date()).getTime(); 
} 

lastTime = time();
currentURL = "None";

function shrinkURL(url) {
    return (new URL(url)).hostname;
};

function getActiveTab(tabs) {
    for (i in tabs) {
        if (tabs[i].active) {
            return tabs[i];
        }
    }
};

function stopTracking() {
    if (currentURL != "None") {
		console.log("you were on", currentURL, time() - lastTime, "ms");
    }
    currentURL = "None";
};

function changePage(tab) {
    if (currentURL != "None") {
		console.log("you were on", currentURL, time() - lastTime, "ms");
	}
    lastTime = time();
    currentURL = shrinkURL(tab.url);
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == "complete" && tab.active) {
            changePage(tab);
        };
}); 

chrome.tabs.onActivated.addListener(() => { 
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        changePage(tabs[0]);
    })
});


chrome.windows.onFocusChanged.addListener((windowID) => {
    if (windowID == chrome.windows.WINDOW_ID_NONE){
        //console.log("All windows lost focus");
        stopTracking();
    } else {
        chrome.windows.getLastFocused({populate: true}, (window) => {
            changePage(getActiveTab(window.tabs));
        });
    }
});

