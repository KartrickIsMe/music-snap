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
        new Thread( () -> {
            getBridge().getWebView().addJavascriptInterface(this, "Android");
            try {
                YoutubeDL.getInstance().init(this);
            } catch (Exception e) {
                e.printStackTrace();
            }
            finally {
                getBridge().getWebView().evaluateJavascript("onInitialized()" , null);
            }
        }).start();
    }
    @JavascriptInterface
    public void downloadToCache() {

    }
}