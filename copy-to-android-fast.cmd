@echo off
echo 빠른 복사 시작...
del /q "app\src\main\assets\dist\assets\*.*" 2>nul
xcopy /Y "dist\assets\*.*" "app\src\main\assets\dist\assets\" >nul 2>&1
echo 완료!

