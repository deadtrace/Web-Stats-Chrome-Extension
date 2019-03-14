console.log("background.js is loaded"); 

function time() { 
return (new Date()).getTime(); 
} 

lastTime = time();
currentURL = "";

function shrinkURL(url) {
    return (new URL(url)).hostname;
}

function changePage(tab) {
    console.log("you were on", currentURL, time() - lastTime, "ms");
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