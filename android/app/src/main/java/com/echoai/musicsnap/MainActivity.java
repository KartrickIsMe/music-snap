//package id of app
package com.echoai.musicsnap;

//the main layer between android and JavaScript
import com.getcapacitor.BridgeActivity;

//suppress Js method errors in ide as they are not here
import android.annotation.SuppressLint;
//allow js to execute functions with this annotation
import android.webkit.JavascriptInterface;
//preserve state of application e.g. when screen is rotated
import android.os.Bundle;
//import android.content.Context;

//file purpose
import java.io.File;
//import java.io.IOException;

import java.util.concurrent.atomic.AtomicBoolean;
//heart of media download
import com.yausername.youtubedl_android.YoutubeDL;
//handle exceptions caused by this library
import com.yausername.youtubedl_android.YoutubeDLException;
//send request to download media
import com.yausername.youtubedl_android.YoutubeDLRequest;
//receive the response from external sources
import com.yausername.youtubedl_android.YoutubeDLResponse;
//get information about the media to be downloaded
import com.yausername.youtubedl_android.mapper.VideoInfo;
//quote the strings for JavaScript
import org.json.JSONObject;

//a function of the library returns this
import kotlin.Unit;

//main activity of app
public class MainActivity extends BridgeActivity {

    //store extension of the media
    String ext;
    //store ID of media
    String id;
    //store title of media
    String title;
    //store process ID of media
    String pid = "YT-" + System.currentTimeMillis();
    //store download location of media
    private String loc;
    public boolean isDownloading = false;
    //download related
    AtomicBoolean shouldStop = new AtomicBoolean();

    //suppress js errors in ide
    @SuppressLint("JavascriptInterface")
    //execute this method before parent class
    @Override
    //when the app is opened
    protected void onCreate(Bundle savedInstanceState) {
        //call capacitor to create it's webview
        super.onCreate(savedInstanceState);
        //assign the location of the media to be downloaded
        loc = getCacheDir().getAbsolutePath() + "/music";
        //add the JavaScript bride to "this" class with the name "Android"
        runOnUiThread(() -> getBridge().getWebView().addJavascriptInterface(this, "Android"));
    }

    //JavaScript callable method
    @JavascriptInterface
    //download and save the media to music folder inside app cache
    public void downloadToCache(String url, String format) {
        //do not except an empty url
        if(url == null || url.isEmpty() || isDownloading) {
            logEvent("Empty URL" , "warn");
            return;
        }
        shouldStop.set(false);
        download(STATE.LOCK);
        isDownloading = true;
        //this thing loves to touch network and haywire your phone(app not responding)
        //so run it on a new thread
        new Thread(() -> {
            try {
                //log the url
                logEvent("URL IS : " + url, "false");
                //create the music directory if it does not exist
                File cacheDir = new File(loc);
                boolean isDirectoryPresent = cacheDir.mkdirs();
                //log internally if it was present
                System.out.println("MKDIRS : " + isDirectoryPresent);
                //get information about the video to be downloaded and log it
                logEvent("FETCHING INFO..." , "warn");
                getMediaInfo(url, format);
                if(shouldStop.get()) {
                    logEvent("DOWNLOAD CANCELLED", "warn");
                    return;
                }

                logEvent("TITLE : " + title + " EXTENSION : " + ext, "false");

                //create a primary request especially for downloading
                //as the first one gets malformed
                YoutubeDLRequest request1 = new YoutubeDLRequest(url);
                request1.addOption("-f" ,format);
                request1.addOption("-o", loc + "/%(id)s.%(ext)s");

                logEvent("DOWNLOADING..." , "warn");
                YoutubeDLResponse response = YoutubeDL.getInstance().execute(request1, pid, (progress, eta, message) ->
                {
                    if(progress == -1.0) {
                        logEvent(message, "warn");
                    }
                    else {
                        logEvent(progress + "% Downloaded", "false");
                    }
                    return Unit.INSTANCE;
                });
                System.out.println(response.getOut());
            } catch (YoutubeDLException e) {
                logEvent("ERROR GETTING INFO : " + e.getMessage(), "true");
                return;
            }
            catch (InterruptedException e) {
                logEvent("DOWNLOAD INTERRUPTED : " + e.getMessage(), "warn");
                return;
            }
            catch (YoutubeDL.CanceledException e) {
                logEvent("DOWNLOAD CANCELLED", "warn");
                return;
            }
            /*catch (IOException e) {
                logEvent("IO ERROR : " + e.getMessage(), "true");
                causeErrors();
                return;
            }*/
            catch (Exception e) {
                logEvent("JAVA ERROR : " + e.getMessage(), "true");
                causeErrors();
                return;
            }
            finally{
                download(STATE.UNLOCK);
                isDownloading = false;
                shouldStop.set(false);
            }
            logEvent("DOWNLOAD SUCCESSFUL" , "false");
            callJsAudio(loc + "/" + id + "." + ext);
        }).start();
    }

