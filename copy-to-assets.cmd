@echo off
echo Copying dist files to Android assets...

REM index.html 복사
copy /Y "dist\index.html" "app\src\main\assets\index.html" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] index.html copied
) else (
    echo [ERROR] Failed to copy index.html
)

REM assets 폴더 복사
if exist "dist\assets" (
    if not exist "app\src\main\assets\assets" mkdir "app\src\main\assets\assets"
    xcopy /Y /E /I "dist\assets\*" "app\src\main\assets\assets\" >nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] assets folder copied
    ) else (
        echo [ERROR] Failed to copy assets folder
    )
)

REM js 폴더 복사 (있는 경우)
if exist "dist\js" (
    if not exist "app\src\main\assets\js" mkdir "app\src\main\assets\js"
    xcopy /Y /E /I "dist\js\*" "app\src\main\assets\js\" >nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] js folder copied
    )
)

REM css 폴더 복사 (있는 경우)
if exist "dist\css" (
    if not exist "app\src\main\assets\css" mkdir "app\src\main\assets\css"
    xcopy /Y /E /I "dist\css\*" "app\src\main\assets\css\" >nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] css folder copied
    )
)

echo.
echo Copy complete!
echo.
echo Files in app/src/main/assets/:
dir /B "app\src\main\assets" 2>nul
echo.
pause

