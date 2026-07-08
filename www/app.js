window.addEventListener("error" , logJsError);

const urlInput = document.getElementById("urlInput");
const audioPlayer = document.getElementById("audioPlayer");
const statusDiv = document.getElementById("statusDiv");
const loadAudio = document.getElementById("loadAudio");
const saveAudio = document.getElementById("saveAudio");
const downloadAudio = document.getElementById("downloadAudio");

logEventReplace("JsReady" , false);

function disableAllButtons() {
    downloadAudio.disabled = true;
    loadAudio.disabled = true;
    saveAudio.disabled = true;
}

disableAllButtons();

function onDownloadClick(url) {
    url = urlInput.value;
    window.Android.downloadToCache();
}

function onSaveClick() {
    window.Android.saveToMusic();
}


function logJsError(e) {
    logEventReplace(e.message, true);
}

function logEvent(event, isError) {
    let line = document.createElement("p");
    line.textContent = event;
    if (isError){
        line.style.color = "red";
    }
    statusDiv.appendChild(line);
}

function logEventReplace(event, isError) {
    let line = document.createElement("p");
    line.textContent = event;
    if (isError == true) {
        line.style.color = "red";
    }
    else if (isError == false) {
        line.style.color = "green"
    }
    else {
        line.style.color = "black";
    }
    statusDiv.innerHTML = "";
    statusDiv.appendChild(line);
}

window.onInitialized = function () {
    enableAllButtons();
}

/*try {
    const { Capacitor } = require("@capacitor/core");
}
catch(e) {
    logEventReplace("[Capacitor] Environment is Incorrect : " + e.message, true);
    disableAllButtons();

}*/

function onLoadClick(nativeFilePath) {
    try {
        webFilePath = Capacitor.convertFileSrc(nativeFilePath);
        audioPlayer.src = webFilePath;
        audioPlayer.load();
    }
    catch(e) {
        logEventReplace(e.message, true);
    }
}

function wait(timeMs) {
    return new Promise();
}

function enableAllButtons() {
    downloadAudio.disabled = false;
    loadAudio.disabled = false;
    saveAudio.disabled = false;
}

downloadAudio.addEventListener("click", onDownloadClick);
saveAudio.addEventListener("click", onSaveClick);
loadAudio.addEventListener("click", onLoadClick);





