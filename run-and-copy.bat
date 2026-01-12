@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 현재 디렉토리: %CD%
echo.
echo 🎨 PC용 Google Play Games 이미지 생성 및 다운로드 폴더 복사
echo.
python scripts\generate-pc-gpg-images.py
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ 완료! 다운로드 폴더를 확인하세요: %USERPROFILE%\Downloads
) else (
    echo.
    echo ❌ 오류 발생
    pause
    exit /b 1
)
pause


