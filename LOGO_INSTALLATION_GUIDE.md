# 🎨 Logo Installation Guide

## Your Purple "A" Logo - Installation Instructions

Your logo looks beautiful! The elegant purple script "A" on black background will look great as your app icon.

---

## 📋 Quick Method (Recommended)

### Step 1: Prepare Your Logo File

1. Save the logo image you showed me as `logo.png`
2. Make sure it's:
   - **Size:** 1024x1024 pixels (minimum)
   - **Format:** PNG
   - **Background:** Can keep the black background (looks great!)
   - **No transparency needed** (black background is perfect)

### Step 2: Generate All Icon Sizes

Use a free online tool to generate all required sizes:

**🔗 Option A - App Icon Generator (Recommended):**
- Go to: https://www.appicon.co/
- Upload your logo
- Click "Generate"
- Download the .zip file

**🔗 Option B - Make App Icon:**
- Go to: https://makeappicon.com/
- Upload your logo
- Download both iOS and Android packs

### Step 3: Install for iOS

1. **Extract the downloaded files**

2. **Navigate to the iOS icon folder:**
```bash
cd /Users/keirancho/Downloads/aerial-trick/ios/App/App/Assets.xcassets/AppIcon.appiconset/
```

3. **Backup current icons (optional):**
```bash
mkdir backup
cp *.png backup/
```

4. **Replace the icon files:**
   - Copy all the generated PNG files from the iOS pack
   - They should be named like: `App-Icon-20x20@2x.png`, `App-Icon-40x40@1x.png`, etc.
   - **Important:** Keep the exact same filenames!

5. **Update Contents.json (if needed):**
   - The file at `AppIcon.appiconset/Contents.json` defines which icon is used where
   - Usually the generator provides this file - just replace it

### Step 4: Install for Android

1. **Navigate to Android resources:**
```bash
cd /Users/keirancho/Downloads/aerial-trick/android/app/src/main/res/
```

2. **You need to replace icons in these folders:**
   - `mipmap-mdpi/ic_launcher.png` (48×48)
   - `mipmap-hdpi/ic_launcher.png` (72×72)
   - `mipmap-xhdpi/ic_launcher.png` (96×96)
   - `mipmap-xxhdpi/ic_launcher.png` (144×144)
   - `mipmap-xxxhdpi/ic_launcher.png` (192×192)

3. **Also replace the round icons (optional but recommended):**
   - `mipmap-mdpi/ic_launcher_round.png`
   - `mipmap-hdpi/ic_launcher_round.png`
   - etc.

4. **Terminal commands to backup and replace:**
```bash
# Backup current icons
for dir in mipmap-*; do
  mkdir -p backup/$dir
  cp $dir/ic_launcher.png backup/$dir/ 2>/dev/null
  cp $dir/ic_launcher_round.png backup/$dir/ 2>/dev/null
done

# Now copy your new icons to each folder
# (assuming they're in ~/Downloads/AppIcon/)
```

### Step 5: Rebuild and Deploy

1. **Rebuild the app:**
```bash
cd /Users/keirancho/Downloads/aerial-trick
npm run build
```

2. **Sync to both platforms:**
```bash
export LANG=en_US.UTF-8  # Fix for iOS encoding issue
npx cap sync
```

3. **Test on iPhone:**
```bash
npx cap open ios
```
- In Xcode, clean the build: Product → Clean Build Folder
- Run the app
- Check your home screen - you should see your purple "A" logo!

4. **Test on Android:**
```bash
npx cap open android
```
- In Android Studio, clean project: Build → Clean Project
- Run the app
- Check your home screen for the new icon

---

## 🎯 Manual Installation (If Online Tools Don't Work)

If you prefer to resize manually:

### iOS Sizes Needed:

Create these files in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`:

```
App-Icon-20x20@2x.png     (40×40)
App-Icon-20x20@3x.png     (60×60)
App-Icon-29x29@2x.png     (58×58)
App-Icon-29x29@3x.png     (87×87)
App-Icon-40x40@2x.png     (80×80)
App-Icon-40x40@3x.png     (120×120)
App-Icon-60x60@2x.png     (120×120)
App-Icon-60x60@3x.png     (180×180)
App-Icon-76x76@1x.png     (76×76)
App-Icon-76x76@2x.png     (152×152)
App-Icon-83.5x83.5@2x.png (167×167)
App-Icon-1024x1024@1x.png (1024×1024)
```

### Android Sizes Needed:

```
mipmap-mdpi/ic_launcher.png       (48×48)
mipmap-hdpi/ic_launcher.png       (72×72)
mipmap-xhdpi/ic_launcher.png      (96×96)
mipmap-xxhdpi/ic_launcher.png     (144×144)
mipmap-xxxhdpi/ic_launcher.png    (192×192)
```

### Tools for Manual Resizing:

**Mac:**
- Use Preview: Open image → Tools → Adjust Size
- Use Sketch, Figma, or Photoshop

**Online:**
- https://www.iloveimg.com/resize-image
- https://bulkresizephotos.com/

---

## 🎨 Design Tips for Your Logo

Your current logo is great, but here are some tips:

### ✅ Current Logo - Looks Great!
- Purple script "A" on black background
- Clear, distinctive, elegant
- Will stand out on the home screen

### 💡 Optional Improvements:
1. **Padding:** Make sure the "A" has some space from the edges
   - iOS automatically rounds corners
   - Android may use circular icons
   - Leave ~10% padding on all sides

2. **Contrast:** Your purple on black has good contrast ✓

3. **Test on Both Light and Dark Backgrounds:**
   - iOS Dark Mode: will show on dark background ✓
   - iOS Light Mode: will show on light background - should still look good

### 🔍 Before Finalizing:
- Test how it looks small (iOS home screen icons are ~60×60 visible pixels)
- Make sure the "A" is still readable at small size
- Consider if you want the full black background or transparent background

---

## ✅ Verification Checklist

After installing your logo:

- [ ] Icon shows on iPhone home screen
- [ ] Icon shows on Android home screen  
- [ ] Icon looks sharp (not blurry)
- [ ] Icon looks good at small size
- [ ] Icon shows in app switcher
- [ ] Icon shows in Settings
- [ ] Purple color looks correct
- [ ] "A" is clearly visible

---

## 🐛 Troubleshooting

### "Icon not showing / still shows default"

1. **Clean build:**
   - iOS: Xcode → Product → Clean Build Folder
   - Android: Android Studio → Build → Clean Project

2. **Uninstall old app completely:**
   - Delete app from device
   - Reinstall fresh from Xcode/Android Studio

3. **Check file locations:**
```bash
# iOS - should see your icon files:
ls -la /Users/keirancho/Downloads/aerial-trick/ios/App/App/Assets.xcassets/AppIcon.appiconset/

# Android - should see your icon files:
ls -la /Users/keirancho/Downloads/aerial-trick/android/app/src/main/res/mipmap-*/ic_launcher.png
```

4. **Verify file names match exactly** (case-sensitive!)

### "Icon looks blurry or pixelated"

- Make sure you're starting with high-resolution source (1024×1024 minimum)
- Don't upscale a small image
- Use PNG, not JPG
- Make sure the online tool generated proper sizes

### "Icon has wrong colors"

- Check the PNG file itself in Preview/Image Viewer
- Make sure it's RGB color mode, not CMYK
- Save as sRGB color space

---

## 🎉 You're Done!

Once installed, your beautiful purple "A" logo will be your app's identity. It looks professional and unique!

**Questions?** Just ask! 🚀

