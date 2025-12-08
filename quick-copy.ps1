# 빠른 파일 복사 스크립트
Remove-Item "app\src\main\assets\dist\assets\*" -Force -ErrorAction SilentlyContinue
Copy-Item "dist\assets\*" "app\src\main\assets\dist\assets\" -Force
Write-Host "✅ 파일 복사 완료!"

