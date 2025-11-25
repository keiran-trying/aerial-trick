# 🎥 1GB Upload Setup

## ✅ Updated for Large Tutorial Videos

Your tutorial videos are 300-500MB, so I've set the limit to **1GB (1024MB)** to give you plenty of room.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Open Supabase Dashboard
1. Go to: **https://supabase.com**
2. Sign in
3. Open your **Aerial Trick** project

### Step 2: Run SQL Script
1. Click **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy the **entire file**: 
   ```
   supabase/setup-storage-complete.sql
   ```
4. Paste into SQL Editor
5. Click **Run** (or press Cmd+Enter)

### Step 3: Verify Success
You should see:
```
✅ STORAGE SETUP COMPLETE!
📦 Buckets created:
  ✓ tutorials (public, 1GB limit)
  ✓ posts (public, 50MB limit)
  ✓ progress-photos (public, 10MB limit)
```

### Step 4: Test Upload
1. Go to: **http://localhost:3000/admin**
2. Upload a large tutorial video (300-500MB)
3. **Should work perfectly!** ✅

---

## 📊 What You Get

| Feature | Before | After |
|---------|--------|-------|
| Max file size | 100MB | **1GB** |
| Your 300MB videos | ❌ Fail | ✅ Work |
| Your 500MB videos | ❌ Fail | ✅ Work |
| Upload timeout | 30s | **No limit** |

---

## 💡 File Size Reference

Your tutorials will work great:
- ✅ **300MB videos** - 70% of limit, plenty of room
- ✅ **500MB videos** - 50% of limit, works great
- ✅ **Up to 1GB** - Maximum supported

---

## 🎯 Notes

### Why 1GB?
- Your videos are typically 300-500MB
- 1GB gives you comfortable headroom
- Supports even longer/higher quality videos
- Prevents upload failures

### Video Quality
With 1GB limit, you can upload:
- ✅ Long tutorials (15+ minutes)
- ✅ High resolution (1080p, 4K)
- ✅ High bitrate (better quality)
- ✅ Uncompressed videos

### Supabase Storage Costs
- First 1GB is free
- After that: ~$0.021 per GB per month
- Very affordable for tutorial videos
- Only pay for what you use

---

## 🐛 Troubleshooting

### "Still says 100MB limit"
- Make sure you ran the updated SQL script
- Check: Supabase → Storage → tutorials bucket
- Should show "1 GB" or "1073741824 bytes"

### "Upload still fails"
1. Check browser console (F12) for errors
2. Verify you're logged in
3. Make sure storage policies are set up (SQL script does this)
4. Try a smaller test file first (~50MB) to verify it works

### "Slow upload"
- Normal for large files!
- 300MB can take 2-5 minutes depending on internet
- Progress bar will show upload status
- Don't close the browser tab while uploading

---

## ✅ Checklist

- [ ] Opened Supabase Dashboard
- [ ] SQL Editor opened
- [ ] Copied `setup-storage-complete.sql`
- [ ] Ran the script
- [ ] Saw success message with "1GB limit"
- [ ] Tested uploading a large video
- [ ] Upload worked! 🎉

---

## 🎉 You're All Set!

You can now upload tutorial videos up to **1GB** with no timeouts or errors!

**Ready to upload?** Go to http://localhost:3000/admin and start adding your tutorials! 🚀

---

**Need help?** Let me know if you get any errors!

