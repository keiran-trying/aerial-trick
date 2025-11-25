# 📸 How to Take Perfect Screenshots for App Stores

## 🎯 What You Need

**iOS (App Store):**
- 6.5" Display: 1290 x 2796 px (iPhone 14/15 Pro Max)
- 5.5" Display: 1242 x 2208 px (iPhone 8 Plus)
- Minimum 3, recommended 6-8 screenshots

**Android (Google Play):**
- Minimum resolution: 1080 x 1920 px
- Minimum 2, recommended 8 screenshots

---

## 📱 Method 1: iOS Simulator (Easiest!)

### Step 1: Open in Simulator

```bash
cd /Users/keirancho/Downloads/aerial-trick

# Make sure static export is COMMENTED OUT for testing
# In next.config.ts: // output: 'export',

npm run dev  # Start localhost

# In another terminal:
npx cap open ios
```

### Step 2: Select Right Device

In Xcode:
1. Click device selector (top left)
2. Choose **iPhone 15 Pro Max** (6.5" display)
3. Click **Run** button (▶️)

### Step 3: Take Screenshots

**While app is running in simulator:**

1. **Navigate to key screens:**
   - Homepage with daily trick
   - Tutorial list (Easy/Med/Pro tabs)
   - Tutorial playing (tap on a tutorial)
   - Progress dashboard (tap Progress tab)
   - Profile settings (tap Profile icon)
   - AI Recommendations

2. **Take screenshot: Cmd + S**
   - Screenshots save to Desktop automatically!

3. **For iPhone 8 Plus size:**
   - Change simulator to **iPhone 8 Plus**
   - Take same screenshots again

---

## 🤖 Method 2: Android Emulator

### Step 1: Open in Android Emulator

```bash
npx cap open android
```

### Step 2: Create/Start Emulator

In Android Studio:
1. Click **Device Manager** (phone icon)
2. Create new device: **Pixel 6** or **Pixel 7**
3. Select system image: **Android 13** or newer
4. Click **Run** (▶️ green play button)

### Step 3: Take Screenshots

**While app is running:**

1. Navigate to key screens (same as iOS)
2. Take screenshot:
   - **Mac:** Cmd + S in emulator
   - **Or:** Use screenshot tool in emulator sidebar
3. Screenshots save to: `~/Desktop/`

---

## 🎨 What Screens to Screenshot

### Must-Have (Priority):

1. **Homepage**
   - Shows "Aerial Tricks" header
   - Daily trick visible
   - Beautiful gradient background
   - All tabs visible

2. **Tutorial Playing**
   - Video player showing aerial move
   - Clear, high-quality image
   - Play button visible
   - Tutorial title and description

3. **Tutorial Grid**
   - Multiple tutorials visible
   - Shows difficulty levels (Easy, Med, Pro)
   - Beautiful thumbnails
   - Organized layout

4. **Progress Dashboard**
   - Shows stats (completed tutorials, streak)
   - Progress tracking visible
   - Achievement badges
   - Looks motivating!

5. **Profile/Onboarding**
   - Personalization features
   - Skill level selection
   - Beautiful UI

### Nice-to-Have:

6. **AI Recommendations**
   - Personalized suggestions
   - Smart features highlighted

7. **Collections**
   - Organized content
   - Easy browsing

8. **Community/Comments**
   - Social features
   - Engagement

---

## ✨ Screenshot Tips

### Make Them Beautiful:

1. **Use Light Mode** - Looks more professional in screenshots
2. **Fill the Screen** - Show main features prominently
3. **Show Action** - Tutorial videos playing, not just static screens
4. **Use Real Content** - Make sure you have tutorials uploaded
5. **Clean UI** - Close keyboard, loading states, etc.

### What Makes Good Screenshots:

✅ **Clear & Focused** - One main feature per screenshot
✅ **Colorful** - Your app has beautiful gradients, show them!
✅ **Action-Oriented** - Show people using the app
✅ **Professional** - No errors, loading states, or test data
✅ **Consistent** - Same user flow throughout

❌ **Avoid:**
- Blank screens
- Loading spinners
- Error messages
- Lorem ipsum text
- Empty states

---

## 🎯 Screenshot Order (What Users See First)

**Order matters!** First screenshot is most important.

### Recommended Order:

1. **Homepage** - First impression!
2. **Tutorial Playing** - Main feature (watching videos)
3. **Tutorial Grid** - Content library
4. **Progress** - Tracking & motivation
5. **Profile** - Personalization
6. **Recommendations** - Smart features
7. **Collections** - Organization
8. **Community** - Social proof

---

## 📏 Verify Screenshot Sizes

### iOS:

**Check on Mac:**
```bash
cd ~/Desktop
file Screenshot*.png  # Shows dimensions
```

**Required:**
- iPhone 15 Pro Max: 1290 x 2796
- iPhone 8 Plus: 1242 x 2208

**If wrong size:**
- Simulator might be zoomed
- Window → Physical Size (in simulator menu)

### Android:

**Required:**
- Minimum: 1080 x 1920
- Pixel 6/7 usually gives correct size

---

## 🖼️ Organize Your Screenshots

Create folder on Desktop:

```bash
cd ~/Desktop
mkdir AerialTricks-Screenshots
mkdir AerialTricks-Screenshots/iOS-6.5
mkdir AerialTricks-Screenshots/iOS-5.5
mkdir AerialTricks-Screenshots/Android

# Move screenshots:
mv Screenshot*-iPhone-15* AerialTricks-Screenshots/iOS-6.5/
mv Screenshot*-iPhone-8* AerialTricks-Screenshots/iOS-5.5/
mv Screenshot*-Pixel* AerialTricks-Screenshots/Android/
```

---

## ⏱️ Time Estimate

**Total time: 30-45 minutes**
- iOS screenshots: 15-20 minutes
- Android screenshots: 15-20 minutes
- Organization: 5 minutes

---

## 🎨 Pro Tips

### Make Screenshots Pop:

1. **Add Text Overlays (Optional):**
   - Use Preview or Photoshop
   - Add captions like "Learn Aerial Yoga" or "Track Your Progress"
   - Apple/Google allow text overlays

2. **Consistency:**
   - Take all screenshots with same account
   - Use same content throughout
   - Keep same UI state (logged in/out)

3. **Show Progression:**
   - Start with overview
   - Then show specific features
   - End with results/achievements

4. **Test Before Uploading:**
   - View screenshots on your phone
   - Make sure they look good at actual size
   - Check readability

---

## 🚀 Quick Start (5 Minute Version)

**Just need to get it done?** Minimum requirements:

### iOS: 3 Screenshots Minimum

1. Homepage
2. Tutorial playing
3. Progress dashboard

### Android: 2 Screenshots Minimum

1. Homepage
2. Tutorial playing

**This is enough to submit!** You can always update with better screenshots later.

---

## ✅ Checklist

Before uploading:

- [ ] iOS 6.5" screenshots taken (3-8 images)
- [ ] iOS 5.5" screenshots taken (3-8 images)
- [ ] Android screenshots taken (2-8 images)
- [ ] All screenshots show actual app content
- [ ] No errors or test data visible
- [ ] Screenshots are clear and professional
- [ ] File names are organized
- [ ] Ready to upload!

---

## 📤 Next Steps

After taking screenshots:

1. **Rename files** clearly:
   ```
   01-homepage.png
   02-tutorial-playing.png
   03-progress.png
   etc.
   ```

2. **Review all screenshots**
   - Open each one
   - Verify quality
   - Check for issues

3. **Upload to App Store Connect / Google Play**
   - Follow main submission guide
   - Drag and drop screenshots
   - Done!

---

**Your screenshots are the first thing users see. Make them count!** ✨

**Need help?** Just ask! 🚀

