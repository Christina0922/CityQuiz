# 새 아이콘 반영 가이드

## ✅ 완료된 작업

아이콘 파일 이름이 자동으로 변경되었습니다:
- `mdpi_48.png` → `ic_launcher.png` (mipmap-mdpi)
- `hdpi_72.png` → `ic_launcher.png` (mipmap-hdpi)
- `xhdpi_96.png` → `ic_launcher.png` (mipmap-xhdpi)
- `xxhdpi_144.png` → `ic_launcher.png` (mipmap-xxhdpi)
- `xxxhdpi_192.png` → `ic_launcher.png` (mipmap-xxxhdpi)

각 폴더에 `ic_launcher.png`와 `ic_launcher_round.png`가 생성되었습니다.

## 📱 스마트폰에 반영하는 방법

### 방법 1: Android Studio에서 빌드 (권장)

1. **Android Studio 열기**
   - 프로젝트를 Android Studio에서 엽니다

2. **빌드 캐시 정리**
   - 메뉴: `Build` → `Clean Project`
   - 완료 후: `Build` → `Rebuild Project`

3. **앱 실행**
   - 스마트폰을 USB로 연결
   - `Run` 버튼 클릭 (Shift+F10)
   - 또는 `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`

### 방법 2: 명령줄에서 빌드

JAVA_HOME이 설정되어 있다면:

```powershell
.\gradlew clean assembleDebug
```

생성된 APK 위치:
```
app\build\outputs\apk\debug\app-debug.apk
```

### 방법 3: 기존 앱 재설치

이미 앱이 설치되어 있다면:

1. **앱 삭제**
   - 스마트폰에서 기존 앱 삭제

2. **새로 빌드한 APK 설치**
   - 새로 빌드한 APK를 스마트폰으로 전송
   - 파일 관리자에서 APK 파일 실행하여 설치

## 🔍 확인 사항

빌드 후 다음을 확인하세요:

1. **앱 아이콘 변경 확인**
   - 홈 화면에서 앱 아이콘이 새로 변경되었는지 확인
   - 앱 서랍에서도 확인

2. **다양한 해상도 테스트**
   - 다른 해상도의 디바이스에서도 아이콘이 올바르게 표시되는지 확인

## ⚠️ 문제 해결

### 아이콘이 변경되지 않는 경우

1. **앱 완전 삭제 후 재설치**
   ```bash
   adb uninstall com.geniusbrain.cityquiz
   adb install app\build\outputs\apk\debug\app-debug.apk
   ```

2. **빌드 캐시 정리**
   - Android Studio: `File` → `Invalidate Caches / Restart`
   - 또는: `.\gradlew clean`

3. **아이콘 파일 확인**
   - 각 mipmap 폴더에 `ic_launcher.png`가 있는지 확인
   - 파일 크기가 0이 아닌지 확인

### 빌드 오류 발생 시

- Android Studio에서 `File` → `Sync Project with Gradle Files`
- `Build` → `Clean Project` 후 다시 빌드

