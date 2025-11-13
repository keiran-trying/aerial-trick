# 🎯 Daily Trick Setup Guide

The Daily Trick feature automatically selects one random tutorial each day and displays it prominently to all users.

## 📱 How It Works

1. **At midnight (00:00 UTC)** every day, the system automatically selects a random tutorial
2. This tutorial becomes the **"Daily Trick"** shown to all users
3. The same tutorial is displayed to **everyone globally** until the next day
4. At the next midnight, a new random tutorial is selected

---

## 🎮 Manual Selection (For Testing)

### Option 1: Admin Portal (Easiest!)
1. Go to **Admin Portal**: `http://localhost:3000/admin`
2. You'll see a purple **"Daily Trick Management"** card at the top
3. Click **"Pick Daily Trick Now"** button
4. A random tutorial will be selected immediately
5. Go to **Home** to see it in the "Daily Trick" section

### Option 2: API Call
```bash
curl -X POST http://localhost:3000/api/daily-trick
```

---

## 🚀 Automatic Daily Selection (Production)

### On Vercel (Automatic)
When you deploy to Vercel, the `vercel.json` file configures automatic execution:

```json
{
  "crons": [
    {
      "path": "/api/cron/daily-trick",
      "schedule": "0 0 * * *"
    }
  ]
}
```

**This runs automatically at midnight UTC every day!** ✅

### On Other Platforms

If you're not using Vercel, you need to set up a cron job to call:
```
https://your-domain.com/api/cron/daily-trick
```

**Cron expression:** `0 0 * * *` (daily at midnight)

**Methods:**
- **GitHub Actions** - Free, reliable
- **Render Cron Jobs** - Built-in on Render
- **Railway Cron** - Available on Railway
- **External Services** - cron-job.org, EasyCron, etc.

---

## 🔒 Security (Optional)

For production, you can add authentication to the cron endpoint:

1. Add to `.env.local`:
```env
CRON_SECRET=your_random_secret_here
```

2. Call the endpoint with:
```bash
curl -X GET https://your-domain.com/api/cron/daily-trick \
  -H "Authorization: Bearer your_random_secret_here"
```

The endpoint is already configured to check for this secret!

---

## 🧪 Testing Locally

### Test 1: Manual Selection
1. Go to Admin Portal
2. Click "Pick Daily Trick Now"
3. Check home screen

### Test 2: API Test
```bash
# Select a daily trick
curl -X POST http://localhost:3000/api/daily-trick

# Get current daily trick
curl http://localhost:3000/api/daily-trick
```

### Test 3: Verify in Database
In Supabase:
```sql
SELECT * FROM daily_trick ORDER BY created_at DESC LIMIT 1;
```

---

## 🐛 Troubleshooting

### Problem: "No tutorials available"
**Solution:** Upload at least one tutorial first!

### Problem: Same tutorial showing multiple days
**Solution:** The daily trick only changes at midnight UTC. To force a new one, use the manual selector.

### Problem: Daily Trick not showing on home screen
**Solution:** 
1. Check if a daily trick exists: `http://localhost:3000/api/daily-trick`
2. If empty, manually select one in Admin Portal
3. Refresh the home page

### Problem: Cron job not running on Vercel
**Solution:**
1. Make sure `vercel.json` is in the root directory
2. Redeploy your app
3. Check Vercel Logs for cron execution
4. Cron jobs only work on **Pro or Enterprise** Vercel plans (not Hobby)

---

## 📊 How Selection Works

1. Query all tutorials from database
2. Pick one randomly using `Math.random()`
3. Check if a daily trick already exists for today
4. If yes, skip. If no, create new entry
5. Store in `daily_trick` table with today's date

**Formula:** Each tutorial has equal chance of being selected!

---

## ⏰ Timezone Notes

- The cron runs at **00:00 UTC** (midnight UTC)
- If you're in a different timezone:
  - PST/PDT: 4pm/5pm previous day
  - EST/EDT: 7pm/8pm previous day
  - CST/CDT: 6pm/7pm previous day
  - GMT: 12am (midnight)

---

## 🎉 First Time Setup

1. **Upload some tutorials** (at least 5-10 for variety)
2. **Go to Admin Portal**
3. **Click "Pick Daily Trick Now"** to select the first one
4. **Check Home screen** to see it appear
5. **Deploy to Vercel** for automatic daily changes

---

That's it! Your Daily Trick system is ready to go! 🚀✨

