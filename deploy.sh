#!/bin/bash
# Quick deployment script for Vercel backend

echo "═══════════════════════════════════════════════════"
echo "  Smart Parking Backend - Vercel Deployment"
echo "═══════════════════════════════════════════════════"
echo ""

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git from https://git-scm.com/"
    exit 1
fi

echo "✅ Git found: $(git --version)"
echo ""

# Check if we're in a Git repository
if [ ! -d ".git" ]; then
    echo "🚀 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Smart Parking Backend"
else
    echo "✅ Git repository already initialized"
fi

echo ""
echo "📋 Next steps:"
echo "1. Go to https://github.com/new and create a new repository"
echo "2. Copy the HTTPS URL of your new GitHub repository"
echo "3. Run these commands:"
echo ""
echo "   git remote add origin <YOUR_GITHUB_URL>"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Go to https://vercel.com/dashboard and import your GitHub repo"
echo "5. Add these environment variables in Vercel:"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_SERVICE_KEY"
echo "   - SESSION_SECRET"
echo "6. Click Deploy!"
echo ""
echo "📚 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
