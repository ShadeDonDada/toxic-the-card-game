
# 🚀 Superwall Setup Guide - Quick Start

Your app is now integrated with **Superwall** for native App Store and Google Play Store in-app purchases! Follow these steps to get it working.

## ⚡ Quick Setup (5 minutes)

### Step 1: Get Your Superwall API Key

1. Go to https://superwall.com/ and sign up (free account)
2. Create a new app in the dashboard
3. Copy your **API Key** from Settings

### Step 2: Add API Key to Your App

Open `contexts/PurchaseContext.tsx` and replace the placeholder:

```typescript
await Superwall.configure({
  apiKey: 'YOUR_SUPERWALL_API_KEY', // ← Paste your API key here
});
```

### Step 3: Create Your In-App Purchase Product

#### For iOS (App Store Connect):
1. Go to https://appstoreconnect.apple.com/
2. Select your app → Features → In-App Purchases
3. Create a new **Non-Consumable** product:
   - Product ID: `com.toxicgame.premium`
   - Price: $6.99
   - Name: "Buy Me a Drink"

#### For Android (Google Play Console):
1. Go to https://play.google.com/console/
2. Select your app → Monetize → In-app products
3. Create a new product:
   - Product ID: `com.toxicgame.premium`
   - Price: $6.99
   - Name: "Buy Me a Drink"

### Step 4: Add Product to Superwall

1. In Superwall dashboard → Products
2. Click "Add Product"
3. Enter product ID: `com.toxicgame.premium`
4. Superwall will sync pricing automatically

### Step 5: Create Your Paywall

1. In Superwall dashboard → Paywalls → Create Paywall
2. Choose a template (or start from scratch)
3. Customize the design:
   - **Title:** "Unlock Full Access"
   - **Subtitle:** "Get unlimited rounds and all cards"
   - **Features:**
     - ✓ Unlimited scenarios
     - ✓ All response cards unlocked
     - ✓ No restrictions
   - **Button:** "Buy Me a Drink - $6.99"
4. Add your product to the paywall
5. **Publish** the paywall

### Step 6: Set Up Campaign

1. Go to Campaigns → Create Campaign
2. Trigger event: `purchase_full_version`
3. Select your paywall
4. **Activate** the campaign

### Step 7: Test It!

#### iOS Testing:
```bash
# Build and run on iOS
npx expo prebuild -p ios
cd ios && pod install && cd ..
npx expo run:ios
```

1. Create a Sandbox Tester in App Store Connect
2. Sign out of Apple ID on device
3. Tap "Buy me a drink" in app
4. Sign in with Sandbox Tester account
5. Complete test purchase (won't charge real money)

#### Android Testing:
```bash
# Build and run on Android
npx expo prebuild -p android
npx expo run:android
```

1. Add your Google account as License Tester in Play Console
2. Install the app
3. Tap "Buy me a drink"
4. Complete test purchase (won't charge real money)

## ✅ You're Done!

Your app now has:
- ✅ Native App Store/Play Store payments
- ✅ Beautiful paywall UI (customizable from dashboard)
- ✅ Automatic receipt validation
- ✅ Restore purchases functionality
- ✅ Demo mode (3 rounds, 3 cards) for free users
- ✅ Unlimited access after purchase

## 🎨 Customize Your Paywall

You can change your paywall design, pricing, and copy **anytime** from the Superwall dashboard - no app update needed!

1. Go to Superwall dashboard → Paywalls
2. Edit your paywall
3. Changes go live instantly

## 📊 Track Your Revenue

View analytics in Superwall dashboard:
- Purchase conversion rates
- Revenue metrics
- User behavior
- A/B test results

## 💰 Pricing

Superwall is **free** up to $10k monthly revenue, then 2% of revenue above that.

## 🆘 Need Help?

- **Superwall Docs:** https://docs.superwall.com/
- **Support:** support@superwall.com
- **Discord:** https://discord.gg/superwall

## 📝 Important Notes

- The app works in **demo mode** until you add your Superwall API key
- Demo mode limits: 3 scenarios, 3 cards per player, 3 rounds
- After purchase: Unlimited everything
- Purchases sync across devices automatically
- Restore purchases works on reinstall

---

**Ready to launch?** Just add your API key and create your products! 🚀
