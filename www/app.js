window.addEventListener("error" , onJsError);

const urlInput = document.getElementById("urlInput");
const audioPlayer = document.getElementById("audioPlayer");
const statusDiv = document.getElementById("statusDiv");
const loadAudio = document.getElementById("loadAudio");
const saveAudio = document.getElementById("saveAudio");
const downloadAudio = document.getElementById("downloadAudio");
const exitArea = document.getElementById("exitP");
const exitButton = document.getElementById("exitB");
exitArea.hidden = true;
logEventReplace("JS OK" , false);

function disableAllButtons() {
    downloadAudio.disabled = true;
    loadAudio.disabled = true;
    saveAudio.disabled = true;
}
disableAllButtons();

function reloadPage() {
    location.reload();
    window.Android.exit();
}

function exitState(state) {
    let newState = !state;
    exitArea.hidden = newState;
}

window.onInitialized = function () {
    enableAllButtons();

    //test capacitor
    try {
        let pName = Capacitor.getPlatform();
        logEvent("Platform : " + pName.toUpperCase());
        logEvent("Powered by Capacitor: 2026 EchoAI\u2122");
    }
    catch(e) {
        logEventReplace("[Capacitor] Environment is Incorrect : " + e.message, true);
        disableAllButtons();
        exitState(true);
    }
}


function onDownloadClick(url) {
    url = urlInput.value;
    window.Android.downloadToCache();
}

function onSaveClick() {
    window.Android.saveToMusic();
}

function onJsError(e) {
    //What happens when your js errors out
    logJsError(e);
    exitState(true);
    disableAllButtons();
}

//DO NOT TOUCH
function logJsError(e) {
    logEventReplace(e.message, true);
}
//DO NOT TOUCH 
function logEvent(event, isError) {
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
    statusDiv.appendChild(line);
}

//DO NOT TOUCH
function logEventReplace(event, isError) {
    statusDiv.innerHTML = "";
    logEvent(event, isError);
}

function enableAllButtons() {
    downloadAudio.disabled = false;
    loadAudio.disabled = false;
    saveAudio.disabled = false;
}


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

downloadAudio.addEventListener("click", onDownloadClick);
saveAudio.addEventListener("click", onSaveClick);
loadAudio.addEventListener("click", onLoadClick);
exitButton.addEventListener("click", reloadPage);



function jsIsReady() {
    //error android app out if true
    window.Android.onJsReady(false);
}

jsIsReady();
