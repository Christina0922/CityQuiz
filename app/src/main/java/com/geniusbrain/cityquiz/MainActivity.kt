package com.geniusbrain.cityquiz

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.webkit.ConsoleMessage
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)

        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true

        // 파일 기반 앱 구조에서 필요한 설정
        settings.allowUniversalAccessFromFileURLs = true
        settings.allowFileAccessFromFileURLs = true
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW

        webView.webViewClient = object : WebViewClient() {

            override fun onReceivedError(
                view: WebView,
                request: WebResourceRequest,
                error: WebResourceError
            ) {
                Log.e("WebViewError", "Error: ${error.description}")
                Log.e("WebViewError", "Failed URL: ${request.url}")
            }

            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {

                val url = request?.url?.toString() ?: return false
                Log.d("WebView", "Loading URL: $url")

                // 쿠팡 앱 전용 스킴 처리
                if (url.startsWith("coupang://")) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)

                        // 쿠팡 앱 설치 여부 확인
                        if (intent.resolveActivity(packageManager) != null) {
                            startActivity(intent)
                        } else {
                            val fallbackUrl = extractFallbackUrl(url)
                            if (fallbackUrl != null) {
                                val fallbackIntent = Intent(Intent.ACTION_VIEW, Uri.parse(fallbackUrl))
                                fallbackIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                startActivity(fallbackIntent)
                            } else {
                                val webIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.coupang.com"))
                                webIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                startActivity(webIntent)
                            }
                        }
                        return true

                    } catch (e: Exception) {
                        Log.e("WebView", "Error opening Coupang link: ${e.message}")
                        val webIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.coupang.com"))
                        webIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        startActivity(webIntent)
                        return true
                    }
                }

                // 모든 외부 http/https 링크는 외부 브라우저에서 열기
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    try {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        startActivity(intent)
                        Log.d("WebView", "Opening external URL: $url")
                        return true
                    } catch (e: Exception) {
                        Log.e("WebView", "External link open failed: ${e.message}")
                        return false
                    }
                }

                return false
            }
        }

        // JS 로그 확인용
        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
                Log.d(
                    "JSConsole",
                    "${consoleMessage.message()} (line ${consoleMessage.lineNumber()}, ${consoleMessage.sourceId()})"
                )
                return true
            }
        }

        // ⭐ WebView가 실제로 읽어야 하는 경로 (핵심 변경 부분)
        // dist/index.html을 로드하도록 수정 완료
        webView.loadUrl("file:///android_asset/dist/index.html")
    }

    /**
     * coupang:// URL에서 fallback 파라미터 추출하기
     */
    private fun extractFallbackUrl(coupangUrl: String): String? {
        try {
            val uri = Uri.parse(coupangUrl)
            val fallback = uri.getQueryParameter("fallback")
            if (fallback != null) return Uri.decode(fallback)
        } catch (e: Exception) {
            Log.e("WebView", "Fallback URL parse error: ${e.message}")
        }
        return null
    }
}
