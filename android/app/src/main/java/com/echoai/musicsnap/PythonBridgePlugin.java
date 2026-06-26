package com.echoai.musicsnap;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.JSObject;

import com.chaquo.python.Python;
import com.chaquo.python.android.AndroidPlatform;

@CapacitorPlugin(name = "PythonBridge")
public class PythonBridgePlugin extends Plugin {

    @PluginMethod
    public void greet(PluginCall call) {

        if (!Python.isStarted()) {
            Python.start(new AndroidPlatform(getContext()));
        }

        Python py = Python.getInstance();
        String result = py.getModule("hello")
                          .callAttr("greet")
                          .toString();

        JSObject ret = new JSObject();
        ret.put("value", result);

        call.resolve(ret);
    }
}
