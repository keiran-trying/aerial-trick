# 📱 Capacitor Setup Notes

## Current Status: IN PROGRESS

We're adding Capacitor to enable iOS and Android builds!

---

## ⚠️ Important Limitations

### Static Export vs Server-Side Features

Capacitor requires a **static export** of your Next.js app, which means:

**❌ What DOESN'T work:**
- Server-side API routes (`/api/*`)
- Server-side rendering (SSR)
- Middleware that requires server
- Dynamic routes with `getServerSideProps`

**✅ What WORKS:**
- Client-side Supabase calls (direct from browser)
- Static pages
- Client components
- Supabase Auth (client-side)
- All your existing UI

---

## 🔧 Workarounds Needed

### 1. API Routes (Currently Breaking Build)

**Problem:** 
- `/api/recommendations` 
- `/api/cron/daily-trick`
- `/api/daily-trick`
- `/api/motivation`

These won't work in static export.

**Solutions:**
1. **Move logic client-side** (✅ Recommended)
   - Call Supabase directly from components
   - Call OpenAI directly (or use edge function)
   
2. **Use Supabase Edge Functions** (✅ Better)
   - Deploy API logic to Supabase
   - Call from mobile app
   
3. **Keep Vercel for API** (✅ Hybrid approach)
   - Mobile app = static export
   - Web app = full Next.js with API routes
   - Mobile calls Vercel APIs via HTTPS

---

## 📝 Next Steps to Complete Setup

### Step 1: Fix API Routes (Choose One Approach)

**Option A: Remove for Now**
- Comment out API routes
- Move recommendations logic client-side
- Build will work

**Option B: Deploy to Supabase Edge Functions**
- Create Edge Functions for each API route
- Update mobile app to call Edge Functions
- Best long-term solution

**Option C: Hybrid Approach**
- Keep web version on Vercel with API routes
- Mobile app calls Vercel APIs
- Two deployments

---

### Step 2: Build Successfully
```bash
npm run build
```

### Step 3: Add Platforms
```bash
npx cap add android
npx cap add ios  # Requires Mac
```

### Step 4: Copy Web Assets
```bash
npx cap copy
```

### Step 5: Open in Native IDEs
```bash
# Android
npx cap open android

# iOS (Mac only)
npx cap open ios
```

---

## 🎯 Recommendation

For your app, I recommend **Option C (Hybrid)**:

**Why:**
- Keep your web app fully functional
- Mobile app works offline
- AI recommendations still work (call Vercel API)
- Easiest to implement

**How it works:**
1. Web version stays on Vercel (unchanged)
2. Mobile build creates static export
3. Mobile app makes HTTPS calls to `https://your-app.vercel.app/api/*`
4. Both share same Supabase backend

---

## 🚀 Current Progress

- ✅ Capacitor installed
- ✅ Capacitor initialized
- ✅ Plugins installed (Camera, Splash Screen, etc.)
- ✅ iOS and Android packages added
- ⏳ Need to resolve API routes
- ⏳ Need to complete first build
- ⏳ Need to add platforms
- ⏳ Need to create app icon

---

## 💡 What's Next

**Let's decide together:**

1. **Want fastest path to testing?**
   - Comment out API routes temporarily
   - Get mobile app running
   - Add back APIs later

2. **Want proper setup?**
   - I'll help move API logic to Supabase Edge Functions
   - Takes longer but cleaner architecture

3. **Want hybrid approach?**
   - Configure mobile to call Vercel APIs
   - Quick and works well

**Which approach do you prefer?** 🤔

