document.addEventListener("DOMContentLoaded", function() {
    getList(null, function(value) {
        let div = document.createElement("div");
        let hour = parseInt(value.time / 3600000);
        let min = parseInt(value.time % 3600000 / 60000);
        let sec = parseInt(value.time % 60000 / 1000);
        div.textContent = value.url+"-".repeat(20)+hour+"h "+min+"m "+sec+"s";
        document.body.appendChild(div);
    });
    
    let badgecheck = document.getElementById("badge");

    chrome.storage.sync.get("badge", function(elem) {
		badgecheck.checked = elem.badge;
    });
    badgecheck.addEventListener("click", function() {
		chrome.storage.sync.set({"badge": badgecheck.checked});
	});

    document.getElementById("reset").addEventListener("click", function() {
        clearDB();
        alert("Web Stats History was cleared");
        location.reload();
    })
});