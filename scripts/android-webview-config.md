# Android WebView 설정 가이드

## 1. AndroidManifest.xml 권한 추가

`app/src/main/AndroidManifest.xml` 파일에 다음 권한을 추가하세요:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

전체 예시:
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.cityquiz">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        ...>
        <activity ...>
            ...
        </activity>
    </application>
</manifest>
```

## 2. WebView 설정 코드

`MainActivity.kt` 또는 `MainActivity.java`에서 다음과 같이 설정하세요:

### Kotlin 예시:

```kotlin
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.WebSettings
import android.util.Log

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webview)
        
        // WebView 설정
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowFileAccessFromFileURLs = true
            allowContentAccess = true
            loadWithOverviewMode = true
            useWideViewPort = true
        }

        // WebViewClient 설정 (에러 로깅 포함)
        webView.webViewClient = object : WebViewClient() {
            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                Log.e("WebView", "Error: ${error?.description}")
                Log.e("WebView", "Failed URL: ${request?.url}")
            }

            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                val url = request?.url.toString()
                // 외부 링크는 기본 브라우저로 열기
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    if (!url.contains("coupang.com") && !url.contains("google.com")) {
                        return false
                    }
                }
                return false
            }
        }

        // 로컬 파일 로드
        webView.loadUrl("file:///android_asset/index.html")
    }

    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
```

### Java 예시:

```java
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebSettings;
import android.util.Log;

public class MainActivity extends AppCompatActivity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        
        // WebView 설정
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowContentAccess(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);

        // WebViewClient 설정 (에러 로깅 포함)
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                Log.e("WebView", "Error: " + error.getDescription());
                Log.e("WebView", "Failed URL: " + request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                // 외부 링크는 기본 브라우저로 열기
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    if (!url.contains("coupang.com") && !url.contains("google.com")) {
                        return false;
                    }
                }
                return false;
            }
        });

        // 로컬 파일 로드
        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
```

## 3. 레이아웃 XML 파일

`activity_main.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

## 4. 빌드 및 복사

```bash
# React 프로젝트 빌드 및 Android assets로 복사
npm run build:android

# 또는 수동으로:
npm run build
npm run copy:android
```

## 5. 확인 사항

- ✅ `file:///android_asset/index.html` 경로로 로드되는지 확인
- ✅ 모든 JS/CSS 파일이 상대 경로(`./`)로 로드되는지 확인
- ✅ 인터넷 권한이 AndroidManifest.xml에 추가되었는지 확인
- ✅ WebView 설정이 모두 활성화되었는지 확인
- ✅ 에러 로그가 Logcat에서 확인 가능한지 확인

