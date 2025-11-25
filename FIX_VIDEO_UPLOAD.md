# 🔧 Fix Video Upload Error

## The Problem

You're getting an empty error `{}` when uploading videos. This means the Supabase storage buckets or policies aren't set up correctly.

---

## ✅ Solution: Set Up Storage in Supabase

### Step 1: Go to Supabase Dashboard

1. Open your browser
2. Go to: **https://supabase.com**
3. Sign in
4. Select your **Aerial Trick** project

---

### Step 2: Create Storage Buckets

#### Option A: Using the UI (EASIEST)

1. In Supabase dashboard, click **Storage** in the left sidebar
2. Click **New Bucket** button
3. Create bucket with these settings:
   - **Name:** `tutorials`
   - **Public bucket:** ✅ Toggle ON
   - Click **Create bucket**

4. Repeat for two more buckets:
   - **Name:** `posts` (Public: ON)
   - **Name:** `progress-photos` (Public: ON)

#### Option B: Using SQL

1. In Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Paste this:

```sql
-- Create tutorials bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('tutorials', 'tutorials', true)
ON CONFLICT (id) DO NOTHING;

-- Create posts bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('posts', 'posts', true)
ON CONFLICT (id) DO NOTHING;

-- Create progress-photos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-photos', 'progress-photos', true)
ON CONFLICT (id) DO NOTHING;
```

4. Click **Run** (or press Cmd+Enter)

---

### Step 3: Set Up Storage Policies

**This is CRITICAL for uploads to work!**

1. In Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Copy ALL the content from the file:
   ```
   supabase/fix-storage-policies.sql
   ```
4. Paste it into the SQL editor
5. Click **Run** (or press Cmd+Enter)

You should see:
```
✅ Storage policies updated successfully!
You can now upload videos, thumbnails, and photos.
```

---

### Step 4: Verify Setup

1. In Supabase dashboard, go to **Storage**
2. You should see 3 buckets:
   - ✅ tutorials
   - ✅ posts
   - ✅ progress-photos

3. Click on **tutorials** bucket
4. You should see an empty folder (that's normal!)

---

### Step 5: Test Upload Again

1. Go back to your admin panel: **http://localhost:3000/admin**
2. Try uploading a tutorial with a video
3. Should work now! 🎉

---

## 🐛 Troubleshooting

### Still Getting Empty Error `{}`?

#### Check 1: Are you logged in?
- Make sure you're logged into the app
- The upload requires authentication
- Try logging out and back in

#### Check 2: Verify buckets exist
In Supabase dashboard → Storage, you should see:
```
tutorials (public)
posts (public)
progress-photos (public)
```

#### Check 3: Check browser console
1. Open browser DevTools (F12 or Right-click → Inspect)
2. Go to Console tab
3. Try upload again
4. Look for detailed error messages

#### Check 4: Verify your .env.local file
Make sure you have:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

To get these:
1. Supabase Dashboard → Settings → API
2. Copy **Project URL** and **anon/public** key

---

## 📝 Quick Commands

### Restart dev server (if needed):
```bash
# Stop current server (Ctrl+C)
cd /Users/keirancho/Downloads/aerial-trick
npm run dev
```

### Check if buckets exist (SQL query):
```sql
SELECT * FROM storage.buckets;
```

### Check if policies exist (SQL query):
```sql
SELECT * FROM pg_policies WHERE tablename = 'objects';
```

---

## ✅ After Setup

Once storage is configured, you'll be able to:
- ✅ Upload tutorial videos (any size, but 100MB recommended max)
- ✅ Upload thumbnails (or auto-generate from video)
- ✅ Upload community post images/videos
- ✅ Upload progress photos

---

## 🎯 Summary

1. **Create 3 storage buckets** in Supabase (tutorials, posts, progress-photos)
2. **Run the fix-storage-policies.sql** script
3. **Try uploading again**

**This should fix the empty `{}` error!** 🚀

Let me know if you still get errors after this setup!

