# 🚀 Quick Fix: Video Upload Error

## The Problem
Empty error `{}` when uploading videos = Storage not configured in Supabase.

---

## ✅ Quick Fix (5 Minutes)

### Step 1: Open Supabase Dashboard
1. Go to: **https://supabase.com**
2. Sign in
3. Open your **Aerial Trick** project

### Step 2: Run Setup SQL
1. Click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open this file on your computer:
   ```
   /Users/keirancho/Downloads/aerial-trick/supabase/setup-storage-complete.sql
   ```
4. **Copy the ENTIRE file** (Cmd+A, Cmd+C)
5. **Paste into SQL Editor** (Cmd+V)
6. Click **Run** (or press Cmd+Enter)

### Step 3: Verify Success
You should see:
```
✅ STORAGE SETUP COMPLETE!
📦 Buckets created:
  ✓ tutorials (public, 100MB limit)
  ✓ posts (public, 50MB limit)
  ✓ progress-photos (public, 10MB limit)
🎉 You can now upload videos, thumbnails, and photos!
```

### Step 4: Try Upload Again
1. Go to: **http://localhost:3000/admin**
2. Try uploading a tutorial with video
3. **Should work now!** 🎉

---

## 🔍 Verify Buckets Were Created

In Supabase dashboard:
1. Click **Storage** in left sidebar
2. You should see 3 buckets:
   - **tutorials** (public)
   - **posts** (public)
   - **progress-photos** (public)

---

## ❓ If Still Not Working

### Check 1: Are you logged in?
- Log out and log back in
- Uploads require authentication

### Check 2: Check browser console
1. Press F12 (or Right-click → Inspect)
2. Go to **Console** tab
3. Try upload
4. Look for detailed error message
5. Send me the error!

### Check 3: Verify environment variables
Make sure `.env.local` has:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these from: Supabase Dashboard → Settings → API

---

## 📊 What This Sets Up

✅ **Storage Buckets:**
- `tutorials` - For video files and thumbnails (100MB max)
- `posts` - For community posts (50MB max)
- `progress-photos` - For user progress photos (10MB max)

✅ **Permissions:**
- Authenticated users can upload files
- Everyone can view files (public buckets)
- Users can delete/update their own uploads

✅ **File Types Allowed:**
- Videos: MP4, MOV, AVI, WebM
- Images: JPG, PNG, WebP, GIF

---

## 🎯 Quick Summary

1. ✅ Open Supabase → SQL Editor
2. ✅ Copy/paste `setup-storage-complete.sql`
3. ✅ Run it
4. ✅ Try upload again

**That's it!** 🚀

---

## 💡 Pro Tip

After this is set up once, you'll never have to do it again. The storage buckets and policies will persist forever in your Supabase project.

---

Need help? Let me know what error you're seeing! 😊

