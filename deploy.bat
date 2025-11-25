@echo off
REM Quick deployment script for Vercel backend (Windows)

echo ===============================================
echo   Smart Parking Backend - Vercel Deployment
echo ===============================================
echo.

REM Check if Git is installed
where git >nul 2>nul
if errorlevel 1 (
    echo ERROR: Git is not installed.
    echo Please download and install Git from: https://git-scm.com/
    pause
    exit /b 1
)

echo OK: Git is installed
echo.

REM Check if we're in a Git repository
if not exist ".git" (
    echo Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit - Smart Parking Backend"
) else (
    echo OK: Git repository already initialized
)

echo.
echo ========== NEXT STEPS ==========
echo.
echo 1. Go to https://github.com/new and create a new repository
echo 2. Copy the HTTPS URL of your new GitHub repository
echo 3. Run these commands in PowerShell:
echo.
echo    git remote add origin ^<YOUR_GITHUB_URL^>
echo    git branch -M main
echo    git push -u origin main
echo.
echo 4. Go to https://vercel.com/dashboard
echo 5. Click "Add New" ^> "Project"
echo 6. Select your GitHub repository
echo 7. Add environment variables:
echo    - SUPABASE_URL = https://livjynuyaafvijfeaaxe.supabase.co
echo    - SUPABASE_SERVICE_KEY = ^(your service key from Supabase^)
echo    - SESSION_SECRET = ^(any random strong string^)
echo 8. Click "Deploy"
echo.
echo See DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause
