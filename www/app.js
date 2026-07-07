const urlInput = document.getElementById("urlInput");
const audioPlayer = document.getElementById("audioPlayer");
const status = document.getElementById("status");

window.addEventListener("error" , logJsError);

function onButtonClick() {s
}










function logJsError(e) {
    let line = document.createElement("p");
    line.textContent = e.message + "\n";
    status.appendChild(line);
}

function logEvent(event) {
    let line = document.createElement("p");
    line.textContent = event;
    status.appendChild(line);
}