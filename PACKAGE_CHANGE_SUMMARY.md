# 패키지명 변경 완료 요약

## ✅ 변경 완료

### 패키지명: `com.cityquiz.app` → `com.cityquiz.mobile`

## 📝 변경된 파일

### 1. `app/build.gradle.kts`
```kotlin
android {
    namespace = "com.cityquiz.mobile"  // ✅ 변경됨
    ...
    defaultConfig {
        applicationId = "com.cityquiz.mobile"  // ✅ 변경됨
        ...
    }
}
```

### 2. `app/src/main/java/com/cityquiz/mobile/MainActivity.kt`
- **새 위치**: `com/cityquiz/mobile/MainActivity.kt`
- **패키지명**: `package com.cityquiz.mobile` ✅

### 3. `app/src/main/AndroidManifest.xml`
- 최신 Android에서는 `namespace` 사용
- 별도 `package` 속성 불필요
- `android:name=".MainActivity"`는 namespace 기준으로 자동 해석

## 🗂️ 폴더 구조

```
app/src/main/java/com/cityquiz/
├── app/          (빈 폴더, 삭제 가능)
└── mobile/
    └── MainActivity.kt  ✅
```

## 📋 다음 단계

### Android Studio에서:

1. **Gradle Sync**
   - "Sync Project with Gradle Files" 클릭
   - 또는: `File` → `Sync Project with Gradle Files`

2. **Clean Project**
   - `Build` → `Clean Project`
   - 이전 빌드 캐시 삭제 (이전 패키지명 제거)

3. **Rebuild Project**
   - `Build` → `Rebuild Project`
   - 새로운 패키지명으로 빌드

4. **앱 실행 및 확인**
   - 에뮬레이터/실기기에서 실행
   - WebView가 정상 로드되는지 확인

5. **Generate Signed APK**
   - `Build` → `Generate Signed Bundle / APK`
   - APK 선택
   - Keystore: `keystore/cityquiz.jks`
   - 빌드 타입: Release
   - Finish

## ✅ 패키지 충돌 해결

- ✅ 새로운 패키지명: `com.cityquiz.mobile`
- ✅ 기존 앱(`com.cityquiz.app`)과 충돌 없음
- ✅ 모든 소스 파일의 패키지명 일치
- ✅ 폴더 구조가 패키지명과 일치

## 🔍 확인 사항

- ✅ `namespace`: `com.cityquiz.mobile`
- ✅ `applicationId`: `com.cityquiz.mobile`
- ✅ `MainActivity.kt` 패키지: `com.cityquiz.mobile`
- ✅ `MainActivity.kt` 경로: `com/cityquiz/mobile/`
- ✅ `assets/dist/` 경로 유지 (변경 없음)
- ✅ WebView 로드 URL 유지: `file:///android_asset/dist/index.html`

## 📦 APK 생성 후

생성된 APK는 다음 위치에 있습니다:
- `app/build/outputs/apk/release/app-release.apk`

이 APK는 새로운 패키지명(`com.cityquiz.mobile`)으로 서명되어 있어, 기존 앱과 충돌 없이 설치 가능합니다.

