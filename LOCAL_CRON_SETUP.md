# 🕐 Local Automatic Daily Trick Setup (For Testing)

If you want to test the automatic daily trick selection **locally** before deploying to Vercel, follow these steps:

## Mac/Linux Setup

### Option 1: Using a Simple Script (Easiest)

1. **Make the script executable**:
```bash
chmod +x /Users/keirancho/Downloads/aerial-trick/scripts/trigger-daily-trick.sh
```

2. **Test it manually**:
```bash
/Users/keirancho/Downloads/aerial-trick/scripts/trigger-daily-trick.sh
```

3. **Set up automatic daily execution** (runs at midnight):
```bash
# Open crontab editor
crontab -e

# Add this line (press 'i' to insert, then paste):
0 0 * * * /Users/keirancho/Downloads/aerial-trick/scripts/trigger-daily-trick.sh

# Save and exit (press ESC, then type :wq and press ENTER)
```

### Option 2: Node Script

Create a simple Node script that runs daily:

```bash
npm install -g node-cron
```

Then run:
```bash
node scripts/daily-cron.js
```

---

## ⚠️ Important Notes:

- **Your dev server must be running** for local cron to work (`npm run dev`)
- **This is only for testing** - in production, Vercel handles it automatically
- **Much easier to just deploy to Vercel** and let it handle everything!

---

## 🚀 Recommended Approach:

**Just deploy to Vercel!** It's free and handles everything automatically. No need for local cron setup.

1. Push to GitHub
2. Deploy to Vercel
3. Never think about it again! ✨

The daily trick will automatically change every day at midnight UTC without you lifting a finger!

