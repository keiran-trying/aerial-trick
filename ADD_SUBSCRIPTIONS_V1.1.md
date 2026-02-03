# 💰 Add Subscriptions to Your App (v1.1 Update)

**Use this guide AFTER your app is live to add subscriptions**

Your pricing model:
- Monthly: $19.99/month (7-day free trial)
- Seasonal: $49.99/3 months (7-day free trial)
- Yearly: $149.99/year (7-day free trial)

---

## 📋 Overview

Adding subscriptions requires:
1. ✅ Set up subscriptions in App Store Connect (~15 min)
2. ✅ Install subscription library in your app (~5 min)
3. ✅ Add subscription UI components (~2 hours)
4. ✅ Test subscriptions (~30 min)
5. ✅ Submit v1.1 update (~30 min)

**Total Time:** ~4 hours

---

## 🍎 PART 1: App Store Connect Setup

### Step 1: Create Subscription Group

1. Go to: https://appstoreconnect.apple.com
2. Click **My Apps** → Select **Aerial Tricks**
3. Left sidebar: **In-App Purchases and Subscriptions**
4. Click **Manage** under "Subscriptions"
5. Click **+** (Create Subscription Group)
   - Reference Name: `Premium Access`
   - Click **Create**

### Step 2: Add Monthly Subscription

1. In the Premium Access group, click **+** (Add Subscription)
2. Fill in:
   - **Reference Name:** `Monthly Premium`
   - **Product ID:** `com.keiranaerial.aerialtricks.monthly`
   - Click **Create**
3. Configure:
   - **Subscription Duration:** 1 Month
   - **Subscription Prices:**
     - Click **+** → Select all countries
     - Enter: `19.99` USD
     - Click **Add Pricing**
   - **Introductory Offers:**
     - Click **+**
     - Type: **Free Trial**
     - Duration: **7 days**
     - Countries: All
   - **Subscription Name (English US):**
     - Subscription Display Name: `Monthly Premium`
     - Description: `Full access to all aerial yoga tutorials and features`
4. Click **Save**

### Step 3: Add Seasonal Subscription

1. Click **+** (Add Subscription)
2. Fill in:
   - **Reference Name:** `Seasonal Premium`
   - **Product ID:** `com.keiranaerial.aerialtricks.seasonal`
   - Click **Create**
3. Configure:
   - **Subscription Duration:** 3 Months
   - **Subscription Prices:** `49.99` USD (all countries)
   - **Introductory Offers:** 7-day free trial
   - **Subscription Name:** `Seasonal Premium (3 Months)`
   - **Description:** `Full access for 3 months - Save 17% vs monthly!`
4. Click **Save**

### Step 4: Add Yearly Subscription

1. Click **+** (Add Subscription)
2. Fill in:
   - **Reference Name:** `Yearly Premium`
   - **Product ID:** `com.keiranaerial.aerialtricks.yearly`
   - Click **Create**
3. Configure:
   - **Subscription Duration:** 1 Year
   - **Subscription Prices:** `149.99` USD (all countries)
   - **Introductory Offers:** 7-day free trial
   - **Subscription Name:** `Yearly Premium - Best Value!`
   - **Description:** `Full access for one year - Save 38% vs monthly!`
4. Click **Save**

### Step 5: Review Info Tab

Fill in required info:
- **App Name:** Aerial Tricks
- **Review Screenshot:** Upload screenshot showing subscription screen
- **Review Notes:** "Premium subscriptions unlock all tutorials and features"

---

## 💻 PART 2: Install RevenueCat (Recommended)

RevenueCat makes subscriptions MUCH easier. It's free for up to $10k monthly revenue.

### Step 1: Create RevenueCat Account

1. Go to: https://www.revenuecat.com
2. Sign up (free)
3. Create new project: **Aerial Tricks**

### Step 2: Add iOS App

1. In RevenueCat dashboard, click **Add App**
2. Fill in:
   - **App Name:** Aerial Tricks iOS
   - **Bundle ID:** `com.keiranaerial.aerialtricks`
   - **Platform:** iOS
3. Click **Save**

### Step 3: Configure Apple App Store