    @JavascriptInterface
    public void callJsAudio(String fileLoc) {
        String safeFileLoc = JSONObject.quote(fileLoc);
        runOnUiThread(() -> getBridge().getWebView().evaluateJavascript("onLoadClick("+ safeFileLoc +")", null));
    }

    public void getMediaInfo(String url, String format) throws YoutubeDLException, InterruptedException, YoutubeDL.CanceledException {
        //create a request for getting info about media
        YoutubeDLRequest request2 = new YoutubeDLRequest(url);
        //get info about the media with these args
        request2.addOption("-f", format);
        //create a VideoInfo object
        VideoInfo info = YoutubeDL.getInstance().getInfo(request2);
        //assign the values to the identifiers
        title = info.getTitle();
        ext = info.getExt();
        id = info.getId();
        pid = "YT-" + System.currentTimeMillis();
    }

    //After the frontend has loaded.
    //This is for suppressing ide warnings
    @SuppressLint("JavascriptInterface")
    //This makes the function callable from js
    @JavascriptInterface
    public void onJsReady(boolean testError) {
        //throwable for testing purpose
        if (testError) {
            throw new RuntimeException("TEST ERROR");
        }
            //new thread so that the app does not freeze
            new Thread(() -> {
                //it can throw an exception
                try {
                    //initialize the lib like extracting python things...
                    YoutubeDL.getInstance().init(this);
                    //update yt-dlp on start
                    YoutubeDL.getInstance().updateYoutubeDL(this, YoutubeDL.UpdateChannel._STABLE);
                    //once it is done, we tell js it's ready through a helper function
                    androidReady();
                    //if a lib or java error occurs, catch it
                } catch (YoutubeDLException e) {
                    //print the cause
                    logEvent("YTDL FAIL : " + e.getMessage() , "true");
                    causeErrors();
                    return;
                } catch (Exception e) {
                    //print the cause
                    logEvent("JAVA ERROR : " + e.getMessage(), "true");
                    causeErrors();
                    return;
                }
                    //once it's done we log
                    logEvent("YTDL OK", "false");
            }).start();
    }

    //js can call this to exit the app
    @JavascriptInterface
    public void exit() {
        runOnUiThread(this::finish);
    }

    //android can call this to log events to js
    public void logEvent(String event, String isError){

        //quote the event for js so it does not freak out
        String safe = JSONObject.quote(event);
        String error;
        if(isError.equals("warn")){
            //if it is "warn", we pass "warn"
            error = JSONObject.quote(isError);
        }
        else {
            //for true and false, we just pass 'true' or 'false' directly
            error = isError;
        }
        //heart of the mechanism
        runOnUiThread(() -> getBridge().getWebView().evaluateJavascript("logEvent(" + safe + " , " + error + ")", null));
    }

    //android calls this to send ready signal to js
    void androidReady() {
        //initialize frontend ui when this method is called
        runOnUiThread(() -> getBridge().getWebView().evaluateJavascript("onInitialized()" , null));
    }

    void causeErrors() {
        runOnUiThread(() -> getBridge().getWebView().evaluateJavascript("causeErrors("+ true  +")", null));
    }

    public enum STATE  {LOCK , UNLOCK}
    void download(STATE state) {
        String safe;
        if(state == STATE.LOCK) {
            safe = JSONObject.quote("LOCK");
        }
        else {
            safe = JSONObject.quote("UNLOCK");
        }
        runOnUiThread(() -> getBridge().getWebView().evaluateJavascript("downloadState("+ safe +")", null));
    }

    @JavascriptInterface
    public void abortDownload() {
        try {
            YoutubeDL.getInstance().destroyProcessById(pid);
            shouldStop.set(true);
            logEvent("TRYING TO CANCEL DOWNLOAD...", "warn");

        }
        catch (Exception e) {
            logEvent("CANCELLATION FAILED", "true");
        }
    }
}