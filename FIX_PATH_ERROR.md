# ⚠️ 프로젝트 경로 에러 수정 가이드

## 🔴 문제 원인
**Android Gradle 플러그인은 프로젝트 경로에 한글(비ASCII 문자)이 포함되어 있으면 빌드를 완전히 거부합니다.**

현재 경로: `D:\1000억 프로젝트\CityQuiz` ❌  
에러 메시지: "Your project path contains non-ASCII characters. This will most likely cause the build to fail on Windows"

**⚠️ 중요:** 이 문제는 설정 파일로 해결할 수 없습니다. 반드시 프로젝트를 ASCII 문자만 포함하는 경로로 이동해야 합니다.

---

## ✅ 해결 방법 (필수)

### 🚀 방법 1: 빠른 해결 (권장)

**1단계: 프로젝트 폴더 이동**
- Windows 탐색기 열기
- `D:\1000억 프로젝트\CityQuiz` 폴더를 복사
- 다음 경로 중 하나로 붙여넣기:
  - `D:\CityQuiz` ⭐ (가장 간단, 추천)
  - `D:\Project1000\CityQuiz`
  - `D:\CityQuizProject\CityQuiz`

**2단계: Android Studio 완전 종료**
- Android Studio 완전히 종료 (작업 관리자에서 확인)

**3단계: 새 경로에서 프로젝트 열기**
- Android Studio 실행
- File → Open → 새 경로(`D:\CityQuiz`) 선택

**4단계: Gradle Sync 및 빌드**
- File → Sync Project with Gradle Files
- Build → Clean Project
- Build → Rebuild Project

---

### 🔧 방법 2: 자동화 스크립트 사용

PowerShell을 관리자 권한으로 실행한 후:

```powershell
cd "D:\1000억 프로젝트\CityQuiz"
.\move-project.ps1
```

스크립트가 자동으로:
1. 새 경로 선택 안내
2. 프로젝트 이동
3. Gradle 캐시 정리

---

## 📋 이동 후 필수 확인사항

1. ✅ Android Studio 완전 종료 확인
2. ✅ 새 경로에서 프로젝트 열기
3. ✅ Gradle Sync 실행 (File → Sync Project with Gradle Files)
4. ✅ Clean Build 실행 (Build → Clean Project)
5. ✅ 빌드 성공 확인

---

## 🛠️ 추가 문제 해결

### Gradle 캐시 정리
PowerShell에서 실행:
```powershell
.\fix-path-error.ps1
```

또는 수동으로:
1. `.gradle` 폴더 삭제
2. `app\build` 폴더 삭제
3. `build` 폴더 삭제

---

## ❓ 자주 묻는 질문

**Q: 경로를 변경하지 않고 해결할 수 없나요?**  
A: 아니요. Android Gradle 플러그인 코드 내부에서 경로를 검사하므로 설정으로 우회할 수 없습니다.

**Q: 심볼릭 링크를 사용하면 되나요?**  
A: 안 됩니다. Android Gradle은 실제 경로를 검사합니다.

**Q: 다른 해결 방법이 있나요?**  
A: 없습니다. 프로젝트를 ASCII 경로로 이동하는 것이 유일한 해결책입니다.

