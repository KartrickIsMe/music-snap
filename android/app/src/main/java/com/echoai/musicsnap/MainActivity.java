package com.echoai.musicsnap;

import com.getcapacitor.BridgeActivity;

import android.annotation.SuppressLint;
import android.webkit.JavascriptInterface;
import android.os.Bundle;

import com.yausername.youtubedl_android.YoutubeDL;
public class MainActivity extends BridgeActivity {

    @SuppressLint("JavascriptInterface")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getBridge().getWebView().addJavascriptInterface(this, "Android");
    }
    @JavascriptInterface
    public void downloadToCache() {

    }
    @SuppressLint("JavascriptInterface")
    @JavascriptInterface
    public void onJsReady(boolean testError) {
        if (testError) {
            throw new RuntimeException("Test Error");
        }
            new Thread(() -> {
                try {
                    YoutubeDL.getInstance().init(this);
                    runOnUiThread(() -> getBridge().getWebView().evaluateJavascript("onInitialized()" , null));
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }).start();
    }
    @JavascriptInterface
    public void exit() {
        runOnUiThread(() -> finish());
    }
}