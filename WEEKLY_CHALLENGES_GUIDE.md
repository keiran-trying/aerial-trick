# Weekly Challenges Feature Guide

## Overview

The Weekly Challenges feature allows you to create curated tutorial challenges that appear prominently on the homepage. You can set up weekly or monthly challenges, select specific tutorials, and control when they're displayed to users.

## Features

- ✅ Create weekly or monthly challenges
- ✅ Select multiple tutorials for each challenge
- ✅ Set custom start and end dates
- ✅ Toggle challenges on/off without deleting them
- ✅ Beautiful gradient UI on homepage
- ✅ Automatic date-based display (only shows active challenges)
- ✅ Progress tracking display (ready for future implementation)

## Getting Started

### 1. Database Setup

First, run the SQL migration to create the `weekly_challenges` table:

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Open and run the file: `supabase/weekly-challenges.sql`

This will create:
- The `weekly_challenges` table
- Necessary indexes for performance
- Row Level Security (RLS) policies
- Automatic update triggers

### 2. Access Admin Panel

1. Log in as an admin user
2. Navigate to `/admin`
3. Click on the **🏆 Challenges** tab

## Creating a Challenge

### Step 1: Basic Information

1. Click **"Add New Challenge"**
2. Enter a **Title** (e.g., "Master Your Inversions - Week 1")
3. Add an optional **Description** to explain the challenge

### Step 2: Configure Settings

- **Challenge Type**: Choose between:
  - **Weekly**: For 7-day challenges
  - **Monthly**: For 30-day challenges

- **Enabled Toggle**: 
  - ON (default): Challenge will be visible when dates are active
  - OFF: Challenge will be hidden even if dates are active

### Step 3: Set Dates

- **Start Date**: When the challenge should begin appearing
- **End Date**: When the challenge should stop appearing

**Note**: The challenge will ONLY appear on the homepage if:
- The current date is between start and end date
- The challenge is enabled
- At least one tutorial is selected

### Step 4: Select Tutorials

1. Scroll through the list of available tutorials
2. Check the boxes for tutorials you want to include
3. You can select as many tutorials as you want
4. The count of selected tutorials is shown at the top

### Step 5: Save

Click **"Create Challenge"** (or **"Update Challenge"** if editing)

## Managing Challenges

### View All Challenges

In the admin panel, you'll see all challenges with:
- **Active** badge: Currently displayed on homepage
- **Upcoming** badge: Will display in the future
- **Past** badge: Already ended

### Quick Toggle

Use the toggle button (🔘) to quickly enable/disable a challenge without editing it.

### Edit a Challenge

1. Click the pencil icon (✏️) on any challenge
2. Modify any fields
3. Click **"Update Challenge"**

### Delete a Challenge

1. Click the trash icon (🗑️) on any challenge
2. Confirm the deletion

**Warning**: This permanently deletes the challenge. Consider toggling it off instead if you might need it later.

## Homepage Display

### What Users See

When an active challenge exists:
- A purple-to-pink gradient card appears on the homepage
- Shows the challenge title and description
- Displays days remaining
- Lists all selected tutorials with thumbnails
- Shows progress tracking (0/X completed)

### User Interaction

- Users can tap any tutorial in the challenge to view/watch it
- The challenge automatically disappears after the end date
- If no active challenge exists, the section doesn't appear at all

## Best Practices

### Timing

- **Weekly Challenges**: Start on Monday, end on Sunday
- **Monthly Challenges**: Start on the 1st, end on the last day
- Set up challenges in advance by using future start dates

### Tutorial Selection

- Choose 3-5 tutorials for weekly challenges
- Choose 8-12 tutorials for monthly challenges
- Group tutorials by theme (e.g., all inversions, all drops)
- Mix difficulty levels or stick to one difficulty

### Titles & Descriptions

Good examples:
- "Beginner's First Week" - Perfect for newcomers to aerial arts
- "Advanced Drops Challenge" - Master 5 new drops this month
- "Flexibility Focus" - Weekly stretching and conditioning

### Managing Multiple Challenges

- Only one challenge will show at a time (the most recent active one)
- You can create future challenges while one is running
- Use the toggle to quickly switch between challenges if needed

## Troubleshooting

### Challenge doesn't appear on homepage

Check:
- ✅ Challenge is **enabled** (toggle is ON)
- ✅ Current date is between **start and end date**
- ✅ At least one **tutorial is selected**
- ✅ Database migration was run successfully

### Can't create challenges

- Ensure you're logged in as an admin
- Check that the `weekly_challenges` table exists in Supabase
- Verify RLS policies are set up correctly

### Tutorials not showing

- Make sure the tutorials exist and have valid data
- Check that tutorial IDs in the challenge are correct
- Verify tutorials table has proper RLS policies

## Database Schema

The `weekly_challenges` table structure:

```sql
- id: UUID (primary key)
- title: TEXT (required)
- description: TEXT (optional)
- tutorial_ids: UUID[] (array of tutorial IDs)
- start_date: DATE (required)
- end_date: DATE (required)
- is_enabled: BOOLEAN (default true)
- challenge_type: TEXT (weekly or monthly)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## Future Enhancements

Potential features to add:
- User progress tracking (which tutorials they've completed)
- Challenge completion badges
- Leaderboards
- Social sharing when challenge is completed
- Email notifications when new challenges start
- Challenge templates for quick setup

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify all SQL migrations are run
3. Check Supabase logs for database errors
4. Ensure admin permissions are set correctly

---

**Created**: November 2025  
**Last Updated**: November 2025

