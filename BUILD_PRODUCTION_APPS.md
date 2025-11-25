# 🏗️ Build Production Apps for App Store Submission

This guide will help you build:
- **iOS App** (`.ipa` file) for Apple App Store
- **Android App** (`.aab` file) for Google Play Store

---

## 📋 Pre-Build Checklist

Before building, make sure:

✅ **App icons installed** (you already did this!)  
✅ **App name updated** to "Aerial Tricks" (done!)  
✅ **Privacy policy live** at https://www.keiranaerial.com/privacy-policy.html (done!)  
✅ **OAuth configured** (Google, Apple - done!)  
✅ **Environment variables** in `.env.local` (should be there!)  

---

## ⚙️ Step 1: Update Next.js Config for Production

Your app needs to be in **static export mode** for Capacitor (mobile builds).

Let me check your `next.config.ts`:

### Expected Configuration:

```typescript
const nextConfig: NextConfig = {
  output: 'export',  // ← This should be UNCOMMENTED for mobile builds
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};
```

**Action needed:**
1. Open `next.config.ts`
2. Make sure `output: 'export'` is **UNCOMMENTED**
3. Save the file

---

## 🍎 Part 1: Build iOS App (.ipa file)

### Requirements:
- ✅ Mac computer (you have this!)
- ✅ Xcode installed
- ✅ Apple Developer Account (enrolled and approved)

---

### Step 1: Build Next.js for Production

```bash
cd /Users/keirancho/Downloads/aerial-trick

# Stop dev server if running (Ctrl+C in terminal)

# Build the production Next.js app
npm run build

# This creates an 'out' folder with your static site
```

**What this does:**
- Compiles your Next.js app
- Creates optimized static files in `/out` folder
- Takes 1-2 minutes

---

### Step 2: Sync to iOS

```bash
# Copy built files to iOS app
npx cap sync ios
```

**What this does:**
- Copies your built Next.js app to iOS project
- Updates iOS native code
- Prepares iOS project for Xcode

---

### Step 3: Open in Xcode

```bash
# Open iOS project in Xcode
npx cap open ios
```

**What happens:**
- Xcode opens
- You'll see your "Aerial Tricks" project

---

### Step 4: Configure Signing in Xcode

This is **CRITICAL** for app submission!

#### 4.1: Select Your Project
1. In Xcode left sidebar, click **"App"** (top item, blue icon)
2. Make sure **"App"** target is selected (not "App.xcworkspace")

#### 4.2: Set Bundle Identifier
1. Click **"Signing & Capabilities"** tab (top)
2. **Bundle Identifier:** Should be `com.keiranaerial.aerialtricks` (or whatever you chose)
   - This MUST match what's in your Apple Developer account!

#### 4.3: Enable Automatic Signing
1. Check **"Automatically manage signing"**
2. **Team:** Select your Apple Developer team from dropdown
   - If you don't see your team, you need to add your Apple ID:
     - Xcode → Settings → Accounts → + → Sign in with Apple Developer account

#### 4.4: Select Provisioning Profile
- Xcode should automatically create/select a provisioning profile
- You should see: **"iPhone Distribution: Your Name"** or similar
- If you see errors, make sure your Apple Developer account is fully approved

---

### Step 5: Archive the App (Create .ipa)

#### 5.1: Select "Any iOS Device"
1. At the top of Xcode, next to "App" name
2. Click the device dropdown (might say "iPhone 15 Pro")
3. Select **"Any iOS Device (arm64)"**

#### 5.2: Archive
1. Menu bar → **Product** → **Archive**
2. Wait 2-5 minutes (Xcode is building your app)
3. When done, **Organizer** window opens automatically

#### 5.3: Distribute to App Store
1. In Organizer window, your archive should be selected
2. Click **"Distribute App"** button (blue button on right)
3. Select **"App Store Connect"**
4. Click **"Next"**
5. Select **"Upload"** (not "Export")
6. Click **"Next"**
7. **Distribution options:**
   - ✅ Strip Swift symbols (recommended)
   - ✅ Upload symbols (recommended)
   - Click **"Next"**
8. **Automatic signing:** Select your team
9. Click **"Next"**
10. Review and click **"Upload"**

**What happens:**
- Your app uploads to App Store Connect
- Takes 5-10 minutes depending on internet speed
- When done, you'll see "Upload Successful" ✅

---

### Step 6: Verify Upload in App Store Connect

