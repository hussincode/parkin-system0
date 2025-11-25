# Vercel Backend Deployment Helper - PowerShell Script
# Usage: Save this as deploy.ps1 and run: .\deploy.ps1

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Smart Parking Backend - Vercel Deployment Helper         ║" -ForegroundColor Cyan
Write-Host "║  This script will help you deploy to Vercel in 5 steps    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
$gitInstalled = $null -ne (Get-Command git -ErrorAction SilentlyContinue)

if (-not $gitInstalled) {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Please download and install Git from:"
    Write-Host "   https://git-scm.com/"
    Write-Host ""
    Write-Host "After installing Git, run this script again."
    exit 1
}

Write-Host "✅ Git is installed: $(git --version)" -ForegroundColor Green
Write-Host ""

# Check Node/npm
$npmInstalled = $null -ne (Get-Command npm -ErrorAction SilentlyContinue)
if ($npmInstalled) {
    Write-Host "✅ npm is installed: $(npm --version)" -ForegroundColor Green
} else {
    Write-Host "⚠️  npm not found in PATH (but might be installed)" -ForegroundColor Yellow
}
Write-Host ""

# Check if Git repo exists
if (-not (Test-Path ".git")) {
    Write-Host "🚀 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit - Smart Parking Backend"
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git repository already exists" -ForegroundColor Green
}
Write-Host ""

# Display next steps
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║              NEXT STEPS - FOLLOW THESE COMMANDS            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 STEP 1: Create GitHub Repository" -ForegroundColor Yellow
Write-Host "   1. Go to: https://github.com/new" -ForegroundColor White
Write-Host "   2. Name: 'smart-parking-backend'" -ForegroundColor White
Write-Host "   3. Click 'Create Repository'" -ForegroundColor White
Write-Host "   4. Copy the HTTPS URL from the page" -ForegroundColor White
Write-Host ""

Write-Host "📋 STEP 2: Add remote and push to GitHub" -ForegroundColor Yellow
Write-Host "   Run these commands (replace <URL> with your GitHub URL):" -ForegroundColor White
Write-Host ""
Write-Host '   git remote add origin <YOUR_GITHUB_URL>' -ForegroundColor Cyan
Write-Host '   git branch -M main' -ForegroundColor Cyan
Write-Host '   git push -u origin main' -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 STEP 3: Deploy to Vercel" -ForegroundColor Yellow
Write-Host "   1. Go to: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "   2. Click 'Add New' → 'Project'" -ForegroundColor White
Write-Host "   3. Select your GitHub repository" -ForegroundColor White
Write-Host "   4. Add these environment variables:" -ForegroundColor White
Write-Host ""
Write-Host "      Name: SUPABASE_URL" -ForegroundColor Magenta
Write-Host '      Value: https://livjynuyaafvijfeaaxe.supabase.co' -ForegroundColor White
Write-Host ""
Write-Host "      Name: SUPABASE_SERVICE_KEY" -ForegroundColor Magenta
Write-Host '      Value: (copy from your .env file)' -ForegroundColor White
Write-Host ""
Write-Host "      Name: SESSION_SECRET" -ForegroundColor Magenta
Write-Host '      Value: (any random strong string)' -ForegroundColor White
Write-Host ""
Write-Host "   5. Click 'Deploy'" -ForegroundColor White
Write-Host "   6. Wait 2-5 minutes for deployment" -ForegroundColor White
Write-Host ""

Write-Host "📋 STEP 4: Test Your Backend" -ForegroundColor Yellow
Write-Host "   After deployment, test with:" -ForegroundColor White
Write-Host ""
Write-Host "   (Get your Vercel URL from the dashboard)" -ForegroundColor White
Write-Host "   Invoke-WebRequest https://YOUR_VERCEL_URL/api/auth/me" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Should return: {""message"":""Authentication required""}" -ForegroundColor Green
Write-Host ""

Write-Host "📋 STEP 5: Update Frontend" -ForegroundColor Yellow
Write-Host "   1. Edit: client/src/lib/api.ts" -ForegroundColor White
Write-Host "   2. Change API_URL to your Vercel URL" -ForegroundColor White
Write-Host "   3. Run: npm run build" -ForegroundColor Cyan
Write-Host "   4. Run: npm start" -ForegroundColor Cyan
Write-Host "   5. Test login in your browser" -ForegroundColor White
Write-Host ""

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                     YOU'RE ALL SET! 🚀                      ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📚 For more help, see:" -ForegroundColor Yellow
Write-Host "   - DEPLOYMENT_GUIDE.md" -ForegroundColor White
Write-Host "   - DEPLOYMENT_CHECKLIST.md" -ForegroundColor White
Write-Host "   - VERCEL_QUICK_START.md" -ForegroundColor White
Write-Host ""

Write-Host "Questions? Check the guides above or visit:" -ForegroundColor Yellow
Write-Host "   - Vercel Docs: https://vercel.com/docs" -ForegroundColor White
Write-Host "   - Supabase Docs: https://supabase.com/docs" -ForegroundColor White
Write-Host ""

Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
