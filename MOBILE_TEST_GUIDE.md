# 📱 Mobile Testing Guide

## 🎉 Your App is Ready!

Congratulations! Your Aerial Trick app is now set up for iOS and Android. Here's how to test it on your phone.

---

## Quick Start

### For iOS (iPhone/iPad)

#### Requirements
- A Mac computer (you have ✅)
- Xcode installed
- An iPhone or iPad
- A USB cable

#### Steps

1. **Open the iOS project in Xcode:**
```bash
cd /Users/keirancho/Downloads/aerial-trick
npx cap open ios
```

2. **Connect your iPhone via USB**

3. **In Xcode:**
   - At the top, next to the play button, click the device dropdown
   - Select your connected iPhone
   - Click the **Play** button (▶️) or press `Cmd + R`
   
4. **Trust your device:**
   - First time: Go to iPhone Settings > General > Device Management
   - Tap your Apple ID and trust it
   
5. **App will launch on your iPhone!** 🎊

---

### For Android

#### Requirements
- Android Studio installed
- An Android phone
- A USB cable

#### Steps

1. **Open the Android project:**
```bash
cd /Users/keirancho/Downloads/aerial-trick
npx cap open android
```

2. **Enable Developer Mode on your Android phone:**
   - Go to Settings > About Phone
   - Tap "Build Number" 7 times
   - Go back to Settings > Developer Options
   - Enable "USB Debugging"

3. **Connect your Android phone via USB**

4. **In Android Studio:**
   - Wait for Gradle to finish syncing
   - At the top, select your device
   - Click the **Run** button (▶️)

5. **App will install and launch!** 🎊

---

## 🔄 Making Changes

After you make changes to your app:

1. **Build the updated version:**
```bash
cd /Users/keirancho/Downloads/aerial-trick
npm run build
```

2. **Sync to mobile:**
```bash
npx cap sync
```

3. **Run on device again:**
   - **iOS:** `npx cap open ios` → Run in Xcode
   - **Android:** `npx cap open android` → Run in Android Studio

---

## ✨ What's Working Now

✅ Home page with tutorials (Easy, Intermediate, Advanced, Drop tabs)  
✅ Admin portal for uploading tutorials  
✅ Collections browser  
✅ Community feed  
✅ Progress tracker  
✅ Profile settings  
✅ Onboarding flow  
✅ User authentication  
✅ Shuffle feature  
✅ Favorites  

---

## ⚠️ What's Temporarily Disabled

For quick testing, we temporarily disabled:

❌ AI Recommendations (needs API routes)  
❌ Daily Trick automation (needs API routes)  
❌ Individual tutorial detail pages (tapping tutorials won't open detail view)  
❌ Individual collection detail pages  

**Don't worry!** We can restore these features later using **Option 2: Hybrid Approach** where your mobile app calls your web app's APIs.

---

## 🎨 Adding Your App Icon

Have your app icon ready? Here's how to add it:

### Step 1: Prepare Your Icon
- Square image (1024x1024px recommended)
- PNG format
- No transparency
- No rounded corners (iOS will round it automatically)

### Step 2: Generate All Sizes

Use a free tool like:
- **App Icon Generator**: https://www.appicon.co/
- **MakeAppIcon**: https://makeappicon.com/

Upload your icon, download the generated files.

### Step 3: Replace Default Icons

#### For iOS:
1. Navigate to: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
2. Replace all the PNG files with your generated icons
3. Update `Contents.json` if needed

#### For Android:
1. Navigate to: `android/app/src/main/res/`
2. Replace icons in these folders:
   - `mipmap-mdpi/`
   - `mipmap-hdpi/`
   - `mipmap-xhdpi/`
   - `mipmap-xxhdpi/`
   - `mipmap-xxxhdpi/`

### Step 4: Rebuild
```bash
npx cap sync
```

---

## 🚀 Next Steps

### Option A: Test Now, Add Features Later (Recommended)
1. ✅ Test the app on your phone today!
2. Get familiar with the mobile experience
3. Later, we'll add back full features using the Hybrid approach

### Option B: Restore All Features First
We can implement **Option 2: Hybrid Approach** where:
- Your web app stays on Vercel (unchanged)
- Mobile app calls `https://your-app.vercel.app/api/*`
- All features work (AI recommendations, daily trick, etc.)

---

## 🐛 Troubleshooting

### Build fails
```bash
cd /Users/keirancho/Downloads/aerial-trick
rm -rf .next out
npm run build
npx cap sync
```

### iOS won't install
- Check Xcode signing (need Apple Developer account for App Store)
- For testing, Free Apple ID works fine

### Android won't install
- Make sure USB Debugging is enabled
- Try different USB cable or port
- Check Android Studio shows your device

---

## 📧 Need Help?

Just describe the error you're seeing and I'll help fix it!

---

## 🎯 Goal

Get your app on your phone TODAY, then we can add more features and polish it for the App Store! 🚀

