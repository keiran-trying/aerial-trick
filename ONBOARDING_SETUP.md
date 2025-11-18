# 🎯 Onboarding Feature Setup

This guide will help you set up the new onboarding feature that asks users about their preferences when they first use the app.

---

## ✅ Step 1: Run the SQL Migration

1. **Go to your Supabase dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open the SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "+ New query"

3. **Copy and paste the SQL script**
   - Open the file: `supabase/user-preferences.sql`
   - Copy all the contents
   - Paste into the SQL Editor

4. **Run the script**
   - Click the "Run" button (or press Cmd/Ctrl + Enter)
   - You should see: "Success. No rows returned"

---

## 🎨 What This Adds

### User Onboarding Flow
When new users (or existing users without preferences) log in, they'll be asked:

1. **What's your skill level?**
   - Beginner 🌱
   - Intermediate 🌿
   - Advanced 🌳

2. **What interests you?**
   - Static Tricks 🧘‍♀️
   - Open Fabric 🎪
   - Thigh Lock 🦵
   - Footlock 👣
   - Inversions 🙃
   - Transitions 🔄
   - Sequences 🎬
   - Other ✨

3. **How about drops?**
   - Yes, I love drops! 🎢
   - Not yet (Maybe later) 🤔

### Personalized Experience
After onboarding:
- Home screen defaults to their chosen difficulty level
- AI recommendations consider their interests and preferences
- Better, more relevant tutorial suggestions

---

## 🔧 Troubleshooting

### Error: "relation already exists"
- This means you already have the table
- The script is safe to run again (uses `IF NOT EXISTS`)

### Error: "permission denied"
- Make sure you're logged in as the database owner
- Check your Supabase project permissions

### Users not being redirected to onboarding
- Clear your browser cache
- Log out and log back in
- Make sure the SQL script ran successfully

---

## 📝 For Existing Users

Existing users will see the onboarding flow the next time they log in. Their preferences will be saved and they can update them later in their profile settings (coming soon!).

---

## 🎉 You're All Set!

Once the SQL script runs successfully:
1. Refresh your app (http://localhost:3000)
2. Log out and log back in (or sign up a new user)
3. You'll see the beautiful new onboarding flow!

---

**Questions or issues?** Let me know and I'll help! 🚀

