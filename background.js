console.log("background.js is loaded"); 

function time() { 
return (new Date()).getTime(); 
} 

counter = 0 
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => { 
    counter++; 
    console.log(""); 
    console.log(counter + " tab content changed at " + time()); 
    console.log("tabId", tabId); 
    console.log("changeInfo", changeInfo); 
    console.log("tab", tab) 
}); 

chrome.tabs.onActivated.addListener((activeInfo) => { 
    counter++; 
    console.log(""); 
    console.log(counter + " tab activated at " + time()) 
    console.log("activeInfo", activeInfo); 
});