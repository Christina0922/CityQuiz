package com.cityquiz.mobile

import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val webView = findViewById<WebView>(R.id.webView)

        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.allowFileAccess = true
        settings.allowFileAccessFromFileURLs = true
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true

        webView.webChromeClient = WebChromeClient()
        webView.webViewClient = WebViewClient()

        webView.loadUrl("file:///android_asset/dist/index.html")
    }
}

