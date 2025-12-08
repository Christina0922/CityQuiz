# 빠른 해결 방법 (30초)

## 방법 1: Android Studio에서
1. **File → Invalidate Caches / Restart**
2. **Invalidate and Restart** 클릭
3. 재시작 후 **Build → Clean Project**
4. **Build → Rebuild Project**

## 방법 2: 터미널에서 (Android Studio 내부)
```
.\gradlew.bat clean
```

## 방법 3: 수동 삭제
1. Android Studio 완전 종료
2. 작업 관리자 → `java.exe` 모두 종료
3. `app\build` 폴더 삭제
4. Android Studio 재시작

**원인:** `errno 5` = 파일 접근 권한 오류 (Android Studio가 파일 잠금)

**가장 빠른 방법:** 방법 1 (Invalidate Caches)

