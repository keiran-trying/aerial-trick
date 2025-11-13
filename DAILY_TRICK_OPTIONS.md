# 🌟 Daily Trick: Choose Your Method

You have **3 options** for automatic Daily Trick selection. Pick the one that works best for you!

---

## ✅ Option 1: Vercel (Recommended - Easiest)

**What it is:** Vercel automatically runs your cron job every day at midnight.

### Pros:
- ✅ Completely automatic
- ✅ Free for hobby projects  
- ✅ Already configured in your code
- ✅ Professional hosting with global CDN
- ✅ Zero maintenance

### Cons:
- Requires deploying to Vercel (takes 5 minutes)

### Setup:
1. **Build error is now fixed!** ✅
2. Go to [vercel.com](https://vercel.com)
3. Sign up with GitHub
4. Click "Import Project"
5. Select your `aerial-trick` repo
6. Add environment variables from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY` (optional)
7. Click **Deploy**

**That's it!** The cron job in `vercel.json` will automatically run every day at midnight UTC.

---

## ✅ Option 2: Supabase Edge Functions (100% Free)

**What it is:** Use Supabase's built-in cron system (no Vercel needed).

### Pros:
- ✅ 100% free
- ✅ No need for Vercel
- ✅ Built into Supabase
- ✅ Easy to set up

### Cons:
- Need to create an Edge Function

### Setup:
Follow the instructions in `SUPABASE_CRON_OPTION.md`

---

## ✅ Option 3: Database Trigger (Simplest!)

**What it is:** The app automatically creates today's Daily Trick when users visit.

### Pros:
- ✅ No external services needed
- ✅ Completely automatic
- ✅ Works with any hosting (Vercel, Netlify, or just localhost)
- ✅ Simplest setup

### Cons:
- Daily Trick only updates when someone visits the app
- If no one visits, it might not update exactly at midnight

### Setup:

**Step 1:** Run this SQL in Supabase SQL Editor:

```sql
-- Open supabase/auto-daily-trick-trigger.sql and copy all the code
-- Or just run this:

CREATE OR REPLACE FUNCTION get_or_create_daily_trick()
RETURNS TABLE (
  id UUID,
  tutorial_id UUID,
  date DATE,
  created_at TIMESTAMPTZ
) AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_tutorial_id UUID;
  v_daily_trick RECORD;
BEGIN
  -- Check if there's already a daily trick for today
  SELECT * INTO v_daily_trick
  FROM daily_trick
  WHERE daily_trick.date = v_today;

  -- If not found, create one
  IF NOT FOUND THEN
    -- Get a random tutorial
    SELECT tutorials.id INTO v_tutorial_id
    FROM tutorials
    ORDER BY RANDOM()
    LIMIT 1;

    -- Insert the new daily trick
    IF v_tutorial_id IS NOT NULL THEN
      INSERT INTO daily_trick (tutorial_id, daily_trick.date)
      VALUES (v_tutorial_id, v_today)
      RETURNING * INTO v_daily_trick;
    END IF;
  END IF;

  -- Return the daily trick
  RETURN QUERY 
  SELECT 
    v_daily_trick.id,
    v_daily_trick.tutorial_id,
    v_daily_trick.date,
    v_daily_trick.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_or_create_daily_trick() TO authenticated;
GRANT EXECUTE ON FUNCTION get_or_create_daily_trick() TO anon;
```

**Step 2:** Your app is already updated! ✅

The `daily-trick.tsx` component now automatically calls this function.

**That's it!** Now whenever anyone visits your app, if there's no Daily Trick for today, one will be automatically created. 🎉

---

## 🎯 Which One Should I Choose?

| Option | Best For | Effort | When Updates |
|--------|----------|--------|-------------|
| **1. Vercel** | Production apps | Low | Exactly at midnight UTC |
| **2. Supabase Edge** | Supabase-focused apps | Medium | Exactly at midnight UTC |
| **3. Database Trigger** | Quick setup, testing | Very Low | When first user visits |

### My Recommendation:

- **Right now:** Use **Option 3** (Database Trigger) - just run that SQL and you're done!
- **Later when deploying:** Use **Option 1** (Vercel) - it's the most professional

---

## 🧪 Testing

After setup, test by:

1. Open your app
2. Go to the Home page
3. You should see a Daily Trick displayed
4. Check your database - there should be a row in `daily_trick` table for today's date

---

## 📝 Current Status

✅ Build error fixed  
✅ Database trigger added  
✅ App updated to use auto-create function  
✅ All 3 options available  

**You're all set!** 🎉

