# 🔐 OAuth Configuration - Final Steps

## ✅ What's Already Done

I've implemented the OAuth functionality in your app:
- ✅ Added OAuth buttons (Apple, Google, Facebook) to auth form
- ✅ Created callback handler for OAuth redirects
- ✅ Beautiful UI with loading states

## 🔧 What You Need to Do

To make OAuth work, you need to configure each provider in Supabase Dashboard.

---

## 🍎 1. Apple Sign In (REQUIRED for App Store!)

### In Supabase Dashboard:

1. Go to **https://supabase.com/dashboard**
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Apple** and click to enable it
5. Save

**That's it for now!** Apple will work automatically for testing. For production:
- You'll need an Apple Developer account
- Configure in Apple Developer Portal
- Add Services ID and keys to Supabase

---

## 🔵 2. Google Sign In

### Step 1: Create Google Cloud Project

1. Go to **https://console.cloud.google.com**
2. Click **Select a project** (top left) → **New Project**
3. Project name: `Aerial Tricks`
4. Click **Create**
5. Wait for project to be created (~30 seconds)

### Step 2: Configure OAuth Consent Screen (REQUIRED FIRST!)

**This is the branding/consent screen users see when logging in with Google**

1. In Google Cloud Console, go to **APIs & Services** → **OAuth consent screen** (left sidebar)

2. **User Type:**
   - Select **External** (for public app)
   - Click **Create**

3. **App Information:**
   - App name: `Aerial Tricks`
   - User support email: [Your email]
   - App logo: Upload your logo (optional, can skip for now)

4. **App Domain (Optional):**
   - Leave blank for now (can add later)

5. **Developer contact:**
   - Email: [Your email]

6. Click **Save and Continue**

7. **Scopes:**
   - Click **Add or Remove Scopes**
   - Select these basic scopes:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
     - `openid`
   - Click **Update** → **Save and Continue**

8. **Test Users (Optional):**
   - You can add test emails if you want
   - Or skip this (click **Save and Continue**)

9. **Summary:**
   - Review and click **Back to Dashboard**

✅ **OAuth Consent Screen is now configured!**

### Step 3: Create OAuth Credentials

**Now you can create the credentials:**

1. Go to **Credentials** (left sidebar)
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. **Application type:** Select **Web application**
4. **Name:** `Aerial Tricks Web Client`
5. **Authorized redirect URIs** → Click **+ Add URI**
6. Add this URI:
     ```
     https://vasqvnywoeudapffothd.supabase.co/auth/v1/callback
     ```
     _(Replace `vasqvnywoeudapffothd` with your actual Supabase project ID)_

7. Click **Create**

8. **Copy these values:**
   - **Client ID** (looks like: 123456789-abc123.apps.googleusercontent.com)
   - **Client Secret** (looks like: GOCSPX-abc123...)

✅ **Save these somewhere safe! You need them for Supabase!**

### Step 4: Configure in Supabase

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Google** and enable it
3. Paste:
   - Client ID
   - Client Secret
4. Click **Save**

---

## 📘 3. Facebook Sign In

### Step 1: Create Facebook App

1. Go to **https://developers.facebook.com**
2. Click **My Apps** → **Create App**
3. Select **Consumer** type
4. Enter app name: "Aerial Trick"
5. Add **Facebook Login** product
6. In Facebook Login settings:
   - Add Valid OAuth Redirect URI:
     ```
     https://vasqvnywoeudapffothd.supabase.co/auth/v1/callback
     ```
7. Copy from **Settings** → **Basic**:
   - **App ID**
   - **App Secret**

### Step 2: Configure in Supabase

1. Go to Supabase Dashboard → **Authentication** → **Providers**
2. Find **Facebook** and enable it
3. Paste:
   - Client ID (use App ID)
   - Client Secret (use App Secret)
4. Click **Save**

### Step 3: Fix "Invalid Scopes: email" Error (For Testing)

⚠️ **If you see "Invalid Scopes: email" error**, do this:

1. **Go to Facebook App Dashboard** → **App Roles** → **Roles**
2. **Add yourself as Administrator or Tester**:
   - Click **Add Administrators** or **Add Testers**
   - Enter your Facebook email
   - Accept the invitation
3. **Make sure app is in "Development Mode"** (top right corner)
4. **Try OAuth again** - should work! ✅

**For Production:** You'll need to submit the `email` permission for App Review before going live.

---

## 🧪 Testing OAuth

### Test on Localhost:

1. Make sure dev server is running:
   ```bash
   cd /Users/keirancho/Downloads/aerial-trick
   npm run dev
   ```

2. Open **http://localhost:3001/auth/login**

3. Click one of the OAuth buttons (Google, Apple, Facebook)

4. You should be redirected to the provider's login page

5. After successful login, you'll be redirected back to your app

### Expected Behavior:

- ✅ Clicking button opens provider's login page
- ✅ After login, redirects to your app homepage
- ✅ User is logged in automatically
- ✅ Can see user profile in app

---

## 🐛 Troubleshooting

### "Invalid redirect URI" Error

**Fix:**
- Double-check the redirect URI matches exactly
- Must be: `https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback`
- No trailing slashes
- Check for typos

### OAuth Button Does Nothing

**Fix:**
- Check browser console for errors
- Make sure provider is enabled in Supabase
- Verify credentials are correct
- Try clearing browser cache

### Redirects to Wrong Page

**Fix:**
- Check `app/auth/callback/route.ts` exists
- Make sure `redirectTo` URL is correct

### "Provider not found" Error

**Fix:**
- Provider not enabled in Supabase
- Go to Authentication → Providers
- Enable the specific provider

---

## 📱 For Mobile (Later)

When you build for mobile with Capacitor, update OAuth callbacks:

In `capacitor.config.ts`:
```typescript
{
  plugins: {
    App: {
      appUrlScheme: 'aerialtrick'
    }
  }
}
```

Update OAuth redirects to:
```typescript
redirectTo: 'aerialtrick://auth/callback'
```

---

## ✅ Quick Test Checklist

- [ ] Supabase project has all three providers enabled
- [ ] Google: Created OAuth app and added credentials to Supabase
- [ ] Facebook: Created app and added credentials to Supabase
- [ ] Apple: Enabled in Supabase (will configure fully later)
- [ ] Tested Google login on localhost
- [ ] Tested Facebook login on localhost
- [ ] Tested Apple login on localhost (may not work until production)
- [ ] User can see their profile after OAuth login

---

## 🎯 Priority

**For Development/Testing:**
1. **Start with Google** - Easiest to set up
2. **Then Facebook** - Also straightforward
3. **Apple Last** - Works automatically for testing, needs full setup for production

**For App Store Submission:**
- **Apple Sign In is MANDATORY** if you have other OAuth options
- Make sure to fully configure Apple before submitting

---

## 📧 Need Help?

Common issues:
1. **Can't find Supabase Project ID:**
   - It's in your Supabase Dashboard URL
   - Format: `https://supabase.com/dashboard/project/PROJECT_ID`

2. **Don't have Google Cloud account:**
   - Create free account at console.cloud.google.com
   - No credit card needed for OAuth setup

3. **Facebook app review:**
   - Not needed for testing
   - Only needed when going live with many users

---

**Your OAuth is ready to use once you configure the providers in Supabase!** 🚀

The UI is already implemented - just need to add the credentials! ✨


