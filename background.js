console.log("background.js is loaded");

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
		"id": "list",
		"title": "Посмотреть полную статистику",
		"contexts": ["browser_action"]
	});
});

chrome.contextMenus.onClicked.addListener(function(clickData) {
	if (clickData.menuItemId == "list") {
        chrome.tabs.create({url: "list.html"});
    }
});

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

function changePage(url) {
    if (currentURL != "None") {
        console.log("you were on", currentURL, time() - lastTime, "ms");
        addTime(currentURL, time() - lastTime);
    }
    if (url == null) {
        currentURL = "None";
    } else {
        lastTime = time();
        currentURL = shrinkURL(url);
    }
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status == "complete" && tab.active) {
        changePage(tab.url);
    };
});

chrome.tabs.onActivated.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        changePage(tabs[0].url);
    })
});


chrome.windows.onFocusChanged.addListener((windowID) => {
    if (windowID == chrome.windows.WINDOW_ID_NONE) {
        //console.log("All windows lost focus");
        changePage(null);
    } else {
        chrome.windows.getLastFocused({ populate: true }, (window) => {
            changePage(getActiveTab(window.tabs).url);
        });
    }
});

