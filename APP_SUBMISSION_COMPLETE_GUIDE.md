# 🚀 Complete App Submission Guide - Aerial Tricks

**Your step-by-step guide to submitting to Apple App Store & Google Play Store**

---

## ✅ Pre-Submission Checklist

Before you submit, make sure you have:

- [x] ✅ Apple Developer Account ($99/year) - **YOU HAVE THIS!**
- [ ] ⏳ Google Play Developer Account ($25 one-time)
- [x] ✅ App name decided: **"Aerial Tricks"**
- [x] ✅ Logo installed
- [ ] ⏳ App Store screenshots (6-8 screenshots)
- [ ] ⏳ Privacy Policy hosted online
- [ ] ⏳ OAuth configured (at least Apple for iOS)
- [x] ✅ App tested and working
- [ ] ⏳ App Store description ready

---

## 📱 PART 1: Build Your App for iOS

### Step 1: Enable Static Export

In `next.config.ts`, uncomment this line:

```typescript
output: 'export',  // UNCOMMENT THIS LINE
```

### Step 2: Build the Web App

```bash
cd /Users/keirancho/Downloads/aerial-trick
npm run build
```

**Expected output:**
```
✓ Generating static pages
✓ Finalizing page optimization
✓ Collecting build traces
✓ Build completed successfully
```

### Step 3: Sync to iOS

```bash
export LANG=en_US.UTF-8
npx cap sync ios
```

### Step 4: Open in Xcode

```bash
npx cap open ios
```

### Step 5: Configure Xcode Project

**In Xcode:**

1. **Select your project** (top left)
2. **General tab:**
   - Display Name: `Aerial Tricks`
   - Bundle Identifier: `com.aerialtrick.app` (already set)
   - Version: `1.0.0`
   - Build: `1`

3. **Signing & Capabilities tab:**
   - Team: Select your Apple Developer account
   - Signing Certificate: Automatic
   - Provisioning Profile: Automatic

4. **Info tab:**
   - Check permissions are set (Camera, Photo Library)

### Step 6: Archive the App

1. **Select device:** Any iOS Device (not simulator!)
2. **Menu:** Product → Archive
3. Wait for archive to complete (~5-10 minutes)
4. Archive window will open automatically

### Step 7: Upload to App Store Connect

1. In Archive Organizer, click **Distribute App**
2. Select **App Store Connect**
3. Click **Upload**
4. Select **Automatically manage signing**
5. Click **Upload**
6. Wait for upload to complete (10-20 minutes depending on file size)

---

## 🍎 PART 2: Apple App Store Listing

### Step 1: Go to App Store Connect

1. Visit: https://appstoreconnect.apple.com
2. Click **My Apps**
3. Click **+** → **New App**

### Step 2: Fill Basic Information

**App Information:**
- Name: `Aerial Tricks`
- Primary Language: English (U.S.)
- Bundle ID: Select `com.aerialtrick.app`
- SKU: `aerialtricks001` (any unique identifier)

Click **Create**

### Step 3: Fill App Store Information

**Version Information (1.0 Prepare for Submission):**

**Name:** 
```
Aerial Tricks
```

**Subtitle (30 chars):**
```
Learn Aerial Yoga Moves
```

**Description:**
```
Master aerial yoga with step-by-step video tutorials! 

Aerial Tricks is your personal aerial yoga instructor, featuring:

✨ HIGH-QUALITY VIDEO TUTORIALS
Learn from clear, professional demonstrations of every move

📈 PROGRESSIVE DIFFICULTY LEVELS
Start with beginner moves and advance at your own pace:
• Easy - Foundation moves
• Medium - Building strength
• Pro - Advanced techniques
• Drop - Spectacular drops

🎯 PERSONALIZED EXPERIENCE
• Daily trick recommendations
• AI-powered suggestions based on your skill level
• Track your progress and achievements
• Build collections of your favorite moves

🌟 COMPREHENSIVE LIBRARY
• Climbs and inversions
• Spins and wraps
• Drops and dismounts
• Safety and technique tips

💪 PROGRESS TRACKING
• Mark tutorials as completed
• Track your learning streak
• Unlock achievements
• See your improvement over time

🎨 BEAUTIFUL, EASY TO USE
• Modern, intuitive interface
• Works offline (coming soon)
• Save your favorite tutorials
• Comment and engage with the community

Whether you're just starting your aerial journey or perfecting advanced drops, Aerial Tricks provides professional instruction to help you safely progress.

Download now and start your aerial yoga adventure! 🧘‍♀️✨
```

