console.log("background.js is loaded");

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
		"id": "list",
		"title": "Посмотреть полную статистику",
		"contexts": ["browser_action"]
    });
    chrome.browserAction.setBadgeText({ 'text': '?'});
    chrome.browserAction.setBadgeBackgroundColor({ 'color': "black" });
});

chrome.contextMenus.onClicked.addListener(function(clickData) {
	if (clickData.menuItemId == "list") {
        chrome.tabs.create({url: "list.html"});
    }
});

function time() {
    return (new Date()).getTime();
}

function badgeTime(time) {
    let m = parseInt(time / 60000);
    if (m == 0){
        return parseInt(time / 1000)+"s";
    } else {
        return m+"m";
    }
}

function shrinkURL(url) {
    return (new URL(url)).hostname;
};

let lastTime = time();
let currentURL;
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    currentURL = shrinkURL(tabs[0].url);
})

function UpdateBadge() {
    var now = time();
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (typeof tabs[0] !== "undefined" && lastState){
            chrome.browserAction.setBadgeText({ 'tabId': tabs[0].id, 'text': badgeTime(now - lastTime)});
        }
    });
}

setInterval(UpdateBadge, 1000);

function getActiveTab(tabs) {
    for (i in tabs) {
        if (tabs[i].active) {
            return tabs[i];
        }
    }
};

function changePage(url) {
    if (currentURL == url) {
        return;
    }
    if (currentURL != "None") {
        console.log("you were on", currentURL, time() - lastTime, "ms");
        addTime(currentURL, time() - lastTime);
    }
    if (url == null) {
        currentURL = "None";
    } else {
        currentURL = url;
    }
    lastTime = time();
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == "complete" && tab.active) {
        changePage(shrinkURL(tab.url));
    };
});

chrome.tabs.onActivated.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        changePage(shrinkURL(tabs[0].url));
    })
});


chrome.windows.onFocusChanged.addListener((windowID) => {
    if (windowID != chrome.windows.WINDOW_ID_NONE) {
        chrome.windows.getLastFocused({ populate: true }, (window) => {
            changePage(shrinkURL(getActiveTab(window.tabs).url));
        });
    } else {
        changePage(null);
    }
});

var lastState = true;
function checkBrowserFocus(){
    chrome.windows.getAll({ populate: true }, function(windows) {
        if (lastState) { 
            for (i in windows) { //все расфокус
                if (windows[i].focused) {
                    return;
                }
            }
            changePage(null);
            lastState = false;
        }
        
        if (!lastState) { //происходит фокус и если был расфокус
            for (i in windows) {
                if (windows[i].focused) {
                    changePage(shrinkURL((getActiveTab(windows[i].tabs)).url));
                    lastState = true;
                    break;
                }
            }
        }
    })
}

window.setInterval(checkBrowserFocus, 1000);  

