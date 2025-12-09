# 앱 아이콘 생성 스크립트 (PowerShell + ImageMagick)
# 
# 사용법:
# 1. ImageMagick 설치 필요: https://imagemagick.org/script/download.php
# 2. 원본 아이콘 이미지를 'assets/icon-original.png' (1024x1024px 권장)에 저장
# 3. .\scripts\generate-app-icons.ps1 실행

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
$originalIcon = Join-Path $projectRoot "assets\icon-original.png"

# ImageMagick 확인
$magick = Get-Command magick -ErrorAction SilentlyContinue
if (-not $magick) {
    Write-Host "❌ 오류: ImageMagick이 설치되지 않았습니다." -ForegroundColor Red
    Write-Host "   다운로드: https://imagemagick.org/script/download.php" -ForegroundColor Yellow
    Write-Host "   또는: choco install imagemagick" -ForegroundColor Yellow
    exit 1
}

# 원본 파일 확인
if (-not (Test-Path $originalIcon)) {
    Write-Host "❌ 오류: 원본 아이콘을 찾을 수 없습니다." -ForegroundColor Red
    Write-Host "   경로: $originalIcon" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📋 사용 방법:" -ForegroundColor Cyan
    Write-Host "   1. 원본 아이콘 이미지를 assets/icon-original.png에 저장하세요"
    Write-Host "   2. 권장 크기: 1024x1024px 이상 (PNG, 투명 배경)"
    Write-Host "   3. .\scripts\generate-app-icons.ps1 실행"
    exit 1
}

Write-Host "🎨 앱 아이콘 생성 시작...`n" -ForegroundColor Green
Write-Host "📂 원본 파일: $originalIcon`n" -ForegroundColor Cyan

# assets 폴더 확인
$assetsDir = Join-Path $projectRoot "assets"
if (-not (Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir | Out-Null
}

# 아이콘 사이즈 정의
$iconSizes = @{
    'play-store' = 512
    'mdpi' = 48
    'hdpi' = 72
    'xhdpi' = 96
    'xxhdpi' = 144
    'xxxhdpi' = 192
}

$mipmapFolders = @{
    'mdpi' = 'app\src\main\res\mipmap-mdpi'
    'hdpi' = 'app\src\main\res\mipmap-hdpi'
    'xhdpi' = 'app\src\main\res\mipmap-xhdpi'
    'xxhdpi' = 'app\src\main\res\mipmap-xxhdpi'
    'xxxhdpi' = 'app\src\main\res\mipmap-xxxhdpi'
}

# 1. Google Play Console 아이콘 (512x512)
$playStoreIcon = Join-Path $assetsDir "icon-512.png"
Write-Host "📦 Google Play Console 아이콘 생성 중..." -ForegroundColor Yellow
magick $originalIcon -resize "512x512" -background transparent -gravity center -extent 512x512 $playStoreIcon
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ 생성 완료: $playStoreIcon (512x512px)`n" -ForegroundColor Green
} else {
    Write-Host "✗ 생성 실패: $playStoreIcon`n" -ForegroundColor Red
}

# 2. Android mipmap 아이콘들
Write-Host "📱 Android mipmap 아이콘 생성 중...`n" -ForegroundColor Yellow

foreach ($density in $mipmapFolders.Keys) {
    $size = $iconSizes[$density]
    $mipmapDir = Join-Path $projectRoot $mipmapFolders[$density]
    
    if (-not (Test-Path $mipmapDir)) {
        New-Item -ItemType Directory -Path $mipmapDir | Out-Null
    }
    
    $iconPath = Join-Path $mipmapDir "ic_launcher.png"
    $iconRoundPath = Join-Path $mipmapDir "ic_launcher_round.png"
    
    Write-Host "  → mipmap-$density ($size x $size)..." -ForegroundColor Cyan
    magick $originalIcon -resize "${size}x${size}" -background transparent -gravity center -extent ${size}x${size} $iconPath
    magick $originalIcon -resize "${size}x${size}" -background transparent -gravity center -extent ${size}x${size} $iconRoundPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    ✓ 완료`n" -ForegroundColor Green
    } else {
        Write-Host "    ✗ 실패`n" -ForegroundColor Red
    }
}

Write-Host "`n✅ 모든 아이콘 생성 완료!`n" -ForegroundColor Green
Write-Host "📋 생성된 파일:" -ForegroundColor Cyan
Write-Host "   - Google Play Console: assets/icon-512.png (512x512px)"
foreach ($density in $mipmapFolders.Keys) {
    $size = $iconSizes[$density]
    $folder = $mipmapFolders[$density]
    Write-Host "   - Android mipmap-$density : $folder/ic_launcher.png ($size x $size)"
}
Write-Host "`n💡 다음 단계:" -ForegroundColor Yellow
Write-Host "   1. Android Studio에서 앱을 다시 빌드하세요"
Write-Host "   2. Google Play Console에 assets/icon-512.png를 업로드하세요"

