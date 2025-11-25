# 🖥️ Using Admin Panel on Your Mac

You can add tutorials much more easily from your Mac's browser instead of your iPhone!

---

## ✅ Method 1: Run Development Server (EASIEST)

### Step 1: Start the Dev Server
```bash
cd /Users/keirancho/Downloads/aerial-trick
npm run dev
```

Wait for it to start, you'll see something like:
```
▲ Next.js 15.5.6
- Local:        http://localhost:3000
```

### Step 2: Open in Your Browser
1. Open your browser (Chrome, Safari, etc.)
2. Go to: **http://localhost:3000**
3. Log in with your email/password
4. Click your profile icon (top right)
5. Go to **Admin** or navigate to: **http://localhost:3000/admin**

### Step 3: Add Tutorials
You can now:
- ✅ Upload video files from your Mac
- ✅ Fill out forms with keyboard (much faster!)
- ✅ See larger preview
- ✅ Copy/paste descriptions
- ✅ Manage all tutorials easily

### To Stop the Server:
Press **Ctrl+C** in the terminal when you're done.

---

## ✅ Method 2: Deploy to Vercel (For Remote Access)

If you want to access admin from anywhere (not just when running locally):

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Deploy
```bash
cd /Users/keirancho/Downloads/aerial-trick
vercel
```

Follow the prompts:
- Link to existing project? **No**
- Project name? **aerial-trick** (or whatever you want)
- Directory? **.** (just press Enter)

### Step 4: Access Your Site
After deployment, you'll get a URL like:
```
https://aerial-trick-xxx.vercel.app
```

You can access admin at:
```
https://aerial-trick-xxx.vercel.app/admin
```

**Note:** Make sure your `.env.local` variables are also set in Vercel:
- Go to your project on vercel.com
- Settings → Environment Variables
- Add:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📝 Quick Comparison

| Feature | iPhone | Mac Dev Server | Vercel |
|---------|--------|----------------|--------|
| Easy typing | ❌ | ✅ | ✅ |
| File upload | Limited | ✅ Full files | ✅ Full files |
| Large screen | ❌ | ✅ | ✅ |
| Always available | ✅ | ❌ (need to run server) | ✅ |
| No setup needed | ✅ | ❌ | ❌ |

---

## 🎯 Recommended Workflow

**For adding tutorials:**
1. Use **Mac Dev Server** (Method 1)
   - Much faster typing
   - Easier file uploads
   - Better for bulk adding

**For testing/using the app:**
1. Use **iPhone** (your current setup)
   - Test real mobile experience
   - Use while practicing yoga
   - On-the-go access

---

## 🚀 Quick Start (Right Now!)

Let's start the dev server so you can add tutorials:

```bash
cd /Users/keirancho/Downloads/aerial-trick
npm run dev
```

Then open: **http://localhost:3000/admin**

---

## 🔐 Security Note

- The dev server only runs on your Mac (localhost)
- Only you can access it while it's running
- If you deploy to Vercel, make sure to set up proper admin authentication

---

## ❓ Troubleshooting

### "Port 3000 already in use"
Someone else is using port 3000. Kill it:
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### "Can't connect to Supabase"
Make sure your `.env.local` file has:
```
NEXT_PUBLIC_SUPABASE_URL=your_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
```

### "Not authorized"
Make sure you're logged in with an admin account. Check your Supabase dashboard to verify your user has admin privileges.

---

## 💡 Pro Tip

Keep the dev server running while you add multiple tutorials. You can:
1. Upload video
2. Fill form
3. Add tags
4. Submit
5. Go back and add another immediately!

Much faster than on iPhone! 🚀

---

**Ready to add tutorials? Run `npm run dev` and go to http://localhost:3000/admin** 🎉

