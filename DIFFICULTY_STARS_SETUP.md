# ⭐️ Difficulty Stars Feature Setup

This feature adds sub-levels within each difficulty category, allowing you to mark tutorials with 1-2 stars for finer difficulty distinctions.

---

## 🎯 What This Does:

- **1 Star (⭐️)**: Easier version within the category
- **2 Stars (⭐️⭐️)**: Harder version within the category

For example, in the "Easy" category:
- An "Easy ⭐️" tutorial might be a basic hammock position
- An "Easy ⭐️⭐️" tutorial might be an easy inversion that requires some strength

---

## 🚀 Setup Instructions:

### Step 1: Run the SQL Migration

1. **Go to Supabase Dashboard** → [supabase.com](https://supabase.com)
2. **Select your project**
3. Click **SQL Editor** in the sidebar
4. Click **New query**
5. **Copy and paste this SQL**:

```sql
-- Add difficulty stars column to tutorials table
ALTER TABLE tutorials 
ADD COLUMN IF NOT EXISTS difficulty_stars INTEGER DEFAULT 1 CHECK (difficulty_stars >= 1 AND difficulty_stars <= 2);

-- Add a comment to explain the column
COMMENT ON COLUMN tutorials.difficulty_stars IS 'Sub-level difficulty rating: 1 = easier, 2 = harder within category';

-- Update existing tutorials to have 1 star by default
UPDATE tutorials 
SET difficulty_stars = 1 
WHERE difficulty_stars IS NULL;
```

6. Click **Run** (or press `Cmd+Enter` / `Ctrl+Enter`)
7. You should see **"Success"** ✅

---

### Step 2: Test It!

1. **Open your app** at `http://localhost:3000`
2. **Go to Admin Portal** (Profile → Settings icon)
3. **Click "Add New Tutorial"**
4. You should now see a **"Sub-Level"** selector with 2 star options:
   - ⭐️ Easier
   - ⭐️⭐️ Harder

5. **Upload a tutorial** and assign it stars
6. **View the tutorial** on the Home page - you should see the stars displayed next to the difficulty badge!

---

## 🎨 Where Stars Appear:

Stars will be displayed on:
- ✅ **Tutorial cards** (compact landscape cards)
- ✅ **Tutorial detail pages**
- ✅ **Collections pages**
- ✅ **Favorites page**
- ✅ **Daily Trick**

---

## 📝 Example Usage:

### Easy Category:
- **Basic Hammock ⭐️**: Just sit in the hammock
- **Easy Inversion ⭐️⭐️**: Requires upper body strength

### Intermediate Category:
- **Hip Key ⭐️**: Entry-level intermediate move
- **Bird's Nest ⭐️⭐️**: Advanced intermediate

### Advanced Category:
- **Star Drop ⭐️**: Basic drop
- **Scorpion Drop ⭐️⭐️**: Very advanced

### Drop Category:
- **Cocoon Drop ⭐️**: Controlled drop
- **Ankle Hang Drop ⭐️⭐️**: More challenging drop

---

## 🔄 Editing Existing Tutorials:

All your existing tutorials will default to **1 star (⭐️)**. You can:

1. Go to **Admin Portal**
2. Click **Edit** on any tutorial
3. Change the **Sub-Level** to assign more stars
4. Click **Update Tutorial**

---

## ✅ Done!

Your app now supports difficulty sub-levels! Users can now see at a glance which tutorials are easier or harder within each category. 🎉

---

## 💡 Pro Tips:

- Use 1 star (⭐️) for tutorials that are **easier** and good starting points for that difficulty level
- Use 2 stars (⭐️⭐️) for tutorials that are **harder** and require more practice, strength, or flexibility
- Be consistent with your star ratings to help users progress smoothly!
- When users click on a difficulty tab (Easy, Intermediate, Advanced, Drop), they'll see tutorials grouped by stars with clear labels

