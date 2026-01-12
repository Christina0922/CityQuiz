# PC용 Google Play Games 이미지를 다운로드 폴더로 복사

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$downloadsPath = [Environment]::GetFolderPath("MyDocuments") -replace "Documents", "Downloads"

# 경로 확인
if (-not (Test-Path $downloadsPath)) {
    $downloadsPath = "$env:USERPROFILE\Downloads"
}

Write-Host "📥 다운로드 폴더: $downloadsPath" -ForegroundColor Cyan
Write-Host ""

# 복사할 파일들
$filesToCopy = @(
    @{
        Source = Join-Path $projectRoot "구글플레이리스팅\PC용 Google Play Games 로고\CityQuiz_PC_GPG_Logo_600x400_TRANSPARENT.png"
        Dest = Join-Path $downloadsPath "CityQuiz_PC_GPG_Logo_600x400_TRANSPARENT.png"
        Name = "로고 (600x400)"
    },
    @{
        Source = Join-Path $projectRoot "구글플레이리스팅\PC용 Google Play Games 그래픽 이미지\pc_gpg_graphic_1920x1080_no_text.png"
        Dest = Join-Path $downloadsPath "pc_gpg_graphic_1920x1080_no_text.png"
        Name = "그래픽 이미지 (1920x1080)"
    }
)

$copied = 0
foreach ($file in $filesToCopy) {
    if (Test-Path $file.Source) {
        try {
            Copy-Item -Path $file.Source -Destination $file.Dest -Force
            Write-Host "✅ 복사 완료: $($file.Name)" -ForegroundColor Green
            Write-Host "   → $($file.Dest)" -ForegroundColor Gray
            $copied++
        } catch {
            Write-Host "❌ 복사 실패: $($file.Name) - $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠️ 파일 없음: $($file.Source)" -ForegroundColor Yellow
        Write-Host "   먼저 이미지를 생성해야 합니다." -ForegroundColor Yellow
    }
    Write-Host ""
}

if ($copied -eq $filesToCopy.Count) {
    Write-Host "✅ 모든 파일 복사 완료!" -ForegroundColor Green
    Write-Host "다운로드 폴더를 확인하세요: $downloadsPath" -ForegroundColor Cyan
} elseif ($copied -gt 0) {
    Write-Host "⚠️ 일부 파일만 복사되었습니다." -ForegroundColor Yellow
} else {
    Write-Host "❌ 복사된 파일이 없습니다." -ForegroundColor Red
    Write-Host "이미지를 먼저 생성하세요." -ForegroundColor Yellow
}


