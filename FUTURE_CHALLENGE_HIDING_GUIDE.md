# Future Challenge Tutorial Hiding - Feature Guide

## Overview

Tutorials that are part of future (not-yet-started) challenges are now automatically hidden from regular users everywhere in the app. Admin users can still see these tutorials for preview purposes.

## How It Works

### Automatic Filtering
When tutorials are displayed anywhere in the app, the system:
1. Checks if there are any challenges with `start_date > today`
2. Collects all tutorial IDs from those future challenges
3. Checks if the current user is an admin
4. If not admin: Filters out those tutorials from the display
5. If admin: Shows all tutorials (including future challenge tutorials)

### Where Tutorials Are Hidden

Future challenge tutorials are hidden from regular users in:
- **Homepage Tutorial Tabs** - All difficulty levels
- **Collections Browser** - When viewing collection details
- **AI Recommendations** - Personalized recommendations
- **Daily Trick** - If selected as daily trick
- **Tutorial Shuffle** - Random tutorial picker

### Admin Preview

Admin users can see ALL tutorials, including those in future challenges, allowing them to:
- Preview future challenge content
- Verify tutorial selection before challenge goes live
- Make adjustments to challenges without affecting user experience

## Testing Instructions

### Prerequisites
1. You must have the `weekly_challenges` table set up (see `WEEKLY_CHALLENGES_GUIDE.md`)
2. You must have at least one admin user (see `ADMIN_SECURITY_SETUP.md`)
3. You must have some tutorials in your database

### Test Scenario 1: Create Future Challenge

1. **Log in as Admin**
2. Go to `/admin` → **Challenges** tab
3. Click **"Add New Challenge"**
4. Fill in:
   - Title: "Test Future Challenge"
   - Start Date: **Tomorrow's date** (or any future date)
   - End Date: **One week from start date**
   - Select 2-3 specific tutorials
5. **Enable** the challenge
6. Save the challenge

### Test Scenario 2: Verify Hiding (Regular User)

1. **Log out** from admin account
2. **Log in as a regular user** (or browse as guest)
3. Check the following pages:
   - **Homepage** → Those tutorials should NOT appear in tutorial tabs
   - **Collections** → If those tutorials were in collections, they should NOT appear
   - **AI Recommendations** → Should not recommend those tutorials
   - **Daily Trick** → If it was one of those tutorials, should show nothing or different tutorial
   - **Tutorial Shuffle** → Should not include those tutorials in shuffle pool

✅ **Expected Result**: The selected tutorials are completely hidden from view

### Test Scenario 3: Verify Admin Preview

1. **Log in as Admin**
2. Check the same pages:
   - **Homepage** → Those tutorials SHOULD appear normally
   - **Collections** → Those tutorials SHOULD appear in collections
   - **AI Recommendations** → May recommend those tutorials
   - **Daily Trick** → Can show those tutorials
   - **Tutorial Shuffle** → Includes those tutorials in shuffle pool

✅ **Expected Result**: Admin can see all tutorials including future challenge ones

### Test Scenario 4: Challenge Goes Live

1. Wait until the challenge `start_date` arrives (or update it to today in database)
2. **Log in as regular user**
3. Check homepage - **Challenge banner should appear**
4. Check tutorial pages - **Tutorials are now visible to everyone**

✅ **Expected Result**: Once challenge starts, tutorials become visible to all users

## Manual Database Testing

If you want to quickly test without waiting:

### Make a Challenge Start Today (via Supabase SQL Editor)
```sql
-- Update a future challenge to start today
UPDATE weekly_challenges 
SET start_date = CURRENT_DATE, 
    end_date = CURRENT_DATE + INTERVAL '7 days'
WHERE title = 'Test Future Challenge';
```

### Create Test Future Challenge (via Supabase SQL Editor)
```sql
-- Create a challenge starting tomorrow
INSERT INTO weekly_challenges (
  title,
  description,
  tutorial_ids,
  start_date,
  end_date,
  is_enabled,
  challenge_type
) VALUES (
  'Future Test Challenge',
  'This challenge is in the future',
  ARRAY['tutorial-id-1', 'tutorial-id-2']::UUID[],  -- Replace with actual tutorial IDs
  CURRENT_DATE + INTERVAL '1 day',
  CURRENT_DATE + INTERVAL '8 days',
  true,
  'weekly'
);
```

## Technical Implementation

### Files Modified

1. **`lib/filter-future-tutorials.ts`** (New)
   - Main filtering logic
   - Admin check integration
   - Error handling

2. **`components/tutorial-tabs.tsx`**
   - Homepage tutorial tabs filtering

3. **`components/collection-detail.tsx`**
   - Collection detail view filtering

4. **`components/collection-detail-fixed.tsx`**
   - Alternative collection detail view filtering

5. **`components/collection-detail-modal.tsx`**
   - Collection modal view filtering

6. **`components/ai-recommendations.tsx`**
   - AI recommendations filtering (3 locations)

7. **`components/daily-trick.tsx`**
   - Daily trick filtering (2 locations)

8. **`components/tutorial-shuffle.tsx`**
   - Tutorial shuffle filtering

### Performance Considerations

- The filter function uses a Set for O(1) lookup performance
- Admin check is cached per request
- Filters fail gracefully - if error occurs, shows all tutorials instead of hiding content
- Only one database query per filter call (fetches all future challenges at once)

## Troubleshooting

### Tutorials Still Visible to Regular Users

**Check:**
- Is the challenge `start_date` really in the future? Verify with:
  ```sql
  SELECT title, start_date, CURRENT_DATE, 
         start_date > CURRENT_DATE as is_future
  FROM weekly_challenges;
  ```
- Is the challenge `is_enabled = true`?
- Are the tutorial IDs in the challenge correct?
- Clear browser cache and hard refresh

### Tutorials Not Visible to Anyone (Including Admins)

**Check:**
- Is the admin user properly set up? Verify with:
  ```sql
  SELECT id, email, is_admin FROM users WHERE is_admin = true;
  ```
- Check browser console for errors
- Verify `lib/utils/admin-client.ts` exists and is working

### Tutorials Visible to Admins but Challenge Doesn't Show

**Check:**
- This is expected if challenge hasn't started yet
- The challenge banner only shows when `start_date <= today <= end_date`
- Tutorials are hidden before start_date, but visible to admins

## Security Notes

- Tutorial hiding is enforced at the application level
- Admin status is verified for each filter operation
- Direct API access could still retrieve hidden tutorials (consider adding database RLS policies for additional security)
- This feature is designed for user experience, not absolute security

## Future Enhancements

Potential improvements:
- Add database-level RLS policies for complete security
- Cache future challenge IDs in browser storage for performance
- Add visual indicator on admin views showing which tutorials are in future challenges
- Allow per-tutorial visibility settings (hide from specific pages only)
- Notification system when hidden tutorials become visible

---

**Implementation Date**: December 2024  
**Status**: ✅ Complete and Tested

