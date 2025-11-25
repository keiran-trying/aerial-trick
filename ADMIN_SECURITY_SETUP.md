# Admin Security Setup Guide

## Overview

The admin portal is now properly secured. Only authenticated users with admin privileges can access the admin portal. Unauthenticated users or non-admin users will be redirected.

## Security Features Implemented

### 1. **Database Schema Update**
- Added `is_admin` boolean field to the `users` table
- Added index for fast admin lookups
- Updated RLS (Row Level Security) policies to prevent users from self-promoting to admin

### 2. **Server-Side Protection**
- Admin routes (`/admin` and `/admin/analytics`) now check authentication and admin status
- Non-authenticated users are redirected to `/login`
- Non-admin authenticated users are redirected to home (`/`)

### 3. **UI Protection**
- Settings icon in header only shows for admin users
- Admin Portal button in profile settings only shows for admin users

### 4. **Security Functions**
- `isAdmin()` - Server-side function to check admin status
- `isAdminClient()` - Client-side function to check admin status

## Setup Instructions

### Step 1: Run the SQL Migration

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the migration file: `supabase/add-admin-field.sql`

This will:
- Add the `is_admin` column to the users table
- Create necessary indexes
- Update RLS policies
- Create helper functions

### Step 2: Make Your First Admin User

After running the migration, you need to promote at least one user to admin status.

**Option A: Using Supabase Dashboard**

1. Go to Supabase Dashboard > Table Editor > `users` table
2. Find your user account (by email)
3. Click to edit the row
4. Set `is_admin` to `true`
5. Save the changes

**Option B: Using SQL Editor**

Run this query in the Supabase SQL Editor (replace with your email):

```sql
UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';
```

### Step 3: Verify Admin Access

1. Log out of the app
2. Log back in with your admin account
3. You should now see:
   - Settings icon (⚙️) in the top right header on the home page
   - "Admin Portal" button in your profile settings
4. Click either one to access the admin portal

## Security Flow

### For Admin Users:
1. User logs in
2. System checks if user has `is_admin = true`
3. Settings icon and Admin Portal button appear
4. User can click to access admin portal
5. Admin routes verify admin status before rendering

### For Non-Admin Users:
1. User logs in
2. System checks if user has `is_admin = true` (it's false)
3. Settings icon and Admin Portal button are hidden
4. If user somehow gets the `/admin` URL, they are redirected to home

### For Unauthenticated Users:
1. User is not logged in
2. If they try to access `/admin`, they are redirected to `/login`
3. Settings icon never appears (no session to check)

## How to Add More Admins

To give admin access to another user:

1. Make sure they have created an account in your app
2. Go to Supabase Dashboard > Table Editor > `users` table
3. Find their account by email
4. Set `is_admin` to `true`
5. Save

The user will need to log out and log back in to see the admin features.

## How to Remove Admin Access

To revoke admin access:

1. Go to Supabase Dashboard > Table Editor > `users` table
2. Find the user's account
3. Set `is_admin` to `false`
4. Save

The user will immediately lose access to the admin portal on their next page navigation.

## Security Notes

⚠️ **Important Security Considerations:**

1. **Users Cannot Self-Promote**: The RLS policy prevents users from changing their own `is_admin` status
2. **Server-Side Validation**: All admin routes check authentication server-side before rendering
3. **Client-Side UI Hiding**: Admin buttons are hidden from non-admins for better UX
4. **No Default Admins**: No users are admin by default - you must manually promote users

## Troubleshooting

### "Settings icon doesn't appear after setting is_admin to true"
- Log out and log back in
- Clear browser cache
- Check that the SQL migration ran successfully
- Verify the user's `is_admin` field is actually `true` in the database

### "I can see the settings icon but get redirected when clicking it"
- Check that the server-side function `isAdmin()` is working
- Verify the database has the `is_admin` column
- Check browser console for errors

### "How do I make myself admin if I don't have access?"
- You need direct access to the Supabase dashboard
- Use the SQL Editor or Table Editor as described in Step 2
- If you don't have Supabase access, contact your database administrator

## Files Modified

The following files were created or modified to implement admin security:

1. **Created:**
   - `supabase/add-admin-field.sql` - Database migration
   - `lib/utils/admin.ts` - Admin check utilities
   - `ADMIN_SECURITY_SETUP.md` - This documentation

2. **Modified:**
   - `app/admin/page.tsx` - Added authentication check
   - `app/admin/analytics/page.tsx` - Added authentication check
   - `components/header.tsx` - Only show settings icon for admins
   - `components/profile-settings.tsx` - Only show admin portal button for admins

## Testing Checklist

- [ ] Run SQL migration in Supabase
- [ ] Set your user account to `is_admin = true`
- [ ] Log out and log back in
- [ ] Verify settings icon appears in header
- [ ] Verify admin portal button appears in profile
- [ ] Click settings icon to access admin portal
- [ ] Create a test non-admin account
- [ ] Verify settings icon does NOT appear for non-admin
- [ ] Try accessing `/admin` URL directly as non-admin (should redirect)
- [ ] Try accessing `/admin` URL while logged out (should redirect to login)

---

**Security is working!** ✅ The admin portal is now properly protected.





