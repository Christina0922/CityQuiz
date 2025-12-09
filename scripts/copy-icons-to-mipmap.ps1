# 아이콘 파일을 각 mipmap 폴더에 복사하는 스크립트
# 
# 사용법:
# 1. 각 사이즈의 아이콘 파일을 준비
# 2. 스크립트 실행: .\scripts\copy-icons-to-mipmap.ps1

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

Write-Host "📱 아이콘 파일 복사 스크립트`n" -ForegroundColor Green

# mipmap 폴더 정의
$mipmapFolders = @{
    'mdpi' = @{
        'folder' = 'app\src\main\res\mipmap-mdpi'
        'size' = '48x48'
    }
    'hdpi' = @{
        'folder' = 'app\src\main\res\mipmap-hdpi'
        'size' = '72x72'
    }
    'xhdpi' = @{
        'folder' = 'app\src\main\res\mipmap-xhdpi'
        'size' = '96x96'
    }
    'xxhdpi' = @{
        'folder' = 'app\src\main\res\mipmap-xxhdpi'
        'size' = '144x144'
    }
    'xxxhdpi' = @{
        'folder' = 'app\src\main\res\mipmap-xxxhdpi'
        'size' = '192x192'
    }
}

# assets 폴더에서 아이콘 파일 찾기
$assetsDir = Join-Path $projectRoot "assets"

Write-Host "📂 assets 폴더에서 아이콘 파일 검색 중...`n" -ForegroundColor Cyan

$copied = 0
$skipped = 0

foreach ($density in $mipmapFolders.Keys) {
    $folder = $mipmapFolders[$density]
    $mipmapPath = Join-Path $projectRoot $folder['folder']
    $size = $folder['size']
    
    # assets 폴더에서 해당 사이즈의 아이콘 파일 찾기
    $iconPatterns = @(
        "icon-$density.png",
        "icon-$size.png",
        "ic_launcher-$density.png",
        "ic_launcher-$size.png"
    )
    
    $found = $false
    
    foreach ($pattern in $iconPatterns) {
        $sourceFile = Join-Path $assetsDir $pattern
        if (Test-Path $sourceFile) {
            # mipmap 폴더 확인/생성
            if (-not (Test-Path $mipmapPath)) {
                New-Item -ItemType Directory -Path $mipmapPath | Out-Null
                Write-Host "📁 폴더 생성: $($folder['folder'])" -ForegroundColor Yellow
            }
            
            # 파일 복사
            $destFile1 = Join-Path $mipmapPath "ic_launcher.png"
            $destFile2 = Join-Path $mipmapPath "ic_launcher_round.png"
            
            Copy-Item $sourceFile $destFile1 -Force
            Copy-Item $sourceFile $destFile2 -Force
            
            Write-Host "✓ 복사 완료: $pattern → $($folder['folder'])/ic_launcher.png" -ForegroundColor Green
            Write-Host "  → $($folder['folder'])/ic_launcher_round.png" -ForegroundColor Green
            $copied++
            $found = $true
            break
        }
    }
    
    if (-not $found) {
        Write-Host "⚠ 파일 없음: mipmap-$density ($size)" -ForegroundColor Yellow
        $skipped++
    }
}

Write-Host "`n✅ 복사 완료!" -ForegroundColor Green
Write-Host "   복사됨: $copied 개" -ForegroundColor Cyan
Write-Host "   건너뜀: $skipped 개" -ForegroundColor Yellow

if ($skipped -gt 0) {
    Write-Host "`n💡 팁:" -ForegroundColor Cyan
    Write-Host "   assets 폴더에 다음 형식의 파일을 넣으면 자동으로 복사됩니다:" -ForegroundColor White
    Write-Host "   - icon-mdpi.png, icon-hdpi.png, icon-xhdpi.png 등" -ForegroundColor White
    Write-Host "   - 또는 icon-48x48.png, icon-72x72.png 등" -ForegroundColor White
}

