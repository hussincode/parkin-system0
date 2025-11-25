# Vercel Backend Deployment Checklist

## Pre-Deployment Checklist

- [ ] Git is installed on your system
- [ ] You have a GitHub account (https://github.com)
- [ ] You have a Vercel account (sign up at https://vercel.com with GitHub)
- [ ] Your Supabase project is created and you have:
  - [ ] SUPABASE_URL copied
  - [ ] SUPABASE_SERVICE_KEY copied (NOT the anon key)

## Deployment Steps Checklist

### Step 1: Git Setup
- [ ] `git init` (initialize Git in your project folder)
- [ ] `git add .` (stage all files)
- [ ] `git commit -m "Initial commit"` (commit)
- [ ] Create GitHub repository
- [ ] `git remote add origin <GITHUB_URL>`
- [ ] `git push -u origin main` (push to GitHub)

### Step 2: Vercel Import
- [ ] Go to https://vercel.com/dashboard
- [ ] Click "Add New" → "Project"
- [ ] Select your GitHub repo
- [ ] Confirm project settings (Root Directory = `./`)

### Step 3: Environment Variables (in Vercel)
- [ ] Add `SUPABASE_URL` = `https://livjynuyaafvijfeaaxe.supabase.co`
- [ ] Add `SUPABASE_SERVICE_KEY` = (your service role key from Supabase)
- [ ] Add `SESSION_SECRET` = (random strong string)

### Step 4: Deploy
- [ ] Click "Deploy" button
- [ ] Wait for deployment to complete (2-5 minutes)
- [ ] Copy your deployment URL (e.g., `https://smart-parking-backend.vercel.app`)

### Step 5: Test Backend
- [ ] Open browser to `https://your-vercel-url/api/auth/me`
- [ ] Should see: `{"message": "Authentication required"}`
- [ ] Test signup endpoint (see guide for command)
- [ ] Test login endpoint (see guide for command)

### Step 6: Update Frontend
- [ ] Update `client/src/lib/api.ts` with Vercel URL
- [ ] Or add `VITE_API_URL` to `client/.env.production`
- [ ] Rebuild frontend: `npm run build`
- [ ] Test locally: `npm start`

### Step 7: Ongoing Maintenance
- [ ] Check Vercel dashboard for errors
- [ ] Monitor API logs at https://vercel.com/dashboard → Project → Deployments → Logs
- [ ] For any code changes: `git push` (auto-deploys to Vercel)

---

## File Structure Created

```
project-root/
├── api/
│   └── index.ts                 # ✨ NEW - Vercel serverless handler
├── vercel.json                  # ✨ NEW - Vercel config
├── DEPLOYMENT_GUIDE.md          # ✨ NEW - This guide
├── server/
│   ├── app.ts
│   ├── routes.ts
│   └── supabase-storage.ts
├── client/
│   ├── src/
│   │   ├── lib/
│   │   │   └── api.ts          # 📝 UPDATE - Add Vercel URL here
│   │   └── ...
│   └── ...
├── shared/
│   └── schema.ts
├── package.json                 # Dependencies already include everything needed
└── .env                         # Keep your local credentials here
```

---

## URLs You'll Need

Replace `<PROJECT-NAME>` with your actual Vercel project name:

| Endpoint | URL |
|---|---|
| **Backend Base** | `https://<PROJECT-NAME>.vercel.app` |
| **Auth Me** | `https://<PROJECT-NAME>.vercel.app/api/auth/me` |
| **Login** | `POST https://<PROJECT-NAME>.vercel.app/api/auth/login` |
| **Signup** | `POST https://<PROJECT-NAME>.vercel.app/api/auth/signup` |
| **Scan QR** | `POST https://<PROJECT-NAME>.vercel.app/api/scan` |
| **Register Car** | `POST https://<PROJECT-NAME>.vercel.app/api/cars` |
| **Get Visits** | `GET https://<PROJECT-NAME>.vercel.app/api/visits` |
| **Export Excel** | `GET https://<PROJECT-NAME>.vercel.app/api/visits/export` |

---

## Environment Variables Needed

### In Vercel Dashboard
```
SUPABASE_URL=https://livjynuyaafvijfeaaxe.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SESSION_SECRET=<random-strong-string>
```

### In Your Local `.env` (for testing)
```
SUPABASE_URL=https://livjynuyaafvijfeaaxe.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Next Steps After Deployment

1. ✅ Test backend at your Vercel URL
2. ✅ Update frontend to call your backend
3. ✅ Deploy frontend (optional - Vercel, Netlify, etc.)
4. ✅ Monitor logs in Vercel dashboard
5. ✅ For any updates: just `git push` and Vercel redeploys automatically

---

## Support Commands

```powershell
# Check if Git is installed
git --version

# Check Node version
node --version

# Install dependencies (if needed)
npm install

# Test locally before deploying
npm run dev

# Build and test production version
npm run build
npm start

# Check Git status
git status

# View Git remote
git remote -v
```

Good luck with your deployment! 🚀
