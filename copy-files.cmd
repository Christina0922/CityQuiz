@echo off
echo 파일 삭제 중...
del /q "app\src\main\assets\dist\assets\*.*"
echo 파일 복사 중...
xcopy /Y "dist\assets\*.*" "app\src\main\assets\dist\assets\"
echo 완료!

