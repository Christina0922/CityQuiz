# Android WebView 설정 완료

## ✅ 완료된 작업

### 1. activity_main.xml 생성
- 위치: `app/src/main/res/layout/activity_main.xml`
- WebView만 포함하는 LinearLayout으로 구성

### 2. MainActivity.kt 생성
- 위치: `app/src/main/java/com/cityquiz/app/MainActivity.kt`
- 패키지명: `com.cityquiz.app`
- WebView 설정 완료:
  - JavaScript 활성화
  - DOM Storage 활성화
  - File Access 활성화
  - Wide ViewPort 활성화
  - 로드 URL: `file:///android_asset/dist/index.html`

### 3. assets 폴더 생성 및 dist 복사
- 위치: `app/src/main/assets/dist/`
- 복사 완료:
  - `index.html`
  - `assets/index-BRjgUhmT.css`
  - `assets/index-CbuS-6iu.js`

### 4. AndroidManifest.xml 권한 추가
- 인터넷 권한 추가: `<uses-permission android:name="android.permission.INTERNET" />`

### 5. build.gradle.kts 패키지명 업데이트
- namespace: `com.temp.cityquiz` → `com.cityquiz.app`

## 📋 다음 단계

### 1. Gradle Sync
Android Studio에서:
- "Sync Project with Gradle Files" 클릭
- 또는: `File` → `Sync Project with Gradle Files`

### 2. Clean & Rebuild
- `Build` → `Clean Project`
- `Build` → `Rebuild Project`

### 3. 앱 실행
- 에뮬레이터 또는 실기기에서 앱 실행
- WebView에서 `dist/index.html`이 정상적으로 로드되는지 확인

### 4. Generate Signed APK
앱이 정상 작동하면:
- `Build` → `Generate Signed Bundle / APK`
- APK 선택
- Keystore 파일 선택 (이미 있으면: `keystore/cityquiz.jks`)
- Alias 및 비밀번호 입력
- 빌드 타입: Release
- Finish

## 🔍 확인 사항

- ✅ `app/src/main/assets/dist/index.html` 존재 확인
- ✅ `app/src/main/assets/dist/assets/` 폴더 및 파일 존재 확인
- ✅ `MainActivity.kt` 패키지명: `com.cityquiz.app`
- ✅ `AndroidManifest.xml` 인터넷 권한 추가 확인
- ✅ `build.gradle.kts` namespace: `com.cityquiz.app`
- ✅ WebView 로드 URL: `file:///android_asset/dist/index.html`

## 🐛 문제 해결

### 문제: WebView가 하얀 화면만 표시
**해결책:**
1. Logcat에서 에러 확인
2. `assets/dist/index.html` 경로 확인
3. `file:///android_asset/dist/index.html` 경로 확인

### 문제: JavaScript가 작동하지 않음
**해결책:**
1. `javaScriptEnabled = true` 확인
2. `domStorageEnabled = true` 확인

### 문제: 빌드 에러 (패키지명 관련)
**해결책:**
1. Gradle Sync 실행
2. `app/build.gradle.kts`의 namespace 확인
3. `MainActivity.kt`의 패키지명 확인

