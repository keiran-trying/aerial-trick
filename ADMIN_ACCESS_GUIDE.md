# 🔧 Admin Portal Access Guide

## Problem

Your admin portal was disabled during the iOS build process because Next.js static export doesn't support server-side authentication.

## Solution: Two Deployment Modes

### Mode 1: iOS Mobile App (Current)
- Uses `output: 'export'` in `next.config.ts`
- Admin portal works as client-side routes
- Access via: `http://localhost:3000/admin` (in dev) or in the app itself

### Mode 2: Web Admin Portal (For Admin Only)
- Deploy separate web version to Vercel
- Full server-side auth support
- Access via: `https://your-vercel-url.vercel.app/admin`

---

## ✅ I've Restored Admin Routes

**Admin routes are now available:**
- `/admin` - Main dashboard
- `/admin/analytics` - Analytics
- `/admin/users` - User management

**How to access:**

### Option A: In Development (Localhost)
```bash
cd /Users/keirancho/Downloads/aerial-trick
npm run dev
```

Then visit: `http://localhost:3000/admin`

### Option B: In the iOS App
The admin portal works in the app! Just navigate to `/admin` from your profile or settings.

### Option C: Deploy Web Version (Recommended for Admin)

**Deploy to Vercel for easy admin access:**

1. Go to: https://vercel.com
2. Import your GitHub repo
3. Deploy with default settings
4. Access admin at: `https://your-app.vercel.app/admin`

This gives you a web admin portal that's separate from the mobile app!

---

## 🚀 Quick Access Methods

### Method 1: Add Admin Button to Profile (Easiest)

I can add an "Admin Portal" button to your profile page that only shows for admin users.

### Method 2: Type URL Directly

In the iOS app or web browser, go to:
- Local dev: `http://localhost:3000/admin`
- Vercel: `https://your-app.vercel.app/admin`

### Method 3: Bookmark

Bookmark the admin URL for quick access.

---

## 🔐 How Admin Auth Works Now

1. You visit `/admin`
2. If not logged in → Redirects to `/auth/login`
3. After login → Checks if you're admin
4. If admin → Shows dashboard
5. If not admin → Redirects to homepage

**Your admin status is stored in Supabase, so it works everywhere!**

---

## 📱 Where to Access Admin

| Location | Works? | Best For |
|----------|--------|----------|
| iOS App | ✅ Yes | Quick edits on mobile |
| Localhost dev | ✅ Yes | Local development |
| Vercel web | ✅ Yes | **Best for admin work** |

---

## 🎯 Recommended Setup

**For best admin experience:**

1. **Mobile app:** For users (App Store)
2. **Vercel web:** For you as admin
   - Easy access from any computer
   - Better for bulk operations
   - No need to rebuild iOS app for admin changes

---

## 🚀 Quick Deploy to Vercel (5 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd /Users/keirancho/Downloads/aerial-trick
vercel
```

Follow prompts → You'll get a URL like `https://aerial-tricks.vercel.app`

Then access admin at: `https://aerial-tricks.vercel.app/admin`

---

## 💡 Which Method Do You Want?

**Tell me which you prefer:**

1. **Add "Admin Portal" button to profile** (easiest, works in app)
2. **Deploy to Vercel** (best for serious admin work)
3. **Just use localhost** (requires running dev server)

I can help set up whichever you choose!

---

**Current Status:**
- ✅ Admin routes restored
- ✅ Auth protection working
- ✅ Works in iOS app
- ⏳ Waiting for you to choose access method
