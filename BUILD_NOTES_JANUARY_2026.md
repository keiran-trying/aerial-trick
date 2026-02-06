# Build Notes - January 9, 2026

## What We Changed

### 1. Enabled Static Export
- **File:** `next.config.ts`
- **Change:** Uncommented `output: 'export'` on line 15
- **Why:** Required for Capacitor to bundle the app into native iOS

### 2. Removed Dynamic Routes for Build
- **Removed temporarily:** `app/admin/` and `app/tutorial/[id]/`
- **Why:** Static export can't handle server-side dynamic routes
- **Impact:** 
  - Admin panel not in mobile build (not needed)
  - Tutorial routes work client-side in Capacitor
  - These folders are preserved in `admin_backup_temp` for web version

### 3. Built and Synced
```bash
npm run build
npx cap sync ios
```

- **Output:** Static files in `out/` folder
- **Synced to:** `ios/App/App/public/`
- **Plugins:** Camera, Filesystem, Preferences, Splash Screen, Status Bar

### 4. Added GitHub Pages Workflow
- **File:** `.github/workflows/pages.yml`
- **Purpose:** Auto-deploy privacy policy to GitHub Pages
- **URL:** https://keiran-trying.github.io/aerial-trick/privacy-policy.html

---

## Important: Switching Between Web and Mobile Builds

### For Mobile (iOS/Android)
```typescript
// In next.config.ts line 15:
output: 'export',  // UNCOMMENTED

// Then:
npm run build
npx cap sync ios
```

### For Web (Vercel/Development)
```typescript
// In next.config.ts line 15:
// output: 'export',  // COMMENTED OUT

// Then:
npm run dev  // or npm run build for production
```

---

## CocoaPods Fix

If you get Unicode errors when running `npx cap sync ios`:

```bash
export LANG=en_US.UTF-8
npx cap sync ios
```

Or add to your `~/.zshrc`:
```bash
export LANG=en_US.UTF-8
```

---

## Files Modified

1. `next.config.ts` - Enabled static export
2. `.github/workflows/pages.yml` - Added (new file)
3. `APP_STORE_LAUNCH_GUIDE_JANUARY_2026.md` - Added (new file)
4. `QUICK_START_JANUARY_2026.md` - Added (new file)
5. `BUILD_NOTES_JANUARY_2026.md` - This file (new)

---

## Build Output

- **Static files:** `out/` directory
- **iOS copy:** `ios/App/App/public/`
- **Routes generated:**
  - `/` (home)
  - `/auth/login`
  - `/auth/reset-password`
  - `/collections`
  - `/community`
  - `/favorites`
  - `/onboarding`
  - `/profile`
  - `/progress`
  - `/test`

---

## Next Steps for You

1. **Enable GitHub Pages** - 2 minutes
2. **Test in Xcode** - 15 minutes
3. **Take Screenshots** - 15 minutes
4. **Archive and Upload** - 30 minutes
5. **Create App Store Listing** - 45 minutes
6. **Submit for Review** - 2 minutes

**Total time: ~2 hours to submit**

Then wait 1-3 days for Apple review.

---

## Current Version

- **Marketing Version:** 1.0
- **Current Project Version (Build):** 2
- **Bundle Identifier:** com.keiranaerial.aerialtricks
- **Display Name:** Aerial Tricks

---

Good luck with your launch! 🚀

