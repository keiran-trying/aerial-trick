# 📋 App Store Submission Checklist

## ✅ Current Status

### Completed
- [x] Developer accounts registered
- [x] App built and synced to Capacitor
- [x] Store listing content written
- [x] Privacy policy created

### Waiting For
- [ ] Apple Developer account approval (1-2 days)
- [ ] Google Play Console verification (usually instant)

---

## 🎯 Do This Now (While Waiting)

### 1. Test App on Your Devices
- [ ] Test on iPhone (using Xcode)
- [ ] Test on Android (using Android Studio)
- [ ] Check all features work:
  - [ ] Login/Sign up
  - [ ] Browse tutorials
  - [ ] Play videos
  - [ ] Track progress
  - [ ] Favorites
  - [ ] Community feed
  - [ ] Profile settings

### 2. Create App Icon
- [ ] Design 1024x1024px icon
- [ ] Export as PNG without transparency
- [ ] Add to iOS project (ios/App/App/Assets.xcassets/AppIcon.appiconset/)
- [ ] Add to Android project (android/app/src/main/res/mipmap-*/ic_launcher.png)

Need help? Tools to use:
- Canva (easy, free templates)
- Figma (more professional)
- AppIcon.co (generates all sizes)

### 3. Take Screenshots
After testing on your phone, take screenshots:

**iPhone Screenshots Needed:**
- [ ] Home screen with tutorials
- [ ] Video playing
- [ ] Collections browser  
- [ ] Progress tracker
- [ ] Community feed
- [ ] Profile page

Sizes needed:
- [ ] 6.7" display (1290 x 2796)
- [ ] 5.5" display (1242 x 2208)

**Android Screenshots Needed:**
- [ ] Same screens as above
- [ ] At least 2, up to 8 screenshots

### 4. Host Privacy Policy
Your privacy policy needs a public URL.

**Option A: GitHub Pages (Free & Easy)**
```bash
# I can help set this up - it's free and takes 5 minutes
```

**Option B: Use Your Own Website**
If you have a website, just add the privacy policy there.

**Option C: Privacy Policy Hosting Services**
- PrivacyPolicies.com
- TermsFeed.com

