# Android WebView 통합 설정 완료 가이드

## ✅ 완료된 작업

1. ✅ **vite.config.ts** - `base: "./"` 설정 완료 (상대 경로)
2. ✅ **package.json** - 빌드 스크립트 확인 및 Android 복사 스크립트 추가
3. ✅ **npm install** - 모든 패키지 정상 설치 완료
4. ✅ **빌드 완료** - dist 폴더에 WebView 호환 파일 생성 완료
5. ✅ **상대 경로 확인** - index.html에서 `./assets/...` 경로 확인

## 📋 다음 단계: Android 프로젝트 설정

### 1. Android 프로젝트 경로 확인

React 프로젝트의 `dist` 폴더를 Android 프로젝트의 `app/src/main/assets/` 폴더로 복사해야 합니다.

**방법 1: 자동 복사 스크립트 사용**

```bash
# Android 프로젝트 경로를 환경변수로 설정
set ANDROID_ASSETS_PATH=D:\YourAndroidProject\app\src\main\assets
npm run copy:android

# 또는 한 번에 빌드 + 복사
npm run build:android
```

**방법 2: 수동 복사**

`dist` 폴더 전체를 `app/src/main/assets/` 폴더로 복사:
```
dist/
  ├── index.html
  └── assets/
      ├── index-*.css
      └── index-*.js
```

### 2. AndroidManifest.xml 수정

`app/src/main/AndroidManifest.xml` 파일에 인터넷 권한 추가:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.cityquiz">

    <!-- 인터넷 권한 추가 -->
    <uses-permission android:name="android.permission.INTERNET" />

    <application ...>
        ...
    </application>
</manifest>
```

### 3. MainActivity 코드 설정

**Kotlin 예시** (`MainActivity.kt`):

```kotlin
import android.os.Bundle
import android.util.Log
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

        webView = findViewById(R.id.webview)
        
        // ✅ WebView 필수 설정
        webView.settings.apply {
            javaScriptEnabled = true              // ✅ 필수
            domStorageEnabled = true              // ✅ 필수 (localStorage 사용)
            allowFileAccess = true                // ✅ 필수
            allowFileAccessFromFileURLs = true    // ✅ 필수
            allowContentAccess = true
            loadWithOverviewMode = true
            useWideViewPort = true
            builtInZoomControls = false
            displayZoomControls = false
        }

        // ✅ WebViewClient 설정 (에러 로깅 포함)
        webView.webViewClient = object : WebViewClient() {
            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                    Log.e("WebView", "Error: ${error?.description}")
                    Log.e("WebView", "Error Code: ${error?.errorCode}")
                    Log.e("WebView", "Failed URL: ${request?.url}")
                }
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: android.graphics.Bitmap?) {
                super.onPageStarted(view, url, favicon)
                Log.d("WebView", "Page started: $url")
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                Log.d("WebView", "Page finished: $url")
            }

            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {
                val url = request?.url.toString()
                Log.d("WebView", "Loading URL: $url")
                
                // 외부 링크(쿠팡 등)는 기본 브라우저로 열기
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    if (url.contains("coupang.com") || url.contains("google.com")) {
                        val intent = android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(url))
                        startActivity(intent)
                        return true
                    }
                }
                return false
            }
        }

        // ✅ 로컬 파일 로드
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

**Java 예시** (`MainActivity.java`):

```java
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        
        // ✅ WebView 필수 설정
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);              // ✅ 필수
        settings.setDomStorageEnabled(true);              // ✅ 필수 (localStorage 사용)
        settings.setAllowFileAccess(true);                // ✅ 필수
        settings.setAllowFileAccessFromFileURLs(true);    // ✅ 필수
        settings.setAllowContentAccess(true);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        // ✅ WebViewClient 설정 (에러 로깅 포함)
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                    Log.e("WebView", "Error: " + error.getDescription());
                    Log.e("WebView", "Error Code: " + error.getErrorCode());
                    Log.e("WebView", "Failed URL: " + request.getUrl());
                }
            }

            @Override
            public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                Log.d("WebView", "Page started: " + url);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                Log.d("WebView", "Page finished: " + url);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                Log.d("WebView", "Loading URL: " + url);
                
                // 외부 링크(쿠팡 등)는 기본 브라우저로 열기
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    if (url.contains("coupang.com") || url.contains("google.com")) {
                        android.content.Intent intent = new android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse(url));
                        startActivity(intent);
                        return true;
                    }
                }
                return false;
            }
        });

        // ✅ 로컬 파일 로드
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

### 4. 레이아웃 XML 파일

`app/src/main/res/layout/activity_main.xml`:

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
        android:layout_width="0dp"
        android:layout_height="0dp"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

## 🔍 확인 사항 체크리스트

### 빌드 결과물 확인
- [x] `dist/index.html` - 상대 경로(`./assets/...`) 사용 확인
- [x] `dist/assets/index-*.js` - JavaScript 파일 존재 확인
- [x] `dist/assets/index-*.css` - CSS 파일 존재 확인

### Android 프로젝트 설정
- [ ] `app/src/main/assets/` 폴더에 `dist` 내용 복사 완료
- [ ] `AndroidManifest.xml`에 `INTERNET` 권한 추가
- [ ] `WebView` 설정에서 다음 옵션 활성화:
  - [ ] `javaScriptEnabled = true`
  - [ ] `domStorageEnabled = true`
  - [ ] `allowFileAccess = true`
  - [ ] `allowFileAccessFromFileURLs = true`
- [ ] `loadUrl("file:///android_asset/index.html")` 경로 확인
- [ ] `WebViewClient` 에러 로깅 설정 완료

### 빌드 및 테스트
- [ ] Android Studio에서 프로젝트 빌드 성공
- [ ] 에뮬레이터/실기기에서 앱 실행
- [ ] Logcat에서 WebView 로그 확인
- [ ] 앱 내 퀴즈 기능 정상 동작 확인

### APK/AAB 생성 준비
- [ ] Signed APK/AAB 생성 준비 완료
- [ ] Keystore 파일 경로 및 alias 확인
- [ ] 빌드 타입 (Debug/Release) 확인

## 🐛 문제 해결

### 문제: WebView가 하얀 화면만 표시
**해결책:**
1. Logcat에서 에러 메시지 확인
2. `assets` 폴더 경로 확인: `app/src/main/assets/index.html`
3. `file:///android_asset/index.html` 경로 확인 (앞의 `/` 중요!)

### 문제: JavaScript가 작동하지 않음
**해결책:**
1. `javaScriptEnabled = true` 확인
2. `domStorageEnabled = true` 확인 (localStorage 사용 시 필수)

### 문제: 외부 링크가 열리지 않음
**해결책:**
1. `INTERNET` 권한 확인
2. `shouldOverrideUrlLoading` 구현 확인

## 📞 추가 도움말

더 자세한 설정은 `scripts/android-webview-config.md` 파일을 참고하세요.