**Keywords (100 chars):**
```
aerial yoga,yoga,silk,hammock,fitness,workout,tutorial,tricks,acrobat,flexibility,strength
```

**Support URL:**
```
https://yourdomain.com/support
```
(Use your actual domain or GitHub Pages)

**Privacy Policy URL:**
```
https://yourdomain.com/privacy
```
(REQUIRED - must host privacy policy online first!)

### Step 4: Upload Screenshots

**Required Sizes:**
- **6.5" Display (iPhone 14 Pro Max, 15 Pro Max):** 1290 x 2796 pixels
- **5.5" Display (iPhone 8 Plus):** 1242 x 2208 pixels

**How to Create Screenshots:**

1. Run app in Simulator:
   ```bash
   npx cap open ios
   # Select iPhone 15 Pro Max
   # Run app
   # Take screenshots: Cmd + S
   ```

2. Screenshots location:
   ```
   ~/Desktop/
   ```

3. **What to screenshot:**
   - Homepage (showing daily trick + tabs)
   - Tutorial playing (video player)
   - Progress dashboard
   - Profile settings
   - AI recommendations
   - Collections page

**Need at least 3 screenshots, recommended 6-8!**

### Step 5: App Review Information

**Contact Information:**
- First Name: [Your name]
- Last Name: [Your last name]
- Phone: [Your phone]
- Email: [Your email]

**Demo Account (if needed):**
- Username: `demo@aerialtricks.app`
- Password: `Demo123!`

**Notes for Review:**
```
Aerial Tricks is an aerial yoga learning platform. Users can:
1. Browse video tutorials
2. Watch full tutorials
3. Track their progress
4. Save favorites
5. Get personalized recommendations

All content is appropriate and educational.
```

### Step 6: Age Rating

**Age Rating Questionnaire:**
- Unrestricted Web Access: NO
- Gambling: NO
- Contests: NO
- Made for Kids: NO

**Result should be:** 4+

### Step 7: Pricing

**Price:** Free (for now)
**Availability:** All countries

### Step 8: Submit for Review

1. **Build:** Select the uploaded build
2. **Export Compliance:** Most apps: NO
3. **Advertising Identifier:** NO (unless you use ads)
4. Click **Submit for Review**

**Review Time:** Usually 24-48 hours

---

## 🤖 PART 3: Build Your App for Android

### Step 1: Make Sure Static Export Is Enabled

In `next.config.ts`:
```typescript
output: 'export',  // Should be uncommented
```

### Step 2: Build and Sync

```bash
cd /Users/keirancho/Downloads/aerial-trick
npm run build
npx cap sync android
```

### Step 3: Open in Android Studio

```bash
npx cap open android
```

### Step 4: Generate Signed APK/Bundle

**In Android Studio:**

1. **Menu:** Build → Generate Signed Bundle / APK
2. Select **Android App Bundle** (AAB)
3. Click **Next**

### Step 5: Create Keystore (First Time Only)

1. Click **Create new...**
2. Fill in:
   - Key store path: `/Users/keirancho/aerial-tricks-keystore.jks`
   - Password: [Create strong password - SAVE THIS!]
   - Alias: `aerialtricks`
   - Alias password: [Same as above]
   - Validity: 25 years
   - First and Last Name: [Your name]
   - Organization: Aerial Tricks
   - City: [Your city]
   - State: [Your state]
   - Country: US (or your country)
3. Click **OK**

**⚠️ CRITICAL: Save your keystore and passwords! You need them for every update!**

