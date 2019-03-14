console.log("background.js is loaded"); 

function time() { 
return (new Date()).getTime(); 
} 

lastTime = time();
currentURL = "";
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    currentURL = tabs[0].url;
})

function changePage(url) {
    console.log("you were on ", currentURL, time() - lastTime, "ms");
    lastTime = time();
    currentURL = url;
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
        changePage(tab.url);
    };
}); 

chrome.tabs.onActivated.addListener((activeInfo) => { 
    counter++; 
    console.log(""); 
    console.log(counter + " tab activated at " + time()) 
    //console.log("activeInfo", activeInfo);
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        changePage(tabs[0].url)
    })
});