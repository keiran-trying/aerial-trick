# 🚀 Quick Start Guide

Get your Aerial Trick app up and running in 10 minutes!

## Step 1: Install Dependencies (1 min)

```bash
npm install
```

## Step 2: Set Up Supabase (3 mins)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for project to be ready (takes ~2 mins)
3. Copy your project URL and anon key from **Settings → API**

## Step 3: Run Database Setup (2 mins)

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `supabase/schema.sql`
3. Paste and click **Run**
4. You should see "Success. No rows returned"

## Step 4: Create Storage Buckets (2 mins)

In Supabase dashboard, go to **Storage**:

1. Click **New Bucket** → Name: `tutorials` → Public: ON → Create
2. Click **New Bucket** → Name: `posts` → Public: ON → Create
3. Click **New Bucket** → Name: `progress-photos` → Public: ON → Create

## Step 5: Configure Environment Variables (1 min)

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
OPENAI_API_KEY=your-openai-key-here
```

**Note**: OpenAI key is optional - the app will use fallback motivational messages if not provided.

## Step 6: Run the App (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## First Steps

1. **Create an Account**: Go to `/auth/login` and sign up
2. **Add a Tutorial** (Admin):
   - Click profile icon → Admin Portal
   - Click "Add New Tutorial"
   - Fill in details and upload a video
3. **Test Daily Trick**: 
   - Run: `curl http://localhost:3000/api/daily-trick -X POST`
   - Refresh home page to see the daily trick

## Troubleshooting

### "Invalid API key" error
- Make sure you copied the correct URL and anon key from Supabase
- Check that `.env.local` file is in the root directory
- Restart the dev server after adding env variables

### "Relation does not exist" error
- Make sure you ran the SQL schema from `supabase/schema.sql`
- Check that all tables were created in SQL Editor

### Videos not uploading
- Make sure you created the storage buckets
- Check that buckets are set to **public**
- Verify bucket names are exactly: `tutorials`, `posts`, `progress-photos`

### Daily Trick not showing
- Run the cron endpoint manually: `curl http://localhost:3000/api/daily-trick -X POST`
- Make sure you have at least one tutorial in the database

## Next Steps

- Read the full [README.md](README.md) for detailed features
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Explore the app and start adding tutorials!

---

Need help? Open an issue on GitHub!

