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

        // **CORS 해결 요소**
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

                // coupang:// 스킴 처리
                if (url.startsWith("coupang://")) {
                    try {
                        // 쿠팡 앱으로 열기 시도
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                        
                        // 쿠팡 앱이 설치되어 있는지 확인
                        if (intent.resolveActivity(packageManager) != null) {
                            startActivity(intent)
                        } else {
                            // 쿠팡 앱이 없으면 fallback URL 추출 시도
                            // URL에서 fallback 파라미터 찾기
                            val fallbackUrl = extractFallbackUrl(url)
                            if (fallbackUrl != null) {
                                val fallbackIntent = Intent(Intent.ACTION_VIEW, Uri.parse(fallbackUrl))
                                fallbackIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                startActivity(fallbackIntent)
                            } else {
                                // fallback이 없으면 쿠팡 웹사이트로 이동
                                val webIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.coupang.com"))
                                webIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                startActivity(webIntent)
                            }
                        }
                        return true
                    } catch (e: Exception) {
                        Log.e("WebView", "Error opening Coupang link: ${e.message}")
                        // 에러 발생 시 쿠팡 웹사이트로 이동
                        try {
                            val webIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.coupang.com"))
                            webIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                            startActivity(webIntent)
                        } catch (e2: Exception) {
                            Log.e("WebView", "Error opening Coupang website: ${e2.message}")
                        }
                        return true
                    }
                }

                // http:// 또는 https:// 외부 링크 처리
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    // 쿠팡 링크는 외부 브라우저로 열기
                    if (url.contains("coupang.com") || url.contains("link.coupang.com")) {
                        try {
                            val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                            startActivity(intent)
                            return true
                        } catch (e: Exception) {
                            Log.e("WebView", "Error opening external link: ${e.message}")
                            return false
                        }
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

        // 파일 로드
        webView.loadUrl("file:///android_asset/index.html")
    }

    /**
     * coupang:// URL에서 fallback URL 추출
     */
    private fun extractFallbackUrl(coupangUrl: String): String? {
        try {
            val uri = Uri.parse(coupangUrl)
            val fallback = uri.getQueryParameter("fallback")
            if (fallback != null) {
                // URL 디코딩
                return Uri.decode(fallback)
            }
        } catch (e: Exception) {
            Log.e("WebView", "Error extracting fallback URL: ${e.message}")
        }
        return null
    }
}
