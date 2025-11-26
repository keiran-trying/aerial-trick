# 🚀 Deploy to Vercel - Quick Guide

## ✅ Code is Ready!

Your code has been pushed to GitHub:
- Repository: `https://github.com/keiran-trying/aerial-trick`
- Branch: `main`
- Latest commit: "Prepare for web deployment - Add auth fixes and admin security"

## Deploy to Vercel in 3 Minutes

### Step 1: Go to Vercel
1. Open [vercel.com](https://vercel.com) in your browser
2. Click **"Sign Up"** or **"Log In"**
3. Choose **"Continue with GitHub"** (easiest option)
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Project
1. Once logged in, click **"Add New..."** → **"Project"**
2. Find your repository: **"keiran-trying/aerial-trick"**
3. Click **"Import"**

### Step 3: Configure Environment Variables
**IMPORTANT:** Before deploying, add your Supabase credentials:

1. Click **"Environment Variables"** section
2. Add these variables (get them from your `.env.local` file):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
OPENAI_API_KEY=your_openai_key_here (if you have one)
CRON_SECRET=your_cron_secret_here (for daily trick automation)
```

To find these values:
- Open your project folder
- Look for `.env.local` file
- Copy the values

### Step 4: Deploy!
1. Leave all other settings as default (Vercel auto-detects Next.js)
2. Click **"Deploy"**
3. Wait 2-3 minutes for the build to complete

### Step 5: Your App is Live! 🎉
- Vercel will give you a URL like: `https://aerial-trick.vercel.app`
- Click it to see your live app!
- Share this URL with anyone

## After Deployment

### Add Your Admin User
1. Go to your live app URL
2. Create an account (sign up)
3. Go to [Supabase Dashboard](https://supabase.com/dashboard)
4. Open your project → SQL Editor
5. Run this query (replace with your email):
```sql
UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';
```
6. Log out and log back in
7. You should now see the Settings icon to access admin portal

### Custom Domain (Optional)
1. In Vercel, go to your project → Settings → Domains
2. Add your custom domain
3. Follow Vercel's instructions to configure DNS

## Troubleshooting

### "Build Failed"
- Check that you added all environment variables
- Make sure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

### "Can't Log In"
- Verify your Supabase credentials are correct
- Check that your Supabase project is active
- Make sure you ran the database migrations (see below)

### Database Setup
If you haven't run the database migrations yet:
1. Go to Supabase Dashboard → SQL Editor
2. Run all `.sql` files from your `supabase/` folder:
   - `schema.sql` (main database)
   - `collections-update.sql` (collections feature)
   - `add-admin-field.sql` (admin security)
   - `setup-storage-complete.sql` (file storage)

## Automatic Updates

Every time you push to GitHub:
- Vercel automatically rebuilds and deploys your app
- No manual deployment needed!

## Your Deployment URLs

- **Production:** https://aerial-trick.vercel.app
- **Preview:** Vercel creates preview URLs for every branch
- **GitHub Repo:** https://github.com/keiran-trying/aerial-trick

---

**🎉 That's it! Your app is live!**

Any questions? Check the Vercel logs if something goes wrong.

