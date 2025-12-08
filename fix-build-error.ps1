# 빌드 오류 해결 스크립트

Write-Host "=== 빌드 오류 해결 시작 ===" -ForegroundColor Yellow

# 프로젝트 루트로 이동
Set-Location $PSScriptRoot

# Gradle 데몬 종료
Write-Host "Gradle 데몬 종료 중..." -ForegroundColor Cyan
if (Test-Path ".\gradlew.bat") {
    & ".\gradlew.bat" --stop 2>$null
}
Start-Sleep -Seconds 2

# Java 프로세스 확인 및 종료
$javaProcs = Get-Process -Name "java" -ErrorAction SilentlyContinue
if ($javaProcs) {
    Write-Host "Java 프로세스 종료 중..." -ForegroundColor Cyan
    $javaProcs | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# app\build 디렉토리 강제 삭제
if (Test-Path "app\build") {
    Write-Host "app\build 디렉토리 삭제 중..." -ForegroundColor Cyan
    try {
        # 모든 하위 항목의 속성 변경
        Get-ChildItem -Path "app\build" -Recurse -Force | ForEach-Object {
            $_.Attributes = 'Normal'
        }
        # 디렉토리 삭제
        Remove-Item -Path "app\build" -Recurse -Force -ErrorAction Stop
        Write-Host "✓ app\build 삭제 완료" -ForegroundColor Green
    } catch {
        Write-Host "✗ 삭제 실패: $_" -ForegroundColor Red
        Write-Host "Android Studio를 완전히 종료하고 다시 실행하세요." -ForegroundColor Yellow
    }
}

# Gradle clean 실행
Write-Host "Gradle clean 실행 중..." -ForegroundColor Cyan
if (Test-Path ".\gradlew.bat") {
    & ".\gradlew.bat" clean
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Gradle clean 완료" -ForegroundColor Green
    } else {
        Write-Host "✗ Gradle clean 실패" -ForegroundColor Red
    }
}

Write-Host "`n=== 완료 ===" -ForegroundColor Green

