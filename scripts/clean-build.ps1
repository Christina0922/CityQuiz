# Android 빌드 디렉토리 강제 삭제 스크립트

Write-Host "=== Android 빌드 디렉토리 정리 ===" -ForegroundColor Yellow

# Gradle 데몬 종료
Write-Host "Gradle 데몬 종료 중..." -ForegroundColor Cyan
& "$env:USERPROFILE\.gradle\wrapper\dists\gradle-*\gradle-*\bin\gradle.bat" --stop 2>$null
Start-Sleep -Seconds 2

# app/build 디렉토리 삭제 시도
if (Test-Path "app\build") {
    Write-Host "app\build 디렉토리 삭제 시도 중..." -ForegroundColor Cyan
    try {
        # 파일 속성 제거 후 삭제
        Get-ChildItem -Path "app\build" -Recurse -Force | ForEach-Object {
            $_.Attributes = 'Normal'
        }
        Remove-Item -Path "app\build" -Recurse -Force -ErrorAction Stop
        Write-Host "✓ app\build 디렉토리 삭제 완료" -ForegroundColor Green
    } catch {
        Write-Host "✗ 삭제 실패: $_" -ForegroundColor Red
        Write-Host "Android Studio를 종료하고 다시 시도하세요." -ForegroundColor Yellow
    }
} else {
    Write-Host "app\build 디렉토리가 없습니다." -ForegroundColor Gray
}

# .gradle 캐시 정리
if (Test-Path ".gradle") {
    Write-Host ".gradle 캐시 정리 중..." -ForegroundColor Cyan
    try {
        Remove-Item -Path ".gradle\caches" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "✓ Gradle 캐시 정리 완료" -ForegroundColor Green
    } catch {
        Write-Host "Gradle 캐시 정리 실패 (무시 가능)" -ForegroundColor Yellow
    }
}

Write-Host "`n=== 완료 ===" -ForegroundColor Green
Write-Host "이제 Android Studio에서 Build -> Clean Project를 실행하세요." -ForegroundColor Cyan