1. In RevenueCat, go to **Project Settings** → **Integrations**
2. Click **Apple App Store**
3. Upload your:
   - **In-App Purchase Key** (from App Store Connect)
   - Steps to get key:
     - App Store Connect → Users and Access → Keys → In-App Purchase
     - Click **+** to generate key
     - Download `.p8` file
     - Upload to RevenueCat
4. Enter **Issuer ID** and **Key ID** (from App Store Connect)

### Step 4: Create Entitlements

1. In RevenueCat, go to **Entitlements**
2. Click **+ New**
   - Identifier: `premium`
   - Name: `Premium Access`
3. Click **Save**

### Step 5: Create Products

1. Go to **Products** tab
2. Click **+ New**:
   - **Product ID:** `com.keiranaerial.aerialtricks.monthly`
   - **Name:** Monthly Premium
   - **Type:** Subscription
3. Repeat for `seasonal` and `yearly`

### Step 6: Create Offerings

1. Go to **Offerings** tab
2. Edit **Default Offering**
3. Add packages:
   - Package 1: `monthly` → Monthly Premium
   - Package 2: `seasonal` → Seasonal Premium (badge: "Save 17%")
   - Package 3: `yearly` → Yearly Premium (badge: "Best Value!")
4. Click **Save**

---

## 📱 PART 3: Add Code to Your App

### Step 1: Install RevenueCat SDK

```bash
cd /Users/keirancho/Downloads/aerial-trick
npm install react-native-purchases
npx cap sync ios
```

### Step 2: Configure RevenueCat

Create `lib/subscriptions/config.ts`:

```typescript
import Purchases from 'react-native-purchases';

export const REVENUE_CAT_API_KEY = 'YOUR_REVENUECAT_API_KEY'; // Get from RevenueCat dashboard

export async function initializeSubscriptions() {
  if (typeof window === 'undefined') return; // Skip on server
  
  try {
    await Purchases.configure({
      apiKey: REVENUE_CAT_API_KEY,
    });
    console.log('RevenueCat initialized');
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
  }
}

export async function checkSubscriptionStatus(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active['premium'] !== undefined;
  } catch (error) {
    console.error('Failed to check subscription:', error);
    return false;
  }
}

export async function getOfferings() {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (error) {
    console.error('Failed to get offerings:', error);
    return null;
  }
}

export async function purchasePackage(packageToPurchase: any) {
  try {
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    return customerInfo.entitlements.active['premium'] !== undefined;
  } catch (error: any) {
    if (error.userCancelled) {
      console.log('User cancelled purchase');
    } else {
      console.error('Purchase failed:', error);
    }
    return false;
  }
}

export async function restorePurchases() {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo.entitlements.active['premium'] !== undefined;
  } catch (error) {
    console.error('Failed to restore purchases:', error);
    return false;
  }
}
```

### Step 3: Initialize on App Start

Update `app/layout.tsx`:

```typescript
import { useEffect } from 'react';
import { initializeSubscriptions } from '@/lib/subscriptions/config';

export default function RootLayout() {
  useEffect(() => {
    initializeSubscriptions();
  }, []);
  
  // ... rest of layout
}
```

### Step 4: Create Subscription Paywall Component

