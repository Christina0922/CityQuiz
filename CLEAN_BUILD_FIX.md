# Android 빌드 디렉토리 삭제 오류 해결 방법

## 문제
`java.io.IOException: Unable to delete directory 'D:\CityQuiz\app\build'`

## 빠른 해결 방법

### 방법 1: Android Studio에서
1. **File → Invalidate Caches / Restart**
2. **Invalidate and Restart** 선택
3. 재시작 후 **Build → Clean Project**

### 방법 2: 수동 삭제
1. Android Studio 완전 종료
2. 작업 관리자에서 `java.exe`, `gradle.exe` 프로세스 종료
3. `app\build` 폴더 수동 삭제
4. Android Studio 재시작

### 방법 3: Gradle 명령어
Android Studio 터미널에서:
```bash
cd app
gradlew clean
```

## 참고
- Android Studio가 실행 중이면 파일이 잠겨 삭제되지 않을 수 있습니다.
- 프로세스를 종료한 후 삭제하면 해결됩니다.

