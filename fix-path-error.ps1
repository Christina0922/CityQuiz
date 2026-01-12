# 경로 에러 수정을 위한 빠른 가이드 스크립트

Write-Host "========================================" -ForegroundColor Red
Write-Host "Android Gradle 경로 에러 수정" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""

# 현재 경로 확인
$currentPath = if ($PSScriptRoot) { $PSScriptRoot } else { Get-Location }
Write-Host "현재 경로: $currentPath" -ForegroundColor Yellow
Write-Host ""

# 경로에 비ASCII 문자가 있는지 확인
if ($currentPath -match '[^\x00-\x7F]') {
    Write-Host "❌ 문제 발견: 경로에 한글이 포함되어 있습니다!" -ForegroundColor Red
    Write-Host ""
    Write-Host "에러 원인:" -ForegroundColor Yellow
    Write-Host "  Android Gradle 플러그인은 경로에 한글이 있으면 빌드를 거부합니다." -ForegroundColor White
    Write-Host "  이 문제는 설정 파일로 해결할 수 없습니다." -ForegroundColor White
    Write-Host ""
    Write-Host "해결 방법:" -ForegroundColor Cyan
    Write-Host "  1. 프로젝트를 ASCII 문자만 포함하는 경로로 이동 (필수)" -ForegroundColor White
    Write-Host "     예: D:\CityQuiz 또는 D:\Project1000\CityQuiz" -ForegroundColor Green
    Write-Host ""
    Write-Host "  2. move-project.ps1 스크립트로 자동 이동:" -ForegroundColor White
    Write-Host "     .\move-project.ps1" -ForegroundColor Green
    Write-Host ""
    Write-Host "  3. 또는 수동으로 이동:" -ForegroundColor White
    Write-Host "     - Windows 탐색기에서 프로젝트 폴더를 D:\CityQuiz로 복사" -ForegroundColor White
    Write-Host "     - Android Studio를 종료하고 새 경로에서 프로젝트 열기" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️ 중요: 경로를 변경하지 않으면 빌드가 계속 실패합니다!" -ForegroundColor Red
    Write-Host ""
    
    # 자동 이동 제안
    Write-Host "자동으로 D:\CityQuiz로 이동하시겠습니까? (Y/N)" -ForegroundColor Cyan
    $autoMove = Read-Host
    if ($autoMove -eq "Y" -or $autoMove -eq "y") {
        Write-Host ""
        Write-Host "move-project.ps1 스크립트를 실행합니다..." -ForegroundColor Yellow
        if (Test-Path ".\move-project.ps1") {
            & ".\move-project.ps1"
        } else {
            Write-Host "❌ move-project.ps1 파일을 찾을 수 없습니다." -ForegroundColor Red
        }
        exit 0
    }
} else {
    Write-Host "✅ 경로에 문제가 없습니다 (ASCII 문자만 포함)" -ForegroundColor Green
    Write-Host ""
    Write-Host "다른 문제일 수 있습니다. Gradle 캐시를 정리하시겠습니까?" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Gradle 캐시 정리를 실행하시겠습니까? (Y/N)" -ForegroundColor Cyan
$cleanCache = Read-Host
if ($cleanCache -eq "Y" -or $cleanCache -eq "y") {
    Write-Host ""
    Write-Host "Gradle 캐시 정리 중..." -ForegroundColor Yellow
    
    $cleaned = $false
    
    # Gradle 캐시 정리
    if (Test-Path ".gradle") {
        try {
            Remove-Item -Path ".gradle" -Recurse -Force -ErrorAction Stop
            Write-Host "✅ .gradle 폴더 삭제 완료" -ForegroundColor Green
            $cleaned = $true
        } catch {
            Write-Host "⚠️ .gradle 폴더 삭제 실패: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
    
    if (Test-Path "app\build") {
        try {
            Remove-Item -Path "app\build" -Recurse -Force -ErrorAction Stop
            Write-Host "✅ app\build 폴더 삭제 완료" -ForegroundColor Green
            $cleaned = $true
        } catch {
            Write-Host "⚠️ app\build 폴더 삭제 실패: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
    
    if (Test-Path "build") {
        try {
            Remove-Item -Path "build" -Recurse -Force -ErrorAction Stop
            Write-Host "✅ build 폴더 삭제 완료" -ForegroundColor Green
            $cleaned = $true
        } catch {
            Write-Host "⚠️ build 폴더 삭제 실패: $($_.Exception.Message)" -ForegroundColor Yellow
        }
    }
    
    if (-not $cleaned) {
        Write-Host "ℹ️ 정리할 캐시 폴더가 없습니다." -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "✅ 캐시 정리 완료!" -ForegroundColor Green
    }
    
    Write-Host ""
    Write-Host "다음 단계:" -ForegroundColor Cyan
    Write-Host "1. Android Studio를 재시작하세요" -ForegroundColor White
    Write-Host "2. File → Sync Project with Gradle Files 실행" -ForegroundColor White
    Write-Host "3. Build → Clean Project 실행" -ForegroundColor White
    Write-Host ""
}