Create `components/subscription-paywall.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getOfferings, purchasePackage, restorePurchases } from '@/lib/subscriptions/config';
import { X, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubscriptionPaywallProps {
  onClose: () => void;
  onSubscribe: () => void;
}

export default function SubscriptionPaywall({ onClose, onSubscribe }: SubscriptionPaywallProps) {
  const [offerings, setOfferings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('yearly');

  useEffect(() => {
    loadOfferings();
  }, []);

  async function loadOfferings() {
    const offers = await getOfferings();
    setOfferings(offers);
    setLoading(false);
  }

  async function handlePurchase(pkg: any) {
    setPurchasing(true);
    const success = await purchasePackage(pkg);
    setPurchasing(false);
    
    if (success) {
      onSubscribe();
    }
  }

  async function handleRestore() {
    setPurchasing(true);
    const success = await restorePurchases();
    setPurchasing(false);
    
    if (success) {
      onSubscribe();
    } else {
      alert('No previous purchases found');
    }
  }

  const packages = offerings?.availablePackages || [];
  const monthlyPkg = packages.find((p: any) => p.identifier === '$rc_monthly');
  const seasonalPkg = packages.find((p: any) => p.identifier === '$rc_three_month');
  const yearlyPkg = packages.find((p: any) => p.identifier === '$rc_annual');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-purple-600 to-indigo-700 text-white p-8 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          
          <Sparkles className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Unlock Premium</h2>
          <p className="text-purple-100">Start your 7-day free trial</p>
        </div>

        {/* Benefits */}
        <div className="p-6 border-b">
          <div className="space-y-3">
            {[
              'Access all 100+ aerial yoga tutorials',
              'AI-powered personalized recommendations',
              'Track progress & unlock achievements',
              'Download tutorials for offline viewing',
              'Priority support',
              'New tutorials added weekly'
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="p-6 space-y-3">
          {/* Yearly - Best Value */}
          {yearlyPkg && (
            <button
              onClick={() => setSelectedPackage('yearly')}
              className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                selectedPackage === 'yearly'
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="text-lg font-bold">Yearly</span>
                  <span className="ml-2 text-xs bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2 py-1 rounded-full">
                    BEST VALUE
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${yearlyPkg.product.priceString}</div>
                  <div className="text-xs text-gray-500">$12.50/month</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">Save 38% • 7-day free trial</p>
            </button>
          )}

          {/* Seasonal */}
          {seasonalPkg && (
            <button
              onClick={() => setSelectedPackage('seasonal')}
              className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                selectedPackage === 'seasonal'
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="text-lg font-bold">3 Months</span>
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Save 17%
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${seasonalPkg.product.priceString}</div>
                  <div className="text-xs text-gray-500">$16.66/month</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">7-day free trial</p>
            </button>
          )}

          {/* Monthly */}
          {monthlyPkg && (
            <button
              onClick={() => setSelectedPackage('monthly')}
              className={`w-full text-left border-2 rounded-xl p-4 transition-all ${
                selectedPackage === 'monthly'
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold">Monthly</span>
                <div className="text-right">
                  <div className="text-2xl font-bold">${monthlyPkg.product.priceString}</div>
                  <div className="text-xs text-gray-500">per month</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">7-day free trial</p>
            </button>
          )}
        </div>

        {/* CTA */}
        <div className="p-6 pt-0">
          <Button
            onClick={() => {
              const pkg = selectedPackage === 'yearly' ? yearlyPkg : 
                          selectedPackage === 'seasonal' ? seasonalPkg : monthlyPkg;
              handlePurchase(pkg);
            }}
            disabled={purchasing || loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold"
          >
            {purchasing ? 'Processing...' : 'Start 7-Day Free Trial'}
          </Button>

          <p className="text-xs text-center text-gray-500 mt-4">
            Free for 7 days, then ${selectedPackage === 'yearly' ? '149.99/year' : selectedPackage === 'seasonal' ? '49.99/quarter' : '19.99/month'}. Cancel anytime.
          </p>

          <button
            onClick={handleRestore}
            className="w-full text-center text-sm text-purple-600 hover:text-purple-700 mt-4"
          >
            Restore Purchases
          </button>
        </div>

        {/* Terms */}
        <div className="px-6 pb-6 text-xs text-gray-500 text-center space-y-1">
          <p>Subscriptions automatically renew unless cancelled at least 24 hours before the end of the current period.</p>
          <div className="flex gap-3 justify-center mt-2">
            <a href="https://keiran-trying.github.io/aerial-trick/privacy-policy.html" className="underline">
              Privacy Policy
            </a>
            <a href="#" className="underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 5: Add Subscription Check to Protected Content

Update `app/tutorial/[id]/page.tsx` to check subscription:

```typescript
import { checkSubscriptionStatus } from '@/lib/subscriptions/config';
import SubscriptionPaywall from '@/components/subscription-paywall';

export default function TutorialPage({ params }: { params: Promise<{ id: string }> }) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      const subscribed = await checkSubscriptionStatus();
      setIsSubscribed(subscribed);
      
      // Show paywall if not subscribed (after trial period)
      if (!subscribed) {
        // Add logic to show paywall after viewing X tutorials or after Y days
      }
    }
    
    checkAccess();
  }, []);

  if (showPaywall) {
    return (
      <SubscriptionPaywall
        onClose={() => setShowPaywall(false)}
        onSubscribe={() => {
          setIsSubscribed(true);
          setShowPaywall(false);
        }}
      />
    );
  }

  // ... rest of component
}
```

---

## 🧪 PART 4: Test Subscriptions

### Test in Sandbox Environment

1. **Create Sandbox Tester:**
   - App Store Connect → Users and Access → Sandbox Testers
   - Click **+** to add tester
   - Use fake email (e.g., `test@aerialtricks.com`)

2. **Test on Device:**
   - Sign out of real Apple ID on test device
   - Run app
   - Try to purchase subscription
   - Sign in with sandbox tester when prompted
   - Verify purchase works
   - **Cancel immediately** (sandbox subscriptions renew every 5 minutes!)

3. **Test Restore:**
   - Delete app
   - Reinstall
   - Tap "Restore Purchases"
   - Verify subscription restored

---

## 📤 PART 5: Submit v1.1 Update

### Step 1: Update Version

In Xcode:
- Version: `1.1.0`
- Build: increment (e.g., `3`)

### Step 2: Archive and Upload

Same process as v1.0:
```bash
npx cap sync ios
npx cap open ios
```

1. Select **Any iOS Device**
2. **Product → Archive**
3. **Distribute App → Upload**

### Step 3: Update App Store Listing

In App Store Connect:
1. Click **+** (new version)
2. Version: `1.1.0`
3. What's New:
```
New in v1.1:

💰 PREMIUM SUBSCRIPTIONS NOW AVAILABLE!
• Start with a 7-day FREE trial
• Choose monthly, seasonal, or yearly plans
• Access all tutorials and features
• Cancel anytime

Plus:
• Performance improvements
• Bug fixes
• Better AI recommendations
```

4. Select new build
5. **Submit for Review**

---

## ✅ Checklist

Before launching subscriptions:

- [ ] Created all 3 subscription products in App Store Connect
- [ ] Set up RevenueCat account and configured Apple integration
- [ ] Installed react-native-purchases SDK
- [ ] Added subscription paywall UI
- [ ] Implemented subscription checks in app
- [ ] Tested purchases with sandbox account
- [ ] Tested restore purchases
- [ ] Updated app description to mention subscriptions
- [ ] Submitted v1.1 for review

---

## 💡 Pro Tips

1. **Free Trial Strategy:**
   - Let users access 3-5 tutorials for free
   - Show paywall after that
   - Remind users they can start 7-day trial

2. **Timing:**
   - Show paywall when users are most engaged
   - After they complete their first tutorial
   - When they try to save a favorite

3. **Conversions:**
   - Highlight "7-day FREE trial" prominently
   - Show yearly as "Best Value" (most people pick it!)
   - Make it easy to restore purchases

4. **Support:**
   - Respond quickly to subscription questions
   - Make cancellation easy (builds trust)
   - Consider offering discounts for annual renewals

---

## 🆘 Troubleshooting

**"Product IDs not found"**
→ Wait 2-4 hours after creating products in App Store Connect

**"Sandbox tester invalid"**
→ Make sure you're signed out of real Apple ID first

**"Purchase failed"**
→ Check RevenueCat API key is correct

**"Restore doesn't work"**
→ Make sure same Apple ID was used for original purchase

---

## 🎯 Timeline

**Day 1 (4 hours):**
- Set up App Store Connect products
- Install and configure RevenueCat
- Add subscription UI

**Day 2 (2 hours):**
- Test thoroughly
- Fix any bugs
- Prepare for submission

**Day 3:**
- Submit v1.1 to App Store
- Wait for review (1-2 days)

**Day 5-6:**
- v1.1 approved and live!
- START MAKING MONEY! 💰

---

## 📊 Pricing Rationale

Your pricing is competitive:
- **Monthly ($19.99):** Similar to other fitness apps
- **Seasonal ($49.99):** 17% discount encourages commitment
- **Yearly ($149.99):** 38% discount drives most conversions

**Expected Conversion:** 2-5% of free users convert to paid
**Average Revenue Per User:** $80-120/year

---

**Good luck with v1.1! You're about to start making money! 💰🚀**
