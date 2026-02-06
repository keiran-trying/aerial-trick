# 🚀 App Store Launch Guide - January 2026

## ✅ What's Already Done

Great progress! Here's what we've completed:

- ✅ **App configured for iOS** (Bundle ID: `com.keiranaerial.aerialtricks`)
- ✅ **App icons installed** (all sizes)
- ✅ **Privacy policy created** (`privacy-policy.html`)
- ✅ **Static export enabled** for mobile build
- ✅ **iOS project synced** with latest build
- ✅ **Version 1.0, Build 2** configured

---

## 📋 What You Need to Do This Month

### Step 1: Enable GitHub Pages (5 minutes)

Your privacy policy needs to be accessible online.

1. Go to: https://github.com/keiran-trying/aerial-trick/settings/pages
2. Under "Source":
   - Select **Deploy from a branch**
   - Branch: **main**  
   - Folder: **/ (root)**
3. Click **Save**
4. Wait 2-3 minutes for deployment

**Your privacy policy URL will be:**
```
https://keiran-trying.github.io/aerial-trick/privacy-policy.html
```

**Test it:** Open the URL in your browser to confirm it works.

---

### Step 2: Open and Test Your iOS App (10 minutes)

```bash
cd /Users/keirancho/Downloads/aerial-trick
export LANG=en_US.UTF-8
npx cap open ios
```

This will open Xcode.

**In Xcode:**
1. Wait for indexing to complete (~2-3 minutes)
2. Select a simulator from the top (e.g., "iPhone 15 Pro")
3. Click the ▶️ (Run) button
4. Test the app:
   - Sign up/login works
   - Videos play smoothly
   - Navigation works
   - All features functional

---

### Step 3: Take Screenshots (15 minutes)

While the app is running in the simulator:

**Required sizes:**
- iPhone 15 Pro Max (6.7" display)
- iPhone 8 Plus (5.5" display)

**How to take screenshots:**
1. In Xcode, select **iPhone 15 Pro Max** simulator
2. Run the app
3. Navigate to each screen
4. Press **Cmd + S** to save screenshot

**Screenshots needed (6-8 total):**
1. **Home screen** - showing daily trick and tabs
2. **Tutorial playing** - video player view
3. **Collections page** - browsing collections
4. **Progress dashboard** - showing achievements
5. **Community feed** - (if you have content)
6. **Profile/Settings page**

Screenshots save to: `~/Desktop/`

**Then repeat for iPhone 8 Plus** (same screens)

---

### Step 4: Archive and Upload to App Store (30 minutes)

**In Xcode:**

1. **Select Device:**
   - Top bar: Change from simulator to **Any iOS Device (arm64)**

2. **Configure Signing:**
   - Click project name in left sidebar
   - Select "App" target
   - Go to "Signing & Capabilities" tab
   - Check ✅ "Automatically manage signing"
   - Select your Apple Developer team from dropdown
   - Wait for provisioning profile to download

3. **Archive the App:**
   - Menu: **Product** → **Archive**
   - Wait 5-10 minutes for build
   - Archives window opens automatically

4. **Upload to App Store Connect:**
   - In Archives window, select your archive
   - Click **Distribute App**
   - Choose **App Store Connect**
   - Click **Next**
   - Select **Upload**
   - Check ✅ "Automatically manage signing"
   - Click **Upload**
   - Wait 10-30 minutes for upload

5. **Wait for Processing:**
   - You'll get an email when processing is complete (~20-60 minutes)
   - Build will appear in App Store Connect

---

### Step 5: Create App Store Listing (45 minutes)

1. **Go to App Store Connect:**
   - Visit: https://appstoreconnect.apple.com
   - Sign in with your Apple Developer account

2. **Create New App (if not created):**
   - Click **My Apps**
   - Click **+** → **New App**
   - Platform: **iOS**
   - Name: **Aerial Tricks**
   - Primary Language: **English (U.S.)**
   - Bundle ID: Select **com.keiranaerial.aerialtricks**
   - SKU: **aerialtricks001**
   - User Access: **Full Access**
   - Click **Create**

3. **Fill App Information:**

**App Information (left sidebar):**
- Name: `Aerial Tricks`
- Subtitle: `Learn Aerial Yoga & Silks`
- Category: **Primary: Health & Fitness**
- Content Rights: ✅ Check "Yes"

**Privacy Policy URL:**
```
https://keiran-trying.github.io/aerial-trick/privacy-policy.html
```

**Support URL:**
```
https://github.com/keiran-trying/aerial-trick
```
(or your own website if you have one)

4. **Version Information (1.0 Prepare for Submission):**

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
• Save your favorite tutorials
• Comment and engage with the community

Whether you're just starting your aerial journey or perfecting advanced drops, Aerial Tricks provides professional instruction to help you safely progress.

Download now and start your aerial yoga adventure! 🧘‍♀️✨
```

**Keywords (100 characters max):**
```
aerial yoga,silk,hammock,fitness,workout,tutorial,tricks,flexibility,strength,gymnastics
```

**Promotional Text (170 characters - optional):**
```
New tutorials added regularly! Master aerial yoga from beginner to advanced with our comprehensive video library. Start your aerial journey today!
```

**What's New in This Version:**
```
🎉 Welcome to Aerial Tricks!

• Learn aerial yoga with video tutorials
• Progressive difficulty levels
• Track your progress
• Personalized recommendations
• Beautiful, intuitive interface

Start your aerial yoga journey today!
```

5. **Upload Screenshots:**
   - Click **Media** (left sidebar under your version)
   - **6.7" Display:** Drag and drop 3-10 screenshots (iPhone 15 Pro Max)
   - **5.5" Display:** Drag and drop 3-10 screenshots (iPhone 8 Plus)

6. **Build:**
   - After your build finishes processing (email notification)
   - Click on **Build** section
   - Click **+** to add a build
   - Select your uploaded build (Version 1.0, Build 2)

7. **App Review Information:**
   - First Name: Your first name
   - Last Name: Your last name
   - Phone: Your phone number
   - Email: Your email
   - **Notes for Review:**
   ```
   Aerial Tricks is an aerial yoga learning platform. Users can:
   1. Sign up/login with email or OAuth
   2. Browse video tutorials by difficulty level
   3. Watch full tutorials
   4. Track their progress
   5. Save favorites
   6. Get personalized recommendations
   
   All content is appropriate and educational. The app requires login to access content.
   
   Test account (if needed):
   Email: demo@aerialtricks.com
   Password: TestDemo123!
   ```

8. **Age Rating:**
   - Click **Edit** next to Age Rating
   - Answer questionnaire:
     - Made for Kids: **NO**
     - Unrestricted Web Access: **NO**
     - All violence/mature content: **NO**
   - Submit
   - Rating should be: **4+**

9. **Pricing and Availability:**
   - Price: **Free**
   - Availability: **All countries** (or select specific ones)

10. **Export Compliance:**
    - Most apps select **NO** (unless you use encryption beyond HTTPS)

11. **Advertising Identifier:**
    - Does your app use the Advertising Identifier (IDFA)? **NO**

---

### Step 6: Submit for Review (2 minutes)

1. Click **Add for Review** (top right)
2. Click **Submit to App Review**
3. Status changes to "Waiting for Review"

**Review Timeline:**
- Waiting for Review: 1-24 hours
- In Review: 12-48 hours
- **Total: Usually 1-3 days**

You'll receive emails for status updates.

---

## 📱 While Waiting for Approval

### If You Get Feedback:
- Apple may ask questions or request changes
- Respond quickly (within 24 hours)
- Common requests:
  - Privacy policy clarification
  - Demo account credentials
  - Explanation of features

### What Happens After Approval:
1. You get "Ready for Sale" email
2. App appears in App Store within 24 hours
3. Share your App Store link!

**Your App Store URL will be:**
```
https://apps.apple.com/app/aerial-tricks/[app-id]
```
(App ID assigned after approval)

---

## 🐛 Troubleshooting

### Archive Failed
- **Issue:** "No signing identity found"
- **Fix:** Select your Apple Developer team in Signing & Capabilities

### Build Not Appearing in App Store Connect
- **Issue:** Build not showing up after upload
- **Wait:** Can take 20-60 minutes to process
- **Check:** Email for processing errors

### CocoaPods Error During Sync
- **Issue:** Unicode error when running `npx cap sync ios`
- **Fix:** Run with: `export LANG=en_US.UTF-8 && npx cap sync ios`

### Screenshots Wrong Size
- **iPhone 15 Pro Max:** 1290 x 2796 pixels (6.7")
- **iPhone 8 Plus:** 1242 x 2208 pixels (5.5")
- Take from correct simulator sizes

---

## 📝 Important Notes

### Privacy Policy
- **MUST** be accessible at a public URL
- Apple will check it during review
- Keep it updated

### Test Account
- Provide if your app requires login
- Make sure it works before submitting

### App Name
- "Aerial Tricks" is available
- Alternative if taken: "Aerial Tricks Yoga", "Aerial Silks Tricks"

---

## ✅ Pre-Submission Checklist

Before clicking "Submit for Review":

- [ ] Privacy policy URL is live and accessible
- [ ] All 6-8 screenshots uploaded for both sizes
- [ ] App description is complete and compelling
- [ ] Keywords are filled in
- [ ] Support URL or email is provided
- [ ] Build is selected (Version 1.0, Build 2)
- [ ] Age rating completed (should be 4+)
- [ ] Pricing set to Free
- [ ] App tested thoroughly in simulator and/or device
- [ ] Test account credentials provided (if applicable)

---

## 🎯 Timeline Summary

- **Today:** Enable GitHub Pages, take screenshots
- **Tomorrow:** Archive and upload, create listing
- **Day 3:** Submit for review
- **Days 4-7:** Wait for Apple review
- **Day 7-10:** App goes live! 🎉

---

## 💡 Tips for Success

1. **Test Thoroughly:** Make sure everything works before submitting
2. **Beautiful Screenshots:** They're your first impression
3. **Clear Description:** Help users understand your app
4. **Respond Quickly:** If Apple asks questions, answer within 24 hours
5. **Be Patient:** Review can take 1-3 days, but worth it!

---

## 📧 Key Information to Save

**Privacy Policy URL:**
```
https://keiran-trying.github.io/aerial-trick/privacy-policy.html
```

**Bundle ID:**
```
com.keiranaerial.aerialtricks
```

**App Name:**
```
Aerial Tricks
```

**SKU:**
```
aerialtricks001
```

---

## 🆘 Need Help?

**Apple Resources:**
- App Store Connect: https://appstoreconnect.apple.com
- Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Support: https://developer.apple.com/contact/

**Common Issues:**
- Check spam folder for Apple emails
- Make sure Apple Developer membership is active ($99/year)
- Verify you're using the correct Apple ID

---

## 🚀 You're Ready!

You have everything you need to launch. Follow the steps above and you'll be live in the App Store within 7-10 days!

**Next Step:** Go enable GitHub Pages for your privacy policy!

Good luck! 🎉