### Step 6: Build Signed Bundle

1. Select your keystore
2. Enter passwords
3. Select **release** build variant
4. Click **Finish**

**Build location:**
```
android/app/release/app-release.aab
```

---

## 📱 PART 4: Google Play Store Listing

### Step 1: Create Developer Account

1. Go to: https://play.google.com/console
2. Pay $25 one-time fee
3. Wait for approval (~1-2 days)

### Step 2: Create New App

1. Click **Create app**
2. Fill in:
   - App name: `Aerial Tricks`
   - Default language: English (United States)
   - App or game: App
   - Free or paid: Free
3. Accept declarations
4. Click **Create app**

### Step 3: Set Up Your App

**Complete these sections:**

#### 1. App Details

**App name:**
```
Aerial Tricks
```

**Short description (80 chars):**
```
Learn aerial yoga with step-by-step video tutorials and track your progress
```

**Full description (4000 chars):**
```
Master aerial yoga with step-by-step video tutorials! 

Aerial Tricks is your personal aerial yoga instructor, featuring:

✨ HIGH-QUALITY VIDEO TUTORIALS
Learn from clear, professional demonstrations of every move

📈 PROGRESSIVE DIFFICULTY LEVELS
Start with beginner moves and advance at your own pace:
• Easy - Foundation moves
• Medium - Building strength
• Pro - Advanced techniques
• Drop - Spectacular drops

🎯 PERSONALIZED EXPERIENCE
• Daily trick recommendations
• AI-powered suggestions based on your skill level
• Track your progress and achievements
• Build collections of your favorite moves

🌟 COMPREHENSIVE LIBRARY
• Climbs and inversions
• Spins and wraps
• Drops and dismounts
• Safety and technique tips

💪 PROGRESS TRACKING
• Mark tutorials as completed
• Track your learning streak
• Unlock achievements
• See your improvement over time

🎨 BEAUTIFUL, EASY TO USE
• Modern, intuitive interface
• Works offline (coming soon)
• Save your favorite tutorials
• Comment and engage with the community

Whether you're just starting your aerial journey or perfecting advanced drops, Aerial Tricks provides professional instruction to help you safely progress.

Download now and start your aerial yoga adventure! 🧘‍♀️✨
```

#### 2. Graphics

**Icon:** 512 x 512 px (use your logo)

**Feature Graphic:** 1024 x 500 px
- Create a banner with your logo + "Aerial Tricks" text

**Screenshots:**
- Minimum 2, recommended 8
- Resolution: 1080 x 1920 px or higher
- Take from Android emulator or device

**Phone screenshots:**
- Use Android Studio emulator (Pixel 6)
- Take screenshots of main features

#### 3. Categorization

**Category:** Health & Fitness
**Tags:** yoga, fitness, workout, tutorial

#### 4. Contact Details

**Email:** [Your email]
**Website:** [Your website]
**Phone:** [Optional]

#### 5. Privacy Policy

**URL:**
```
https://yourdomain.com/privacy
```
(REQUIRED - must host online!)

#### 6. App Content

**Content Rating:**
- Complete questionnaire
- Select: Health & Fitness app
- Result should be: Everyone

**Target Audience:**
- Age: 13+

**Ads:**
- Contains ads: NO (unless you add ads)

**COVID-19 Contact Tracing:**
- NO

**Data Safety:**
- Complete form (what data you collect)
- For Aerial Tricks:
  - Collect: Email, name, usage data
  - Purpose: Account creation, app functionality
  - Encrypted in transit: YES
  - Users can request deletion: YES

### Step 4: Testing

**Internal Testing (Optional but Recommended):**
1. Create internal test track
2. Upload AAB
3. Add your email as tester
4. Test the app before public release

### Step 5: Production Release

1. Go to **Production**
2. Click **Create new release**
3. Upload your `app-release.aab`
4. **Release name:** `1.0.0`
5. **Release notes:**
   ```
   🎉 Welcome to Aerial Tricks!
   
   • Learn aerial yoga with video tutorials
   • Progressive difficulty levels
   • Track your progress
   • Personalized recommendations
   • Beautiful, intuitive interface
   
   Start your aerial yoga journey today!
   ```
