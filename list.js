getList(function(value) {
    let div = document.createElement("div");
    let hour = parseInt(value.time / 3600000);
    let min = parseInt(value.time % 3600000 / 60000)
    let sec = parseInt(value.time % 60000 / 1000);
    div.textContent = value.url+"-----------------"+hour+"h "+min+"m "+sec+"s";
    document.body.appendChild(div);
});

//developers.google.com 1339s
//youtube.com 2134s
//wiki 2830s