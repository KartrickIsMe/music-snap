window.addEventListener("error" , onJsError);

const appState = {
    hasError: false,
    isDownloading: false,
    testMode: false,
    isCancel: false,
}

//don't enable for production!
let testModeCanBeEnabled = true;
appState.testMode = false;
const testAudioPath = "./testMode/audio.mp3";
//it's for testing interface in browser.

let extention = "bestaudio[ext!=webm]/bestaudio";
let defaultDownloadText = "Download Audio";
//let downloadAudioCanBeEnabled = false;

const urlInput = document.getElementById("urlInput");
const audioPlayer = document.getElementById("audioPlayer");
const statusDiv = document.getElementById("statusDiv");
const loadAudio = document.getElementById("loadAudio");
const saveAudio = document.getElementById("saveAudio");
const downloadAudio = document.getElementById("downloadAudio");
const exitArea = document.getElementById("exitP");
const exitButton = document.getElementById("exitB");
const testModeEnable = document.getElementById("testModeEnable");
const reloadButton = document.getElementById("reloadB");
const testArea = document.getElementById("OR_text");
const appInterface = document.getElementById("appInterface");
const appBody = document.getElementById("appBody");
const background = document.getElementById("background");
exitArea.hidden = true;
appInterface.hidden = false;
audioPlayer.style.display = "none";

function render() {
    downloadAudio.disabled = appState.hasError || appState.isCancel;
    saveAudio.disabled = appState.hasError;
    loadAudio.hidden = !appState.testMode;
    testMode = appState.testMode;
    if(appState.isCancel) {
        downloadAudio.style.backgroundColor = "";
        downloadAudio.textContent = "Cancelling...";
    }
    else if(appState.isDownloading) {
        downloadAudio.removeEventListener("click", sendToDownload);
        downloadAudio.addEventListener("click", cancelDownload);
        downloadAudio.style.backgroundColor = "#FF474C";
        downloadAudio.textContent = "Cancel Download";
    }
    else {
        downloadAudio.removeEventListener("click", cancelDownload);
        downloadAudio.addEventListener("click", sendToDownload);
        downloadAudio.style.backgroundColor = "";
        downloadAudio.textContent = defaultDownloadText;
    }
}

//DO NOT TOUCH 
window.logEvent = function (event, isError) {
    let line = document.createElement("p");
    line.textContent = event;
    if (isError == true) {
        line.style.color = "#FF474C";
    }
    else if (isError == false) {
        line.style.color = "lightgreen"
    }
    else if (isError === "warn") {
        line.style.color = "yellow";
    }
    else if (isError === "verbose") {
        line.style.color = "#3a3a3aff";
    }
    else {
        line.style.color = "white";
    }
    statusDiv.prepend(line);
}

logEventReplace("JS OK" , false);

/*
function disableAllButtons() {
    downloadAudio.disabled = true;
    downloadAudioCanBeEnabled = false;
    loadAudio.disabled = true;
    saveAudio.disabled = true;
}
disableAllButtons();
*/

appState.hasError = true;
render();

function reloadPage() {
    location.reload();
}

function exitPage() {
    try {
        window.Android.exit();
    }
    catch (e) {
        //Do nothing, its for browser.
    }
    finally {
        reloadPage();
    }
}

function exitState(state) {
    let newState = !state;
    exitArea.hidden = newState;
}

function causeErrors(isError) {
    appBody.style.background = "#170000ff";
        if (testModeCanBeEnabled == false) {
            testArea.hidden = true;
        }
        exitState(isError);
        appInterfaceState(!isError);
        appState.hasError = isError;
        render();
}

window.onInitialized = function () {
    appState.hasError = false;
    render();
    if (testMode == false) {
        //test capacitor
        let pName = Capacitor.getPlatform();
        logEvent("CAP OK", false);
        logEvent("Platform : " + pName.toUpperCase());
        logEvent("Powered by Capacitor: 2026 EchoAI\u2122");
    }
    else {
        logEvent("TEST MODE", true);
    }
}


function onDownloadClick(url) {
    //url = url.toLowerCase();
    if (testMode == false) {
        window.Android.downloadToCache(url, extention);
    }
    else if(testMode == true) {
       logEventReplace("TEST DOWNLOAD : " + url);
    }
}

function onSaveClick() {
    if (testMode == false) {
        window.Android.saveToMusic();
    }
    else {
        logEventReplace("TEST SAVE");
    }
}

function appInterfaceState (isVisible) {
    appInterface.style.display = isVisible ? "" : "none";
}

function onJsError(e) {
    //What happens when your js or app errors out
    if (testMode == false) {
        logJsError(e);
        appBody.style.background = "#170000ff";
        causeErrors(true);
    }
}

function logJsError(e) {
    logEvent(e.message, true);
}


//DO NOT TOUCH
function logEventReplace(event, isError) {
    statusDiv.innerHTML = "";
    logEvent(event, isError);
}

/*
function enableAllButtons() {
    downloadAudio.disabled = false;
    downloadAudioCanBeEnabled = true;
    loadAudio.disabled = false;
    saveAudio.disabled = false;
}
*/

//aka audio player, android callable
window.onLoadClick = async function (nativeFilePath) {
    audioPlayer.style.display = "";
    if(testMode == false) {
        try {
            webFilePath = Capacitor.convertFileSrc(nativeFilePath);
            logEvent(webFilePath);
            if(nativeFilePath) {
                audioPlayer.src = webFilePath;
               await audioPlayer.load();
            }
            else {
                logEventReplace("Audio not found", true);
            }
        }
        catch(e) {
            logEventReplace(e.message, true);
        }
    }
    else {
        audioPlayer.src = testAudioPath;
        audioPlayer.load();
        logEventReplace("TEST AUDIO", false);
    }
}

/*
function wait(timeMs) {
    return new Promise();
}
*/

function enableTestMode() {
        appState.testMode = true;
        render();
        causeErrors(false);
        logEventReplace("TEST MODE", false);
        appBody.style.background = "";
}

downloadAudio.addEventListener("click", sendToDownload);
downloadAudio.textContent = defaultDownloadText;
saveAudio.addEventListener("click", onSaveClick);
loadAudio.addEventListener("click", onLoadClick);
exitButton.addEventListener("click", exitPage);
testModeEnable.addEventListener("click", enableTestMode);

function sendToDownload() {
    let url = urlInput.value;
    onDownloadClick(url);
}

function jsIsReady() {
    //error android app out if true
    if (testMode == false) {
        try {
            window.Android.onJsReady(false);
            //then android calls onInitialized()
        }
        catch(e) {
            onJsError(e);
            logEvent("Are you Android or not?", "warn");
        }
    }
    else {
        onInitialized();
    }
}

window.downloadState = function(state) {
    if(state === "LOCK") {
        appState.isDownloading = true;
    }
    else if(state === "UNLOCK") {
       appState.isDownloading = false;
       appState.isCancel = false;
    }
    render();
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function cancelDownload() {
    appState.isCancel = true;
    render();
    await wait(250);
    window.Android.abortDownload();
}

window.downloadProgress = function(progress) {
    background.style.opacity = "0.5";
    background.style.height = progress + "%";
}

window.onDownloadComplete = async function(isError) {
    if (isError) {
        background.style.background = "red";
    }
    await wait(1000);
    background.style.opacity = "0";
    await wait(1000);
    background.style.height = "0%";
    background.style.background = "green";
}

jsIsReady();