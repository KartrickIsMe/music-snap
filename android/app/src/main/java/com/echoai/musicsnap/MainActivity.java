package com.echoai.musicsnap;

import com.getcapacitor.BridgeActivity;

import android.annotation.SuppressLint;
import android.webkit.JavascriptInterface;
import android.os.Bundle;
//import android.content.Context;

import java.io.File;
//import java.io.IOException;

import com.yausername.youtubedl_android.YoutubeDL;
import com.yausername.youtubedl_android.YoutubeDLException;
import com.yausername.youtubedl_android.YoutubeDLRequest;
import com.yausername.youtubedl_android.mapper.VideoInfo;
import org.json.JSONObject;

import kotlin.Unit;

public class MainActivity extends BridgeActivity {

    String ext;
    String id;
    String title;
    String pid;
    private String loc;

    @SuppressLint("JavascriptInterface")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        loc = getCacheDir().getAbsolutePath() + "/music";
        runOnUiThread(() -> getBridge().getWebView().addJavascriptInterface(this, "Android"));
    }
    @JavascriptInterface
    public void downloadToCache(String url) {
        if(url == null || url.isEmpty()) {
            logEvent("Empty URL" , "warn");
            return;
        }

        try {
            File cacheDir = new File(loc);

            YoutubeDLRequest request1 = new YoutubeDLRequest(url);
            request1.addOption("-f" + "bestaudio[ext!=webm]", "-o");
            request1.addOption(cacheDir.getAbsolutePath(), "/%(id)s.%(ext)s");

            YoutubeDLRequest request2 = new YoutubeDLRequest(url);
            request2.addOption("-f" + "bestaudio[ext=!webm]");

            VideoInfo info = YoutubeDL.getInstance().getInfo(request2);

            title = info.getTitle();
            ext = info.getExt();
            id = info.getId();
            pid = "YT-" + System.currentTimeMillis();

            YoutubeDL.getInstance().execute(request1, pid, false,(progress, eta, message) -> Unit.INSTANCE);
        } catch (YoutubeDLException e) {
            logEvent("Error getting info: " + e.getMessage() , "true");
        }
        catch (InterruptedException e) {
            logEvent("Video Download was interrupted : " + e.getMessage(), "warn");
        }
        catch (YoutubeDL.CanceledException e) {
            logEvent("Video Download was cancelled : " + e.getMessage(), "warn");
        }
        /*catch (IOException e) {
            logEvent("IO Error : " + e.getMessage(), "true");
        }*/
        catch (Exception e) {
            logEvent("Java Error : " + e.getMessage(), "true");
        }
    }
    @SuppressLint("JavascriptInterface")
    @JavascriptInterface
    public void onJsReady(boolean testError) {
        if (testError) {
            throw new RuntimeException("Test Error");
        }
            new Thread(() -> {
                try {
                    androidReady();
                    logEvent("YTDL WAIT" , "warn");
                    YoutubeDL.getInstance().init(this);
                } catch (YoutubeDLException e) {
                    logEvent("Error initializing YoutubeDL: " + e.getMessage() , "true");
                } catch (Exception e) {
                    logEvent("Java Error : " + e.getMessage(), "true");
                }
                logEvent("YTDL OK", "false");
            }).start();
    }
    @JavascriptInterface
    public void exit() {
        runOnUiThread(this::finish);
    }
    public void logEvent(String event, String isError){
        String safe = JSONObject.quote(event);
        String error;
        if(isError.equals("warn")){
            error = JSONObject.quote(isError);
        }
        else {
            error = isError;
        }
        runOnUiThread(() -> getBridge().getWebView().evaluateJavascript("logEvent(" + safe + " , " + error + ")", null));
    }
    
    void androidReady() {
        runOnUiThread(() -> getBridge().getWebView().evaluateJavascript("onInitialized()" , null));
    }
}