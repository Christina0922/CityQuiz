# 프로젝트를 ASCII 경로로 이동하는 스크립트
# 사용법: PowerShell에서 실행 (관리자 권한 권장)
# 주의: Android Studio를 먼저 완전히 종료하세요!

# 현재 경로 확인
$currentPath = if ($PSScriptRoot) { $PSScriptRoot } else { Get-Location }
$currentPathName = Split-Path -Leaf $currentPath

# 경로에 한글이 있는지 확인
if ($currentPath -notmatch '[^\x00-\x7F]') {
    Write-Host "✅ 현재 경로에 문제가 없습니다: $currentPath" -ForegroundColor Green
    Write-Host "이 스크립트를 실행할 필요가 없습니다." -ForegroundColor Yellow
    exit 0
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "프로젝트 경로 이동 스크립트" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Android Studio 실행 확인
$androidStudioProcesses = Get-Process -Name "studio64","studio" -ErrorAction SilentlyContinue
if ($androidStudioProcesses) {
    Write-Host "⚠️ 경고: Android Studio가 실행 중입니다!" -ForegroundColor Red
    Write-Host "   Android Studio를 완전히 종료한 후 다시 실행하세요." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "그래도 계속하시겠습니까? (Y/N)"
    if ($continue -ne "Y" -and $continue -ne "y") {
        exit 0
    }
}

# 현재 경로 확인
Write-Host "현재 경로: $currentPath" -ForegroundColor Yellow
Write-Host "⚠️ 경로에 한글이 포함되어 있어 Android 빌드가 실패합니다." -ForegroundColor Red
Write-Host ""

# 새 경로 선택
Write-Host "새 경로를 선택하세요:" -ForegroundColor Green
Write-Host "1. D:\CityQuiz" -ForegroundColor White
Write-Host "2. D:\Project1000\CityQuiz" -ForegroundColor White
Write-Host "3. D:\CityQuizProject\CityQuiz" -ForegroundColor White
Write-Host "4. 직접 입력" -ForegroundColor White
Write-Host ""

$choice = Read-Host "선택 (1-4)"

$newPath = switch ($choice) {
    "1" { "D:\CityQuiz" }
    "2" { "D:\Project1000\CityQuiz" }
    "3" { "D:\CityQuizProject\CityQuiz" }
    "4" { Read-Host "새 경로를 입력하세요 (예: D:\CityQuiz)" }
    default { 
        Write-Host "잘못된 선택입니다. D:\CityQuiz를 사용합니다." -ForegroundColor Yellow
        "D:\CityQuiz"
    }
}

# 경로 검증 (ASCII 문자만 확인)
if ($newPath -match '[^\x00-\x7F]') {
    Write-Host "❌ 오류: 새 경로에 비ASCII 문자가 포함되어 있습니다!" -ForegroundColor Red
    Write-Host "   ASCII 문자만 포함하는 경로를 사용하세요." -ForegroundColor Red
    exit 1
}

# 새 경로의 부모 디렉토리 확인
$parentDir = Split-Path -Parent $newPath
if ($parentDir -and -not (Test-Path $parentDir)) {
    Write-Host "부모 디렉토리 생성: $parentDir" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
}

# 대상 경로가 이미 존재하는지 확인
if (Test-Path $newPath) {
    Write-Host "❌ 오류: 대상 경로가 이미 존재합니다: $newPath" -ForegroundColor Red
    Write-Host "   기존 폴더를 삭제하거나 다른 경로를 선택하세요." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "이동 정보:" -ForegroundColor Cyan
Write-Host "  현재: $currentPath" -ForegroundColor White
Write-Host "  새 경로: $newPath" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "계속하시겠습니까? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "취소되었습니다." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "프로젝트 이동 중..." -ForegroundColor Yellow

try {
    # Robocopy를 사용하여 안전하게 이동 (권한 문제 방지)
    $tempPath = "$newPath.tmp"
    
    Write-Host "1단계: 파일 복사 중..." -ForegroundColor Yellow
    $robocopyArgs = @(
        $currentPath,
        $tempPath,
        "/E",           # 하위 디렉토리 포함
        "/COPYALL",     # 모든 속성 복사
        "/R:3",         # 재시도 3회
        "/W:5",         # 대기 5초
        "/NFL",         # 파일 목록 출력 안 함
        "/NDL",         # 디렉토리 목록 출력 안 함
        "/NP",          # 진행률 출력 안 함
        "/NJH",         # 작업 헤더 출력 안 함
        "/NJS"          # 작업 요약 출력 안 함
    )
    
    $result = & robocopy @robocopyArgs
    
    if ($LASTEXITCODE -ge 8) {
        throw "복사 중 오류 발생 (Exit Code: $LASTEXITCODE)"
    }
    
    Write-Host "2단계: 원본 삭제 중..." -ForegroundColor Yellow
    Remove-Item -Path $currentPath -Recurse -Force
    
    Write-Host "3단계: 임시 폴더 이름 변경 중..." -ForegroundColor Yellow
    Rename-Item -Path $tempPath -NewName (Split-Path -Leaf $newPath)
    
    Write-Host ""
    Write-Host "✅ 프로젝트 이동 완료!" -ForegroundColor Green
    Write-Host ""
    Write-Host "다음 단계:" -ForegroundColor Cyan
    Write-Host "1. Android Studio를 완전히 종료하세요" -ForegroundColor White
    Write-Host "2. 새 경로에서 프로젝트를 열세요: $newPath" -ForegroundColor White
    Write-Host "3. Gradle Sync를 실행하세요" -ForegroundColor White
    Write-Host "4. Clean Build를 실행하세요" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "❌ 오류 발생: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "수동으로 이동하는 방법:" -ForegroundColor Yellow
    Write-Host "1. Windows 탐색기에서 프로젝트 폴더를 새 경로로 복사" -ForegroundColor White
    Write-Host "2. 복사가 완료되면 원본 폴더 삭제" -ForegroundColor White
    Write-Host "3. Android Studio에서 새 경로의 프로젝트 열기" -ForegroundColor White
    exit 1
}

