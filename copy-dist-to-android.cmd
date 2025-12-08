@echo off
echo ========================================
echo Vite dist -> Android assets 복사 시작
echo ========================================
echo.

echo 1. 기존 assets 파일 삭제 중...
del /q "app\src\main\assets\dist\assets\*.*" 2>nul
if %errorlevel% equ 0 (
    echo    [OK] 기존 파일 삭제 완료
) else (
    echo    [INFO] 삭제할 파일이 없거나 이미 삭제됨
)

echo.
echo 2. 새 빌드 파일 복사 중...
xcopy /Y "dist\assets\*.*" "app\src\main\assets\dist\assets\" >nul 2>&1
if %errorlevel% equ 0 (
    echo    [OK] 파일 복사 완료
) else (
    echo    [ERROR] 파일 복사 실패
    pause
    exit /b 1
)

echo.
echo ========================================
echo 복사 완료!
echo ========================================
echo.
echo 확인 사항:
echo - app\src\main\assets\dist\index.html
echo - app\src\main\assets\dist\assets\*.js
echo - app\src\main\assets\dist\assets\*.css
echo.
pause

