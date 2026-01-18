package com.geniusbrain.cityquiz

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.webkit.ConsoleMessage
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.OnUserEarnedRewardListener
import com.google.android.gms.ads.rewarded.RewardItem
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    
    // 보상형 광고 객체
    private var rewardedAd: RewardedAd? = null
    
    // TODO: 릴리즈 전 실제 광고 단위 ID로 교체
    // 테스트용: ca-app-pub-3940256099942544/5224354917
    private val REWARDED_AD_UNIT_ID = "ca-app-pub-3940256099942544/5224354917"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // AdMob 초기화
        MobileAds.initialize(this) { initializationStatus ->
            Log.d("AdMob", "AdMob initialized: ${initializationStatus.adapterStatusMap}")
        }

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

        // JavaScript 인터페이스 추가 (보상형 광고 호출용)
        webView.addJavascriptInterface(WebAppInterface(), "Android")

        // 보상형 광고 미리 로드
        loadRewardedAd()

        // ⭐ WebView가 실제로 읽어야 하는 경로 (핵심 변경 부분)
        // dist/index.html을 로드하도록 수정 완료
        webView.loadUrl("file:///android_asset/dist/index.html")
    }

    /**
     * WebView에서 호출할 수 있는 JavaScript 인터페이스
     */
    inner class WebAppInterface {
        @JavascriptInterface
        fun showRewardedAd(type: String) {
            Log.d("WebAppInterface", "showRewardedAd called with type: $type")
            runOnUiThread {
                showRewardedAdInternal(type)
            }
        }
    }

    /**
     * 보상형 광고 로드
     */
    private fun loadRewardedAd() {
        val adRequest = AdRequest.Builder().build()

        RewardedAd.load(
            this,
            REWARDED_AD_UNIT_ID,
            adRequest,
            object : RewardedAdLoadCallback() {
                override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                    Log.e("AdMob", "Rewarded ad failed to load: ${loadAdError.message}")
                    rewardedAd = null
                }

                override fun onAdLoaded(ad: RewardedAd) {
                    Log.d("AdMob", "Rewarded ad loaded successfully")
                    rewardedAd = ad
                }
            }
        )
    }

    /**
     * 보상형 광고 표시
     * @param type 광고 타입 ("hint" 또는 "map")
     */
    private fun showRewardedAdInternal(type: String) {
        Log.d("AdMob", "showRewardedAdInternal called with type: $type")
        val ad = rewardedAd
        if (ad != null) {
            Log.d("AdMob", "Showing rewarded ad...")
            ad.show(this) { rewardItem: RewardItem ->
                // 보상 지급 콜백
                Log.d("AdMob", "User earned reward: ${rewardItem.amount} ${rewardItem.type}")
                
                // JavaScript로 보상 성공 콜백 전달
                val jsCode = "javascript:if(window.onRewarded){window.onRewarded('$type');}else{console.error('window.onRewarded not found');}"
                webView.evaluateJavascript(jsCode) { result ->
                    Log.d("AdMob", "JavaScript callback executed: $result")
                }
                
                // 다음 광고 미리 로드
                loadRewardedAd()
            }
        } else {
            Log.w("AdMob", "Rewarded ad is not ready. Loading new ad...")
            // 광고가 로드되지 않았을 때도 사용자 경험을 위해 즉시 보상 제공 (개발/테스트용)
            // TODO: 프로덕션에서는 사용자에게 "광고 로딩 중..." 메시지를 보여주는 것이 좋습니다.
            val jsCode = "javascript:if(window.onRewarded){window.onRewarded('$type');}else{console.error('window.onRewarded not found');}"
            webView.evaluateJavascript(jsCode) { result ->
                Log.d("AdMob", "JavaScript callback executed (fallback): $result")
            }
            loadRewardedAd()
        }
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
