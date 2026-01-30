
# RevenueCat Quick Start Guide

## ✅ What's Already Done

Your app is **fully configured** to work with RevenueCat! Here's what's already set up:

1. ✅ `react-native-purchases` SDK installed (v9.7.5)
2. ✅ `SubscriptionContext` created and integrated
3. ✅ Settings screen with "Buy me a drink" button ($6.99)
4. ✅ Restore Purchases functionality
5. ✅ Demo mode limits (3 rounds, 3 cards per player)
6. ✅ Full version unlocks (unlimited rounds, all cards)
7. ✅ Test store keys configured for development

## 🔑 What You Need to Do

### Step 1: Get Your RevenueCat API Keys

1. Sign up at https://www.revenuecat.com/
2. Create a new project: "Toxic - The Card Game"
3. Add your iOS app (Bundle ID: `com.stevenandrepennant.toxicthecardgame`)
4. Add your Android app (Package: `com.stevenandrepennant.toxicthecardgame`)
5. Copy your API keys from Project Settings → API Keys:
   - iOS API Key (starts with `appl_`)
   - Android API Key (starts with `goog_`)

### Step 2: Update app.json

Open `app.json` and replace the placeholder keys:

```json
"extra": {
  "revenueCatApiKeyIos": "appl_YOUR_ACTUAL_IOS_KEY",
  "revenueCatApiKeyAndroid": "goog_YOUR_ACTUAL_ANDROID_KEY",
  "revenueCatTestApiKeyIos": "test_quMXNzeUDRgKAgXdvcXRBSwpMlP",
  "revenueCatTestApiKeyAndroid": "test_quMXNzeUDRgKAgXdvcXRBSwpMlP",
  "revenueCatEntitlementId": "pro"
}
```

### Step 3: Create In-App Purchase Products

#### iOS (App Store Connect):
1. Go to App Store Connect → Your App → In-App Purchases
2. Create **Non-Consumable** product:
   - Product ID: `com.stevenandrepennant.toxicthecardgame.fullversion`
   - Price: $6.99
   - Name: "Toxic Full Version"

#### Android (Google Play Console):
1. Go to Google Play Console → Your App → Monetize → In-app products
2. Create product:
   - Product ID: `com.stevenandrepennant.toxicthecardgame.fullversion`
   - Price: $6.99
   - Name: "Toxic Full Version"

### Step 4: Configure RevenueCat Dashboard

1. Go to RevenueCat Dashboard → **Entitlements**
2. Create entitlement:
   - Identifier: `pro` ⚠️ **MUST BE EXACTLY "pro"**
   - Name: "Full Version"

3. Go to **Offerings**
4. Create offering:
   - Identifier: `default`
   - Add package with your product ID
   - Link to "pro" entitlement
   - Set as "Current"

### Step 5: Build & Test

```bash
# For iOS
npx expo prebuild -p ios
npx expo run:ios

# For Android
npx expo prebuild -p android
npx expo run:android
```

## 🧪 Testing

### In Development (Expo Go):
- Uses test store automatically
- No real charges
- Test purchases work immediately

### On Device:
1. Make a test purchase in Settings
2. Verify full version unlocks (unlimited rounds)
3. Test "Restore Purchases" button
4. Check console logs for `[RevenueCat]` messages

## 🔍 Debugging

Check console logs for detailed RevenueCat information:
- Initialization status
- Available offerings/packages
- Purchase attempts
- Entitlement status

Search for: `[RevenueCat]` in logs

## 📱 How It Works

### Demo Version (Default):
- 3 rounds maximum
- 3 cards per player
- Limited scenario cards
- "Demo Version Active" notice in Settings

### Full Version (After Purchase):
- ✅ Unlimited rounds
- ✅ 6 cards per player
- ✅ All scenario cards
- ✅ "Thank You!" message in Settings

## 🎯 Critical Configuration

**MUST MATCH EXACTLY:**
- Entitlement ID in RevenueCat: `pro`
- Entitlement ID in app.json: `pro`
- Product ID: `com.stevenandrepennant.toxicthecardgame.fullversion`

If these don't match, purchases will complete but won't unlock features!

## 📞 Need Help?

See `REVENUECAT_CONFIGURATION_GUIDE.md` for detailed setup instructions and troubleshooting.

---

**Current Status**: ✅ App code is ready. Just need to add your API keys and configure RevenueCat dashboard!