1. Go to: https://appstoreconnect.apple.com/
2. Click **"My Apps"**
3. Click your app (or create a new app if you haven't yet)
4. Go to **"TestFlight"** tab
5. Under **"Builds"** section
6. Your build should appear in 10-15 minutes
7. Status: **"Processing"** → **"Ready to Submit"**

✅ **Your iOS app is ready for App Store submission!**

---

## 🤖 Part 2: Build Android App (.aab file)

### Requirements:
- ✅ Android Studio installed (you should have this)
- ✅ Google Play Developer Account (enrolled)

---

### Step 1: Build Next.js (if not already done)

```bash
cd /Users/keirancho/Downloads/aerial-trick

# If you already did this for iOS, skip this step!
npm run build
```

---

### Step 2: Sync to Android

```bash
# Copy built files to Android project
npx cap sync android
```

---

### Step 3: Open in Android Studio

```bash
# Open Android project
npx cap open android
```

**What happens:**
- Android Studio opens
- Project loads (may take 1-2 minutes first time)
- Gradle sync runs automatically

---

### Step 4: Generate Signing Key (First Time Only)

You need a **keystore** to sign your app. This is like a password for your app.

⚠️ **IMPORTANT:** Keep this keystore SAFE! You'll need it for ALL future updates!

#### 4.1: Create Keystore

**In Android Studio:**

1. Menu → **Build** → **Generate Signed Bundle / APK**
2. Select **"Android App Bundle"** (not APK)
3. Click **"Next"**
4. Click **"Create new..."** (under Key store path)

**Fill in details:**
```
Key store path: /Users/keirancho/Downloads/aerial-trick/android/aerial-tricks-release-key.jks
Password: [Create a STRONG password - write it down!]
Confirm password: [Same password]

Key:
Alias: aerial-tricks-key
Password: [Same password as above]
Confirm password: [Same password]
Validity (years): 25

Certificate:
First and Last Name: Keiran Aerial (or your name)
Organizational Unit: Aerial Tricks
Organization: Aerial Tricks
City or Locality: [Your city]
State or Province: [Your state]
Country Code: [Your country, e.g., US, AU, UK]
```

5. Click **"OK"**
6. **WRITE DOWN YOUR PASSWORD!** (you'll need it forever!)

---

### Step 5: Build Signed App Bundle (.aab)

#### 5.1: Continue from Previous Screen

After creating keystore:

1. **Build Variants:** Select **"release"**
2. **Signature Versions:** Check **both V1 and V2**
3. Click **"Next"**

#### 5.2: Destination

1. **Destination folder:** Leave default or choose where to save
2. **Build Variants:** **release**
3. Click **"Finish"**

#### 5.3: Wait for Build

- Android Studio builds your app
- Takes 2-5 minutes
- When done, you'll see a notification in bottom right

#### 5.4: Find Your .aab File

Your `.aab` file is saved at:
```
/Users/keirancho/Downloads/aerial-trick/android/app/release/app-release.aab
```

✅ **Your Android app is ready for Google Play submission!**

---

## 🎉 What You Now Have:

### iOS:
✅ **App uploaded** to App Store Connect  
✅ **Status:** Processing → Will be "Ready to Submit"  
✅ **Next step:** Complete App Store listing, submit for review  

### Android:
✅ **File:** `app-release.aab` in `/android/app/release/`  
✅ **Next step:** Upload to Google Play Console, submit for review  

---

## 📝 Important Files to SAVE:

### For Future Updates:

**iOS:**
- Your Apple Developer account credentials
- Signing certificates (handled by Xcode)

**Android:**
- **KEYSTORE FILE:** `/Users/keirancho/Downloads/aerial-trick/android/aerial-tricks-release-key.jks`
- **KEYSTORE PASSWORD:** [Write it down somewhere safe!]
- **KEY ALIAS:** aerial-tricks-key
- You NEED this keystore for ALL future app updates!

⚠️ **Back up your keystore file!** If you lose it, you can NEVER update your app!

Suggested backup locations:
- iCloud Drive
- Google Drive
- Password manager (for password)
- External hard drive

---

## 🚨 Common Issues & Solutions

### iOS Issues:

**"No provisioning profiles found"**
- Solution: Make sure you're signed in with Apple Developer account in Xcode
- Xcode → Settings → Accounts → Add Apple ID

**"Failed to register bundle identifier"**
- Solution: Bundle ID already exists in App Store Connect
- Use a different bundle ID or manage existing one

**"Your account doesn't have permission"**
- Solution: Wait for Apple Developer enrollment to be fully approved
- Check: developer.apple.com → Account status

### Android Issues:

**"Gradle sync failed"**
- Solution: Click "Try Again" or File → Invalidate Caches → Invalidate and Restart

**"Android SDK not found"**
- Solution: Android Studio → Settings → Android SDK → Install latest SDK

**"Build failed"**
- Solution: Check "Build" tab at bottom for errors
- Usually missing dependencies - click suggested fixes

---

## 🎯 Next Steps After Building:

### For iOS:
1. ✅ Build uploaded to App Store Connect
2. ⏳ Wait for processing (10-30 mins)
3. 📝 Complete App Store listing (screenshots, description, etc.)
4. 🚀 Submit for review
5. ⏰ Wait 1-3 days for Apple review
6. 🎉 App goes live!

### For Android:
1. ✅ Have your `app-release.aab` file
2. 📤 Upload to Google Play Console
3. 📝 Complete Play Store listing (screenshots, description, etc.)
4. 🚀 Submit for review
5. ⏰ Wait 1-7 days for Google review
6. 🎉 App goes live!

---

## 🤔 Need Help?

**If you get stuck:**
- Tell me the exact error message
- Tell me which step you're on
- I'll help you fix it!

---

**Ready to build? Let's do this!** 🚀

