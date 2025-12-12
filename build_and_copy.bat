@echo off
echo ===============================
echo 1. npm build 시작
echo ===============================
npm run build

echo ===============================
echo 2. dist -> android assets 복사
echo ===============================
xcopy /E /Y dist\* app\src\main\assets\dist\

echo ===============================
echo 완료되었습니다.
echo Android Studio에서 Run 하세요.
echo ===============================
pause