- [ ] Host privacy policy
- [ ] Get URL (e.g., https://yourusername.github.io/aerial-trick/privacy)
- [ ] Test URL works

### 5. Set Up Support Email
- [ ] Create or use existing email: support@yourdomain.com
- [ ] Or use personal email if you prefer
- [ ] Make sure you check it regularly

---

## 🍎 When Apple Developer Account is Approved

### A. Prepare Certificates & Signing

1. **Open Xcode:**
```bash
cd /Users/keirancho/Downloads/aerial-trick
npx cap open ios
```

2. **Sign In:**
   - [ ] Xcode → Preferences → Accounts
   - [ ] Add your Apple Developer account
   - [ ] Wait for Xcode to download certificates

3. **Configure Signing:**
   - [ ] Select project in left sidebar
   - [ ] Select "App" target
   - [ ] Go to "Signing & Capabilities" tab
   - [ ] Check "Automatically manage signing"
   - [ ] Select your team from dropdown
   - [ ] Ensure bundle ID matches: com.aerialtrick.app

### B. Update App Information

1. **App Icon:**
   - [ ] Add app icon to Assets.xcassets/AppIcon.appiconset/
   - [ ] Verify all sizes are included

2. **Splash Screen (optional but nice):**
   - [ ] Design splash screen
   - [ ] Add to Assets.xcassets

3. **App Version:**
   - [ ] Set version to 1.0.0
   - [ ] Set build number to 1

### C. Test on Real Device

- [ ] Connect iPhone via USB
- [ ] Select iPhone from device menu
- [ ] Click Run (▶️)
- [ ] Test thoroughly on device
- [ ] Check video playback works
- [ ] Test all navigation

### D. Archive for App Store

1. **Create Archive:**
   - [ ] Select "Any iOS Device" as destination
   - [ ] Product → Archive
   - [ ] Wait for archive to complete (~5-10 min)

2. **Upload to App Store Connect:**
   - [ ] Window → Organizer
   - [ ] Select your archive
   - [ ] Click "Distribute App"
   - [ ] Choose "App Store Connect"
   - [ ] Follow wizard (accept defaults)
   - [ ] Click "Upload"
   - [ ] Wait for upload (~10-30 min depending on size)

### E. Create App Store Listing

1. **Go to App Store Connect:**
   - [ ] Visit https://appstoreconnect.apple.com
   - [ ] Sign in with your developer account

2. **Create New App:**
   - [ ] Click "My Apps" → "+" → "New App"
   - [ ] Select iOS
   - [ ] Name: Aerial Trick
   - [ ] Primary language: English
   - [ ] Bundle ID: com.aerialtrick.app
   - [ ] SKU: aerialtrick01
   - [ ] User Access: Full Access

3. **Fill in App Information:**
   - [ ] Subtitle: "Learn Aerial Yoga & Silks"
   - [ ] Category: Health & Fitness
   - [ ] Content Rights: Check "Yes"
   - [ ] Age Rating: 4+

4. **Add Screenshots:**
   - [ ] Upload 6.7" screenshots (3-10 images)
   - [ ] Upload 5.5" screenshots (3-10 images)

5. **Add Description:**
   - [ ] Copy from APP_STORE_LISTING.md
   - [ ] Keywords: aerial yoga,aerial silks,yoga,fitness...
   - [ ] Support URL: (your website or leave blank)
   - [ ] Marketing URL: (optional)

6. **Add Privacy Policy:**
   - [ ] Paste your privacy policy URL

7. **App Review Information:**
   - [ ] First name: Your name
   - [ ] Last name: Your name
   - [ ] Phone: Your phone
   - [ ] Email: Your email
   - [ ] Notes: "Aerial yoga tutorial app. Test login: (provide test account if needed)"

8. **Version Information:**
   - [ ] What's New: "Initial release of Aerial Trick..."

9. **Build:**
   - [ ] After upload processes (~20-60 min), select your build
   - [ ] If it doesn't appear, wait longer or check email for issues

10. **Submit for Review:**
    - [ ] Click "Add for Review"
    - [ ] Click "Submit to App Review"
    - [ ] Wait 1-7 days for review

---

## 🤖 When Google Play Console is Ready

### A. Generate Signing Key

1. **Open Android Studio:**
```bash
cd /Users/keirancho/Downloads/aerial-trick
npx cap open android
```

2. **Generate Key:**
   - [ ] Build → Generate Signed Bundle / APK
   - [ ] Select "Android App Bundle"
   - [ ] Click "Create new..." (for key store)
   - [ ] Fill in key store details:
     - Key store path: Choose location (save this file!)
     - Password: Create strong password (SAVE THIS!)
     - Alias: aerial-trick-key
     - Password: Same as keystore password (SAVE THIS!)
     - Validity: 25 years
     - First/Last Name: Your name
     - Organization: Your company or personal
     - City, State, Country: Your info
   - [ ] Click OK
   - [ ] **IMPORTANT: Back up this keystore file! You'll need it for all future updates!**

3. **Build Release Bundle:**
   - [ ] Select your keystore
   - [ ] Enter passwords
   - [ ] Click "Next"
   - [ ] Select "release" build variant
   - [ ] Click "Finish"
   - [ ] Wait for build (~5-10 min)
   - [ ] Note location of .aab file

### B. Create Play Store Listing

1. **Go to Play Console:**
   - [ ] Visit https://play.google.com/console
   - [ ] Sign in

2. **Create App:**
   - [ ] Click "Create app"
   - [ ] App name: Aerial Trick
   - [ ] Default language: English (United States)
   - [ ] App or game: App
   - [ ] Free or paid: Free
   - [ ] Accept declarations
   - [ ] Click "Create app"

3. **Fill in Store Listing:**
   - [ ] Short description (80 chars): Copy from APP_STORE_LISTING.md
   - [ ] Full description (4000 chars): Copy from APP_STORE_LISTING.md
   - [ ] App icon: Upload 512x512 PNG
   - [ ] Feature graphic: Create 1024x500 image (can be simple banner)
   - [ ] Screenshots: Upload at least 2 phone screenshots
   - [ ] Category: Health & Fitness
   - [ ] Contact email: Your support email
   - [ ] Privacy policy: Your privacy policy URL

4. **Complete Content Rating:**
   - [ ] Start questionnaire
   - [ ] Select category: Utility, Productivity, Communication, or Other
   - [ ] Answer questions (all "No" for violent/mature content)
   - [ ] Submit for rating
   - [ ] Apply rating to app

5. **Set Up App Access:**
   - [ ] Choose "All functionality is available without restrictions"
   - [ ] Or provide test account if login required

6. **Complete Ads Declaration:**
   - [ ] Does your app contain ads? (probably "No")

7. **Add Target Audience:**
   - [ ] Target age: 13+ or All ages
   - [ ] Complete age selection

8. **Add News Apps Declaration:**
   - [ ] Is this a news app? No

9. **Complete Data Safety:**
   - [ ] Does app collect data? Yes
   - [ ] List data types:
     - [ ] Email address (collected)
     - [ ] User account info (collected)
     - [ ] Photos (optional, user-submitted)
     - [ ] App activity (collected)
   - [ ] Data encryption: Yes, in transit
   - [ ] Can users request deletion? Yes
   - [ ] Submit form

10. **Upload App Bundle:**
    - [ ] Go to "Release" → "Production"
    - [ ] Click "Create new release"
    - [ ] Upload your .aab file
    - [ ] Release name: 1.0.0
    - [ ] Release notes: "Initial release..."
    - [ ] Click "Review release"
    - [ ] Click "Start rollout to Production"

11. **Wait for Review:**
    - [ ] Usually approved within hours to 1 day
    - [ ] Check email for status updates

---

## 🎉 After Approval

### iOS
- [ ] App appears in App Store within 24 hours
- [ ] Share link: https://apps.apple.com/app/[your-app-id]

### Android
- [ ] App appears in Play Store within hours
- [ ] Share link: https://play.google.com/store/apps/details?id=com.aerialtrick.app

---

## 📝 Important Files to Keep Safe

**NEVER LOSE THESE:**

1. **Android Keystore:**
   - File: [keystore-name].jks
   - Location: Where you saved it during key generation
   - Keystore password
   - Key alias: aerial-trick-key
   - Key password
   - **Without this, you cannot update your Android app ever!**

2. **App Store Connect Login:**
   - Apple ID
   - Password
   - 2FA backup codes

3. **Play Console Login:**
   - Google account
   - Password
   - 2FA backup codes

---

## 💰 Costs Paid

- [ ] Apple Developer: $99/year ✓
- [ ] Google Play Console: $25 one-time ✓

---

## 📧 Support

If you run into issues:
1. Check the error message carefully
2. Google the specific error
3. Check Stack Overflow
4. Ask me for help!

---

## 🚀 You're Almost There!

Once both apps are live:
1. Share with friends and family
2. Get initial reviews
3. Gather feedback
4. Plan updates based on user feedback
5. Add new features over time

Good luck! 🎉

