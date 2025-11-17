# 🔄 Merge Duplicate Collections Guide

This guide will help you merge duplicate collections like "open fabric" and "Open fabric" into a single "Open Fabric" collection.

---

## 🎯 What This Does:

1. **Finds all duplicate collections** (case-insensitive)
   - "open fabric", "Open fabric", "OPEN FABRIC" → all treated as duplicates
2. **Merges them into one** with Title Case formatting
   - Result: "Open Fabric"
3. **Updates all tutorials** to point to the merged collection
4. **Prevents future duplicates** with a database constraint

---

## 🚀 How to Run:

### Step 1: Run the Merge Script

1. **Go to [supabase.com](https://supabase.com)**
2. **Select your project**
3. **Click "SQL Editor"** in the sidebar
4. **Click "New query"**
5. **Copy and paste** the entire contents of `supabase/merge-duplicate-collections.sql`
6. **Click "Run"** (or press `Cmd+Enter` / `Ctrl+Enter`)

### Step 2: Verify the Results

After running the script, you should see messages like:
```
NOTICE: Merging duplicates for: open fabric
NOTICE: Merged duplicates into collection ID: xxx-xxx-xxx
NOTICE: ✅ Duplicate collections merged successfully!
NOTICE: All collection names are now in Title Case.
```

### Step 3: Check Your Collections

1. **Refresh your app** at `http://localhost:3000`
2. **Go to the Collections page**
3. You should now see:
   - ✅ "Open Fabric" (merged from "open fabric" and "Open fabric")
   - ✅ "Mermaid"
   - ✅ "Thigh Lock"
   - ✅ All duplicates removed!

---

## ✨ What Changed:

### Before:
```
- mermaid (1 tutorial)
- open fabric (1 tutorial)
- Open fabric (2 tutorials)
- Thigh lock (1 tutorial)
```

### After:
```
- Mermaid (1 tutorial)
- Open Fabric (3 tutorials) ← Merged!
- Thigh Lock (1 tutorial)
```

---

## 🎨 New Collection Behavior:

From now on, when you create collections:

1. **Case doesn't matter** when you type:
   - "open fabric" → becomes "Open Fabric"
   - "OPEN FABRIC" → becomes "Open Fabric"
   - "Open Fabric" → stays "Open Fabric"

2. **Auto-title case** formatting:
   - "thigh lock" → "Thigh Lock"
   - "mermaid drop" → "Mermaid Drop"

3. **Duplicate prevention**:
   - If "Open Fabric" exists, typing "open fabric" will use the existing one
   - No more duplicates! 🎉

---

## 🔒 Database Protection:

The script adds a unique constraint to prevent future duplicates:
- You can't create two collections with the same name (case-insensitive)
- The database will automatically reject duplicates
- Your app will always reuse existing collections

---

## ⚠️ Important Notes:

- **This is a one-time migration** - you only need to run it once
- **All tutorials are preserved** - they'll just point to the merged collection
- **Collection names will be Title Case** - looks more professional!
- **No data is lost** - only duplicates are removed

---

## ❓ FAQ:

**Q: What if I have collections with slightly different names?**  
A: Only exact matches (case-insensitive) are merged. "Open Fabric" and "Open Fabric Drop" are kept separate.

**Q: Can I undo this?**  
A: No need to undo! The merge is safe and improves your data quality.

**Q: Will this affect my tutorials?**  
A: No! All tutorials will keep their collections, just pointing to the merged version.

**Q: What if I run the script twice?**  
A: It's safe! If there are no duplicates, it won't do anything.

---

## ✅ After Running:

Your collections will be clean, professional, and duplicate-free! 🎊

You can continue creating collections as normal, and the app will automatically:
- Format them to Title Case
- Prevent duplicates
- Reuse existing collections when appropriate

---

Need help? Just let me know! 😊

