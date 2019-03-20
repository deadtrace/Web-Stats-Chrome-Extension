document.addEventListener("DOMContentLoaded", function() {
    getList(5, function(value) {
        let div = document.createElement("div");
        let hour = parseInt(value.time / 3600000);
        let min = parseInt(value.time % 3600000 / 60000);
        let sec = parseInt(value.time % 60000 / 1000);
        div.textContent = value.url+"-".repeat(5)+hour+"h "+min+"m "+sec+"s";
        document.getElementById("wrapper").appendChild(div);
    });
});