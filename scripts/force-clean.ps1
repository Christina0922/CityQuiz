# 강제 빌드 디렉토리 삭제 스크립트

Write-Host "=== 강제 빌드 정리 시작 ===" -ForegroundColor Yellow

# Gradle 데몬 종료
Write-Host "Gradle 데몬 종료 중..." -ForegroundColor Cyan
$gradlePath = Get-ChildItem -Path "$env:USERPROFILE\.gradle\wrapper\dists" -Recurse -Filter "gradle.bat" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($gradlePath) {
    & $gradlePath.FullName --stop 2>$null
}
Start-Sleep -Seconds 3

# Java 프로세스 종료
Write-Host "Java 프로세스 확인 중..." -ForegroundColor Cyan
$javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue
if ($javaProcesses) {
    Write-Host "Java 프로세스 종료 중..." -ForegroundColor Cyan
    $javaProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# app/build 디렉토리 강제 삭제
if (Test-Path "app\build") {
    Write-Host "app\build 디렉토리 강제 삭제 중..." -ForegroundColor Cyan
    try {
        # 모든 파일의 읽기 전용 속성 제거
        Get-ChildItem -Path "app\build" -Recurse -Force | ForEach-Object {
            $_.Attributes = 'Normal'
            Remove-Item $_.FullName -Force -Recurse -ErrorAction SilentlyContinue
        }
        Remove-Item -Path "app\build" -Recurse -Force -ErrorAction Stop
        Write-Host "✓ app\build 삭제 완료" -ForegroundColor Green
    } catch {
        Write-Host "✗ 삭제 실패: $_" -ForegroundColor Red
        Write-Host "Android Studio를 완전히 종료하고 다시 시도하세요." -ForegroundColor Yellow
        exit 1
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
Write-Host "이제 Android Studio에서 Build -> Clean Project -> Rebuild Project를 실행하세요." -ForegroundColor Cyan

