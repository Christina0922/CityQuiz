# Icon file rename and build script

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir

Write-Host "Setting up icon files...`n" -ForegroundColor Green

$mipmapFolders = @{
    'mdpi' = 'app\src\main\res\mipmap-mdpi'
    'hdpi' = 'app\src\main\res\mipmap-hdpi'
    'xhdpi' = 'app\src\main\res\mipmap-xhdpi'
    'xxhdpi' = 'app\src\main\res\mipmap-xxhdpi'
    'xxxhdpi' = 'app\src\main\res\mipmap-xxxhdpi'
}

$renamed = 0
$skipped = 0

foreach ($density in $mipmapFolders.Keys) {
    $mipmapPath = Join-Path $projectRoot $mipmapFolders[$density]
    
    if (-not (Test-Path $mipmapPath)) {
        Write-Host "Warning: Folder not found: $($mipmapFolders[$density])" -ForegroundColor Yellow
        $skipped++
        continue
    }
    
    # Find PNG files (excluding ic_launcher.png)
    $pngFiles = Get-ChildItem -Path $mipmapPath -Filter "*.png" | Where-Object { $_.Name -ne "ic_launcher.png" -and $_.Name -ne "ic_launcher_round.png" }
    
    if ($pngFiles.Count -eq 0) {
        # Check if ic_launcher.png already exists
        $existingLauncher = Join-Path $mipmapPath "ic_launcher.png"
        if (Test-Path $existingLauncher) {
            Write-Host "OK: Already set: $($mipmapFolders[$density])/ic_launcher.png" -ForegroundColor Green
            continue
        } else {
            Write-Host "Warning: No PNG file found: $($mipmapFolders[$density])" -ForegroundColor Yellow
            $skipped++
            continue
        }
    }
    
    # Rename first PNG file to ic_launcher.png
    $sourceFile = $pngFiles[0].FullName
    $destFile1 = Join-Path $mipmapPath "ic_launcher.png"
    $destFile2 = Join-Path $mipmapPath "ic_launcher_round.png"
    
    # Remove existing files if any
    if (Test-Path $destFile1) {
        Remove-Item $destFile1 -Force
    }
    if (Test-Path $destFile2) {
        Remove-Item $destFile2 -Force
    }
    
    # Copy files
    Copy-Item $sourceFile $destFile1 -Force
    Copy-Item $sourceFile $destFile2 -Force
    
    Write-Host "OK: Renamed: $($pngFiles[0].Name) -> ic_launcher.png" -ForegroundColor Green
    Write-Host "  -> ic_launcher_round.png ($($mipmapFolders[$density]))" -ForegroundColor Cyan
    $renamed++
}

Write-Host "`nIcon setup complete!" -ForegroundColor Green
Write-Host "  Renamed: $renamed" -ForegroundColor Cyan
Write-Host "  Skipped: $skipped" -ForegroundColor Yellow

Write-Host "`nStarting app build...`n" -ForegroundColor Yellow

# Run Gradle build
$gradlew = Join-Path $projectRoot "gradlew.bat"
if (Test-Path $gradlew) {
    Write-Host "Building... (this may take a while)" -ForegroundColor Cyan
    & $gradlew clean assembleDebug
    
    if ($LASTEXITCODE -eq 0) {
        $apkPath = Join-Path $projectRoot "app\build\outputs\apk\debug\app-debug.apk"
        if (Test-Path $apkPath) {
            Write-Host "`nBuild complete!" -ForegroundColor Green
            Write-Host "`nAPK location: $apkPath" -ForegroundColor Cyan
            Write-Host "`nNext steps:" -ForegroundColor Yellow
            Write-Host "  1. Connect your phone via USB, or" -ForegroundColor White
            Write-Host "  2. Transfer APK to phone and install, or" -ForegroundColor White
            Write-Host "  3. Click 'Run' in Android Studio" -ForegroundColor White
        } else {
            Write-Host "`nWarning: APK file not found." -ForegroundColor Yellow
        }
    } else {
        Write-Host "`nBuild failed" -ForegroundColor Red
    }
} else {
    Write-Host "`nWarning: gradlew.bat not found." -ForegroundColor Yellow
    Write-Host "  Please build from Android Studio." -ForegroundColor White
}
