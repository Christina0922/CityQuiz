# 빠른 수정 방법

## 문제
Android assets 폴더에 오래된 빌드 파일이 있어서 "다음 중 도시는?" 같은 잘못된 질문이 표시됩니다.

## 해결 방법

**방법 1: PowerShell에서 직접 실행**
```powershell
Remove-Item "app\src\main\assets\dist\assets\*" -Force
Copy-Item "dist\assets\*" "app\src\main\assets\dist\assets\" -Force
```

**방법 2: 수동 복사**
1. `dist\assets\` 폴더의 모든 파일 선택
2. `app\src\main\assets\dist\assets\` 폴더에 붙여넣기 (덮어쓰기)

**방법 3: npm 스크립트 사용**
```bash
npm run build:android
```

## 확인
복사 후 Android Studio에서 앱을 다시 빌드하고 실행하세요.