6. Click **Save** → **Review release** → **Start rollout to Production**

**Review Time:** Usually 3-7 days

---

## 🎯 QUICK REFERENCE

### iOS Submission Checklist

- [ ] Enable `output: 'export'` in next.config.ts
- [ ] Run `npm run build`
- [ ] Run `npx cap sync ios`
- [ ] Open in Xcode (`npx cap open ios`)
- [ ] Configure signing
- [ ] Archive app
- [ ] Upload to App Store Connect
- [ ] Create app listing
- [ ] Upload screenshots (6.5" + 5.5")
- [ ] Add description, keywords
- [ ] Host privacy policy
- [ ] Submit for review

### Android Submission Checklist

- [ ] Enable `output: 'export'` in next.config.ts
- [ ] Run `npm run build`
- [ ] Run `npx cap sync android`
- [ ] Open in Android Studio
- [ ] Create keystore (first time)
- [ ] Generate signed AAB
- [ ] Create Google Play developer account
- [ ] Create app listing
- [ ] Upload screenshots
- [ ] Add description
- [ ] Host privacy policy
- [ ] Complete data safety form
- [ ] Upload AAB
- [ ] Submit for review

---

## 🐛 Common Issues & Solutions

### iOS Issues

**Issue:** "No signing identity found"
**Solution:** Select your Apple Developer team in Xcode signing settings

**Issue:** "Archive failed"
**Solution:** Make sure you selected "Any iOS Device" not a simulator

**Issue:** "Missing compliance"
**Solution:** Answer NO to export compliance (unless app uses encryption)

### Android Issues

**Issue:** "Keystore not found"
**Solution:** Make sure you saved the keystore path correctly

**Issue:** "Build failed"
**Solution:** Clean project (Build → Clean Project) and rebuild

**Issue:** "Upload failed"
**Solution:** Make sure you're uploading AAB not APK

---

## 📧 Required: Privacy Policy

You MUST host your privacy policy online. Quick options:

### Option 1: GitHub Pages (Free, 5 minutes)

1. Create GitHub account
2. Create repository: `aerialtricks-privacy`
3. Upload `PRIVACY_POLICY.md`
4. Enable GitHub Pages
5. URL will be: `https://yourusername.github.io/aerialtricks-privacy`

### Option 2: Website

Host on your own domain

---

## ⏱️ Timeline

**From Now to Live:**

**Today (2-3 hours):**
- Create screenshots
- Host privacy policy
- Configure OAuth (Apple for iOS)
- Prepare app descriptions

**Tomorrow:**
- Build iOS app
- Submit to App Store
- Build Android app
- Submit to Google Play

**In 1-2 Days:**
- Apple: Review starts (24-48 hours)
- Google: Pay developer fee

**In 3-7 Days:**
- Apple: Usually approved (1-2 days review)
- Google: Usually approved (3-7 days review)

**Total: YOUR APP WILL BE LIVE IN ~1 WEEK!** 🎉

---

## 💡 Pro Tips

1. **Test thoroughly** before submitting
2. **Take beautiful screenshots** - they matter!
3. **Write clear descriptions** - help users understand your app
4. **Respond quickly** to review feedback if any
5. **Celebrate when approved!** 🎊

---

## 🆘 Need Help?

**Common Resources:**
- Apple App Store Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Google Play Console Help: https://support.google.com/googleplay/android-developer
- Capacitor Docs: https://capacitorjs.com/docs

---

## ✨ You're Almost There!

You've built an amazing app. Now it's time to share it with the world! 🌟

**Current Status:**
- ✅ App is built and working
- ✅ Logo is installed
- ✅ Name is perfect: "Aerial Tricks"
- ✅ Apple Developer account approved
- ⏳ Next: Create screenshots & host privacy policy
- ⏳ Then: Submit!

**You got this!** 💪🚀

