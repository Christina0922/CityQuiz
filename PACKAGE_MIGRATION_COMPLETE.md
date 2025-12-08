# 패키지명 변경 완료: com.cityquiz.mobile

## ✅ 완료된 작업

### 1. build.gradle.kts 수정
- `namespace`: `com.cityquiz.app` → `com.cityquiz.mobile`
- `applicationId`: `com.cityquiz.app` → `com.cityquiz.mobile`

### 2. MainActivity.kt 이동 및 패키지명 변경
- **이전 위치**: `app/src/main/java/com/cityquiz/app/MainActivity.kt`
- **새 위치**: `app/src/main/java/com/cityquiz/mobile/MainActivity.kt`
- **패키지명**: `package com.cityquiz.mobile`

### 3. 기존 파일 정리
- 기존 `com/cityquiz/app/MainActivity.kt` 삭제 완료

### 4. AndroidManifest.xml
- 최신 Android에서는 `namespace`를 사용하므로 별도 `package` 속성 불필요
- `android:name=".MainActivity"`는 namespace 기준으로 자동 해석됨

### 5. assets 및 dist 경로
- 변경 없음: `app/src/main/assets/dist/` 유지
- WebView 로드 URL: `file:///android_asset/dist/index.html` 유지

## 📋 변경 사항 요약

| 항목 | 이전 | 변경 후 |
|------|------|---------|
| namespace | `com.cityquiz.app` | `com.cityquiz.mobile` |
| applicationId | `com.cityquiz.app` | `com.cityquiz.mobile` |
| MainActivity 패키지 | `com.cityquiz.app` | `com.cityquiz.mobile` |
| MainActivity 경로 | `com/cityquiz/app/` | `com/cityquiz/mobile/` |

## 🔍 다음 단계

### 1. Android Studio에서 Gradle Sync
- "Sync Project with Gradle Files" 클릭
- 또는: `File` → `Sync Project with Gradle Files`

### 2. Clean & Rebuild
- `Build` → `Clean Project`
- `Build` → `Rebuild Project`

### 3. 빌드 확인
- 빌드가 성공하는지 확인
- 에러가 없으면 다음 단계로 진행

### 4. Generate Signed APK
- `Build` → `Generate Signed Bundle / APK`
- APK 선택
- Keystore 파일 선택 (이미 있으면: `keystore/cityquiz.jks`)
- Alias 및 비밀번호 입력
- 빌드 타입: Release
- Finish

## ✅ 패키지 충돌 해결 확인

- ✅ 새로운 패키지명: `com.cityquiz.mobile`
- ✅ 기존 앱(`com.cityquiz.app`)과 충돌 없음
- ✅ 모든 파일의 패키지명 일치 확인
- ✅ 폴더 구조가 패키지명과 일치

## 📝 참고 사항

### 사용하지 않는 파일
다음 파일들은 현재 사용되지 않지만 삭제하지 않았습니다 (필요시 수동 삭제 가능):
- `app/src/main/java/com/temp/cityquiz/ui/theme/` (Compose 테마 파일들)
  - MainActivity에서 WebView만 사용하므로 불필요

### AndroidManifest.xml
최신 Android 빌드 시스템에서는:
- `build.gradle.kts`의 `namespace`가 패키지명을 정의
- `AndroidManifest.xml`에 `package` 속성을 명시할 필요 없음
- `android:name=".MainActivity"`는 namespace 기준으로 자동 해석

## 🎯 최종 확인

모든 설정이 완료되었습니다. Android Studio에서:
1. Gradle Sync 실행
2. Clean Project
3. Rebuild Project
4. 앱 실행하여 WebView가 정상 로드되는지 확인
5. Generate Signed APK 진행

