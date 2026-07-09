window.addEventListener("error" , onJsError);

//don't enable for production!
let testMode = false;
const testAudioPath = "./testMode/audio.mp3";
//it's for testing interface in browser.

const urlInput = document.getElementById("urlInput");
const audioPlayer = document.getElementById("audioPlayer");
const statusDiv = document.getElementById("statusDiv");
const loadAudio = document.getElementById("loadAudio");
const saveAudio = document.getElementById("saveAudio");
const downloadAudio = document.getElementById("downloadAudio");
const exitArea = document.getElementById("exitP");
const exitButton = document.getElementById("exitB");
const testModeToggle = document.getElementById("testModeToggle");
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
    if (testMode == false) {
            //test capacitor
        try {
            let pName = Capacitor.getPlatform();
            logEvent("CAP OK", false);
            logEvent("Platform : " + pName.toUpperCase());
            logEvent("Powered by Capacitor: 2026 EchoAI\u2122");
        }
        catch(e) {
            logEventReplace("[Capacitor] Environment is Incorrect : " + e.message, true);
            disableAllButtons();
            exitState(true);
        }
    }
    else {
        logEvent("CAP UNAVAILABLE IN TEST MODE", true);
    }
}


function onDownloadClick(url) {
    if (testMode == false) {
        url = urlInput.value;
        window.Android.downloadToCache();
    }
    else {
       logEventReplace("TEST DOWNLOAD"); 
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

function onJsError(e) {
    //What happens when your js or app errors out
    if (testMode == false) {
        logJsError(e);
        exitState(true);
        disableAllButtons();
    }
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
    statusDiv.prepend(line);
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
    if(testMode == false) {
        try {
            webFilePath = Capacitor.convertFileSrc(nativeFilePath);
            audioPlayer.src = webFilePath;
            audioPlayer.load();
        }
        catch(e) {
            logEventReplace(e.message, true);
        }
    }
    else {
        logEventReplace("TEST AUDIO LOADING");
        audioPlayer.src = testAudioPath;
        audioPlayer.load();
        logEventReplace("TEST AUDIO LOADED", false);
    }
}

function wait(timeMs) {
    return new Promise();
}

function toggleTestMode() {
    testMode = !testMode;
    enableAllButtons();
    exitState(false);
    if(testMode) {
        logEventReplace("TEST MODE ON", false);
    }
    else {
        logEventReplace("TEST MODE OFF", true);
    }
}

downloadAudio.addEventListener("click", onDownloadClick);
saveAudio.addEventListener("click", onSaveClick);
loadAudio.addEventListener("click", onLoadClick);
exitButton.addEventListener("click", reloadPage);
testModeToggle.addEventListener("click", toggleTestMode);



function jsIsReady() {
    //error android app out if true
    if (testMode == false) {
        window.Android.onJsReady(false);
    }
    else {
        onInitialized();
    }
}

jsIsReady();
