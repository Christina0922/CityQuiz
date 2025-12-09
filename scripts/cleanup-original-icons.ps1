# Remove original icon files (mdpi_48.png, hdpi_72.png, etc.) leaving only ic_launcher.png

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

Write-Host "Cleaning up original icon files...`n" -ForegroundColor Green

$mipmapFolders = @{
    'mdpi' = 'app\src\main\res\mipmap-mdpi'
    'hdpi' = 'app\src\main\res\mipmap-hdpi'
    'xhdpi' = 'app\src\main\res\mipmap-xhdpi'
    'xxhdpi' = 'app\src\main\res\mipmap-xxhdpi'
    'xxxhdpi' = 'app\src\main\res\mipmap-xxxhdpi'
}

$removed = 0

foreach ($density in $mipmapFolders.Keys) {
    $mipmapPath = Join-Path $projectRoot $mipmapFolders[$density]
    
    if (-not (Test-Path $mipmapPath)) {
        continue
    }
    
    # Find PNG files that are NOT ic_launcher.png or ic_launcher_round.png
    $pngFiles = Get-ChildItem -Path $mipmapPath -Filter "*.png" | Where-Object { 
        $_.Name -ne "ic_launcher.png" -and $_.Name -ne "ic_launcher_round.png" 
    }
    
    if ($pngFiles.Count -gt 0) {
        foreach ($file in $pngFiles) {
            Remove-Item $file.FullName -Force
            Write-Host "Removed: $($file.Name) from $($mipmapFolders[$density])" -ForegroundColor Yellow
            $removed++
        }
    }
}

Write-Host "`nCleanup complete!" -ForegroundColor Green
Write-Host "  Removed: $removed original files" -ForegroundColor Cyan

Write-Host "`nFinal verification...`n" -ForegroundColor Cyan

foreach ($density in $mipmapFolders.Keys) {
    $mipmapPath = Join-Path $projectRoot $mipmapFolders[$density]
    
    if (-not (Test-Path $mipmapPath)) {
        continue
    }
    
    $files = Get-ChildItem -Path $mipmapPath
    $pngCount = ($files | Where-Object { $_.Extension -eq ".png" }).Count
    $webpCount = ($files | Where-Object { $_.Extension -eq ".webp" }).Count
    
    Write-Host "$($mipmapFolders[$density]):" -ForegroundColor White
    if ($pngCount -eq 2 -and $webpCount -eq 0) {
        Write-Host "  OK: ic_launcher.png, ic_launcher_round.png" -ForegroundColor Green
    } else {
        Write-Host "  Files: $($files.Count) (PNG: $pngCount, WEBP: $webpCount)" -ForegroundColor Yellow
        foreach ($file in $files) {
            Write-Host "    - $($file.Name)" -ForegroundColor Gray
        }
    }
}

Write-Host "`nDone! Ready to build." -ForegroundColor Green

