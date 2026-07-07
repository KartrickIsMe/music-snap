package com.echoai.musicsnap;

import com.getcapacitor.BridgeActivity;
import android.webkit.JavascriptInterface;
import android.os.Bundle;

import com.yausername.youtubedl_android.YoutubeDL;
public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            YoutubeDL.getInstance().init(this);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}