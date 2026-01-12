# 🚀 빠른 경로 에러 수정 (3단계)

## ⚠️ 문제
경로에 한글이 있어서 Android 빌드가 실패합니다: `D:\1000억 프로젝트\CityQuiz`

## ✅ 해결 방법 (3단계)

### 1단계: 프로젝트 폴더 이동
1. Windows 탐색기 열기
2. `D:\1000억 프로젝트\CityQuiz` 폴더를 **복사** (Ctrl+C)
3. `D:\` 드라이브로 이동
4. **붙여넣기** (Ctrl+V)
5. 폴더 이름을 `CityQuiz`로 변경 (한글 제거)

**결과:** `D:\CityQuiz` ✅

### 2단계: Android Studio 재시작
1. Android Studio **완전히 종료** (작업 관리자에서 확인)
2. Android Studio 다시 실행
3. File → Open → `D:\CityQuiz` 선택

### 3단계: 빌드
1. File → Sync Project with Gradle Files
2. Build → Clean Project
3. Build → Rebuild Project

**완료!** 🎉

---

## 🔧 자동화 스크립트 사용 (선택사항)

PowerShell을 관리자 권한으로 실행:
```powershell
cd "D:\1000억 프로젝트\CityQuiz"
.\move-project.ps1
```

---

## ❓ 문제가 계속되나요?

1. `.gradle` 폴더 삭제
2. `app\build` 폴더 삭제  
3. `build` 폴더 삭제
4. Android Studio 재시작
5. Gradle Sync 다시 실행

