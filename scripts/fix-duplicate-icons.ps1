# Remove duplicate .webp icon files to fix build errors

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

Write-Host "Removing duplicate .webp icon files...`n" -ForegroundColor Green

$mipmapFolders = @{
    'mdpi' = 'app\src\main\res\mipmap-mdpi'
    'hdpi' = 'app\src\main\res\mipmap-hdpi'
    'xhdpi' = 'app\src\main\res\mipmap-xhdpi'
    'xxhdpi' = 'app\src\main\res\mipmap-xxhdpi'
    'xxxhdpi' = 'app\src\main\res\mipmap-xxxhdpi'
}

$removed = 0
$skipped = 0

foreach ($density in $mipmapFolders.Keys) {
    $mipmapPath = Join-Path $projectRoot $mipmapFolders[$density]
    
    if (-not (Test-Path $mipmapPath)) {
        Write-Host "Warning: Folder not found: $($mipmapFolders[$density])" -ForegroundColor Yellow
        $skipped++
        continue
    }
    
    # Find all .webp files
    $webpFiles = Get-ChildItem -Path $mipmapPath -Filter "*.webp"
    
    if ($webpFiles.Count -eq 0) {
        Write-Host "OK: No .webp files in $($mipmapFolders[$density])" -ForegroundColor Green
        continue
    }
    
    # Remove .webp files
    foreach ($file in $webpFiles) {
        Remove-Item $file.FullName -Force
        Write-Host "Removed: $($file.Name) from $($mipmapFolders[$density])" -ForegroundColor Yellow
        $removed++
    }
}

Write-Host "`nCleanup complete!" -ForegroundColor Green
Write-Host "  Removed: $removed .webp files" -ForegroundColor Cyan
Write-Host "  Skipped: $skipped folders" -ForegroundColor Yellow

Write-Host "`nVerifying icon files...`n" -ForegroundColor Cyan

# Verify that only .png files remain
foreach ($density in $mipmapFolders.Keys) {
    $mipmapPath = Join-Path $projectRoot $mipmapFolders[$density]
    
    if (-not (Test-Path $mipmapPath)) {
        continue
    }
    
    $pngFiles = Get-ChildItem -Path $mipmapPath -Filter "*.png"
    $webpFiles = Get-ChildItem -Path $mipmapPath -Filter "*.webp"
    
    Write-Host "$($mipmapFolders[$density]):" -ForegroundColor White
    Write-Host "  PNG files: $($pngFiles.Count)" -ForegroundColor Green
    if ($webpFiles.Count -gt 0) {
        Write-Host "  WARNING: $($webpFiles.Count) .webp files still exist!" -ForegroundColor Red
    }
}

Write-Host "`nDone! You can now rebuild the app." -ForegroundColor Green

