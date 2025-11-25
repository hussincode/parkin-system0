# Backend Deployment to Vercel - Step by Step Guide

## Overview
You are deploying **only the backend API** to Vercel as serverless functions. The frontend will point to this Vercel URL for all API calls.

---

## STEP 1: Prerequisites
Make sure you have:
- ✅ A GitHub account (https://github.com)
- ✅ A Vercel account (https://vercel.com) - **sign up with GitHub**
- ✅ Git installed locally (download from https://git-scm.com if you don't have it)
- ✅ Your Supabase credentials ready (from `.env`)

---

## STEP 2: Initialize Git & Push to GitHub

### 2.1 Open PowerShell and navigate to your project
```powershell
cd "E:\SmartParkingSystem-1 (1)\RoleSelector (2)\RoleSelector"
```

### 2.2 Initialize Git (if not already done)
```powershell
git init
git add .
git commit -m "Initial commit - Smart Parking Backend"
```

### 2.3 Create a GitHub repository
1. Go to https://github.com/new
2. Name your repo (e.g., `smart-parking-backend`)
3. Click "Create repository"
4. Copy the HTTPS URL

### 2.4 Push your code to GitHub
Replace `<YOUR_GITHUB_REPO_URL>` with the URL from step 2.3:
```powershell
git remote add origin <YOUR_GITHUB_REPO_URL>
git branch -M main
git push -u origin main
```

**Example:**
```powershell
git remote add origin https://github.com/yourusername/smart-parking-backend.git
git branch -M main
git push -u origin main
```

---

## STEP 3: Connect Vercel to Your GitHub Repository

### 3.1 Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**

### 3.2 Import Your GitHub Repository
1. Click **"Import Git Repository"**
2. Paste your GitHub repo URL
3. Click **"Continue"**

### 3.3 Configure Project Settings
- **Project Name**: `smart-parking-backend` (or your choice)
- **Framework Preset**: Select **"Other"** or **"Node.js"**
- **Root Directory**: Leave as `./` (root)

Click **"Continue"** to proceed to environment variables.

---

## STEP 4: Add Environment Variables in Vercel

In the **Environment Variables** section, add these variables:

| Variable Name | Value | Notes |
|---|---|---|
| `SUPABASE_URL` | `https://livjynuyaafvijfeaaxe.supabase.co` | From your `.env` |
| `SUPABASE_SERVICE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | **IMPORTANT**: Use SERVICE_KEY, not anon key |
| `SESSION_SECRET` | Generate a random strong string | Use: `openssl rand -base64 32` or any strong random value |

**Important Notes:**
- ✅ Use `SUPABASE_SERVICE_KEY` (has full DB access)
- ❌ Do NOT use `SUPABASE_KEY` (limited public access)
- Session will NOT persist across different serverless function invocations (this is normal for serverless)

### 4.1 Copy Your Service Key (if you don't have it)
1. Go to https://app.supabase.com/
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Service Role** key (under "service_role")

---

## STEP 5: Deploy

### 5.1 Click "Deploy" in Vercel
Once you've added all environment variables, click the **"Deploy"** button.

**Wait for deployment to complete** (usually 2-5 minutes). You'll see a progress screen.

### 5.2 Get Your Deployment URL
Once deployed, Vercel will show your URL, e.g.:
```
https://smart-parking-backend.vercel.app
```

**Copy this URL** - you'll use it in your frontend.

---

## STEP 6: Test Your Backend

### 6.1 Test a Simple Endpoint
Open your browser and go to:
```
https://smart-parking-backend.vercel.app/api/auth/me
```

You should see:
```json
{"message": "Authentication required"}
```

This is **correct** - it means the API is working (you're not authenticated yet).

### 6.2 Test Signup
Use PowerShell to test signup:
```powershell
$body = @{
  username = "testuser123"
  password = "TestPassword123"
  role = "customer"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://smart-parking-backend.vercel.app/api/auth/signup" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

You should get a response with the user data.

### 6.3 Test Login
```powershell
$body = @{
  username = "testuser123"
  password = "TestPassword123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://smart-parking-backend.vercel.app/api/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

---

## STEP 7: Update Your Frontend to Use This Backend

### 7.1 Update `client/src/lib/api.ts`
Change the base URL from `localhost` to your Vercel URL:

**Before:**
```typescript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
```

**After:**
```typescript
const API_URL = import.meta.env.VITE_API_URL || "https://smart-parking-backend.vercel.app";
```

Or better, use an environment variable. Create `client/.env.production`:
```env
VITE_API_URL=https://smart-parking-backend.vercel.app
```

### 7.2 Rebuild Your Frontend
```powershell
npm run build
```

### 7.3 Test Locally
```powershell
npm start
```

Try the login/signup flow. It should now connect to your Vercel backend.

---

## STEP 8: Deploy Frontend (Optional - to Another Host)

If you want to host the frontend too, you can:

**Option A: Deploy Frontend to Vercel**
1. Create a separate GitHub repo for `client/` folder
2. Deploy that repo to Vercel as a static site

**Option B: Deploy to Netlify**
1. Go to https://app.netlify.com
2. Connect your frontend GitHub repo
3. Build command: `npm run build` (in client folder)
4. Publish directory: `dist`

**Option C: Keep Frontend Local**
- Run `npm start` locally (as you're doing now)
- Frontend connects to Vercel backend API

---

## STEP 9: Monitor Your Backend

### 9.1 View Logs
1. Go to https://vercel.com/dashboard
2. Click your `smart-parking-backend` project
3. Go to **"Deployments"**
4. Click the latest deployment
5. Go to **"Logs"** tab to see real-time logs

### 9.2 Check Performance
1. In your project, go to **"Analytics"** to see request metrics
2. Monitor API response times and errors

---

## Common Issues & Fixes

### Issue: "SUPABASE_URL is not set"
**Fix**: Make sure you added the environment variables in Vercel (Step 4). After adding them, redeploy:
```
Vercel Dashboard → Project → Deployments → Redeploy
```

### Issue: "CORS error" when frontend calls backend
**Fix**: Add CORS headers to `api/index.ts`. (Already included in the current setup, but if needed add:)
```typescript
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
```

### Issue: "Session not persisting" between requests
**Fix**: This is normal for serverless functions. Sessions work within a single request but won't persist to other function invocations. Consider using JWT tokens instead for better serverless compatibility.

### Issue: "Cannot find module 'express'" after deploy
**Fix**: Make sure all dependencies are in `package.json` in the root directory. Run:
```powershell
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

Then redeploy in Vercel.

---

## Summary of Your Setup

- ✅ **Backend**: Deployed on Vercel (serverless functions)
- ✅ **Database**: Supabase (hosted Postgres)
- ✅ **Frontend**: Running locally (or deploy to another host)
- ✅ **API Base URL**: `https://smart-parking-backend.vercel.app`

---

## Quick Reference Commands

```powershell
# Test backend locally before deploying
npm run dev

# Build and test production version
npm run build
npm start

# Push changes to GitHub (Vercel auto-redeploys)
git add .
git commit -m "Your message"
git push

# Check deployment logs
# Go to: https://vercel.com/dashboard → Click project → Deployments → Logs
```

---

## Questions?

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Express Serverless**: https://vercel.com/docs/functions/serverless-functions

Good luck! 🚀
