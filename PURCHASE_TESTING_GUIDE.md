
# 🛒 In-App Purchase Testing Guide for Toxic - The Card Game

## ⚠️ CRITICAL: Why Purchases Don't Work in Expo Go

**RevenueCat SDK requires native code and cannot run in Expo Go.**

When you see this error:
```
[RevenueCat] Failed to initialize: {}
[RevenueCat] Restore failed: {}
```

This means you're running in **Expo Go**, which doesn't support in-app purchases.

---

## ✅ How to Test Purchases (3 Options)

### Option 1: Local Development Build (Recommended for Testing)

This creates a native build on your local machine:

**iOS:**
```bash
npx expo run:ios
```

**Android:**
```bash
npx expo run:android
```

**Requirements:**
- iOS: Mac with Xcode installed
- Android: Android Studio installed
- This creates a development build with RevenueCat SDK properly integrated

---

### Option 2: EAS Development Build (Cloud Build)

If you don't have Xcode/Android Studio:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for iOS (requires Apple Developer account)
eas build --profile development --platform ios

# Build for Android
eas build --profile development --platform android
```

After build completes:
- iOS: Install via TestFlight or direct download
- Android: Download and install the APK

---

### Option 3: Production Build (For App Store/Play Store)

For final testing before release:

```bash
# iOS Production Build
eas build --profile production --platform ios

# Android Production Build
eas build --profile production --platform android
```

---

## 🔧 RevenueCat Configuration Checklist

Before testing, verify your RevenueCat dashboard:

### 1. Products Configuration
- [ ] Product ID: `toxicthecardgame.fullversion`
- [ ] Product type: Non-consumable (one-time purchase)
- [ ] Price: Set in App Store Connect / Google Play Console

### 2. Entitlements Configuration
- [ ] Entitlement ID: `FullVersion`
- [ ] Product `toxicthecardgame.fullversion` is **linked** to entitlement `FullVersion`

### 3. API Keys (Already in app.json)
- [ ] iOS API Key: `appl_LIJcLIuXhozRLfOFccDninfKCot`
- [ ] Android API Key: `goog_WLRFYxyxbjgPvJbihpsMoCrYmJw`

### 4. App Store Connect / Google Play Console
- [ ] Product created with ID: `toxicthecardgame.fullversion`
- [ ] Product status: Ready to Submit / Active
- [ ] Pricing configured
- [ ] Test user accounts created (for sandbox testing)

---

## 🧪 Testing Sandbox Purchases

### iOS Sandbox Testing

1. **Create Sandbox Tester:**
   - Go to App Store Connect → Users and Access → Sandbox Testers
   - Create a new sandbox tester account

2. **Sign Out of Production Apple ID:**
   - Settings → App Store → Sign Out

3. **Run Your Development Build:**
   ```bash
   npx expo run:ios
   ```

4. **Make a Purchase:**
   - Tap "Buy me a drink" in Settings
   - Sign in with your sandbox tester account when prompted
   - Complete the purchase (it's free in sandbox)

5. **Verify:**
   - Check logs for: `[RevenueCat] ✅ Purchase successful - Full version unlocked!`
   - App should show unlimited rounds

### Android Sandbox Testing

1. **Add Test User:**
   - Go to Google Play Console → Setup → License testing
   - Add your Gmail account as a license tester

2. **Create Internal Testing Track:**
   - Google Play Console → Testing → Internal testing
   - Upload your APK/AAB
   - Add yourself as a tester

3. **Install Test Build:**
   - Download from internal testing link
   - Or use: `npx expo run:android`

4. **Make a Purchase:**
   - Tap "Buy me a drink" in Settings
   - Use your test account
   - Complete the purchase (test purchases are free)

5. **Verify:**
   - Check logs for: `[RevenueCat] ✅ Purchase successful - Full version unlocked!`
   - App should show unlimited rounds

---

## 🐛 Troubleshooting

### Issue: "Product Not Available"

**Cause:** RevenueCat can't fetch products from App Store/Play Store

**Solutions:**
1. Verify product ID matches exactly: `toxicthecardgame.fullversion`
2. Check product status in App Store Connect / Play Console (must be "Ready to Submit")
3. Wait 2-4 hours after creating product (Apple/Google sync delay)
4. Verify bundle ID matches:
   - iOS: `com.stevenandrepennant.toxicthecardgame`
   - Android: `com.stevenandrepennant.toxicthecardgame`

### Issue: "Purchase completed but entitlement not found"

**Cause:** Product is not linked to entitlement in RevenueCat

**Solution:**
1. Go to RevenueCat Dashboard → Entitlements
2. Click on `FullVersion` entitlement
3. Ensure `toxicthecardgame.fullversion` is in the "Products" list
4. If not, click "Add Product" and select it

### Issue: "Development Build Required" message

**Cause:** Running in Expo Go

**Solution:**
- Use `npx expo run:ios` or `npx expo run:android`
- Or create an EAS development build

### Issue: Purchase works but doesn't unlock app

**Cause:** Entitlement ID mismatch

**Solution:**
1. Check logs for: `[RevenueCat] Active entitlements after purchase: [...]`
2. If empty, verify entitlement configuration in RevenueCat
3. Ensure entitlement ID in app.json matches dashboard: `FullVersion`

---

## 📊 Monitoring Purchases

### Check Logs

Look for these key log messages:

**Successful Purchase:**
```
[RevenueCat] Purchase completed
[RevenueCat] Has entitlement after purchase: true
[RevenueCat] ✅ Purchase successful - Full version unlocked!
```

**Failed Purchase:**
```
[RevenueCat] Purchase failed: [error details]
```

**Successful Restore:**
```
[RevenueCat] Restore completed
[RevenueCat] Has entitlement after restore: true
[RevenueCat] ✅ Restore successful - Full version unlocked!
```

### RevenueCat Dashboard

Monitor real-time purchases:
1. Go to RevenueCat Dashboard
2. Click on "Customers" to see all transactions
3. Search by user ID or transaction ID
4. View entitlement status

---

## 🚀 Production Deployment Checklist

Before releasing to production:

- [ ] Test sandbox purchases on iOS
- [ ] Test sandbox purchases on Android
- [ ] Test restore purchases on both platforms
- [ ] Verify entitlement unlocks full version
- [ ] Test on multiple devices
- [ ] Verify product pricing is correct
- [ ] Submit app for review with in-app purchase enabled
- [ ] Monitor RevenueCat dashboard for first real purchases

---

## 📞 Support

If purchases still don't work after following this guide:

1. **Check RevenueCat Logs:**
   - RevenueCat Dashboard → Customers → Search for your test user
   - View transaction history and errors

2. **Check App Logs:**
   - Look for `[RevenueCat]` prefixed messages
   - Share relevant logs when asking for help

3. **Common Issues:**
   - Product not created in App Store Connect / Play Console
   - Product not linked to entitlement in RevenueCat
   - Bundle ID mismatch
   - API keys incorrect
   - Testing in Expo Go instead of development build

---

## 🎯 Quick Start for Testing

**Fastest way to test purchases:**

```bash
# 1. Build locally (requires Xcode for iOS or Android Studio for Android)
npx expo run:ios
# or
npx expo run:android

# 2. Open the app on your device/simulator

# 3. Go to Settings → Tap "Buy me a drink"

# 4. Sign in with sandbox tester account

# 5. Complete purchase (free in sandbox)

# 6. Verify full version is unlocked
```

That's it! The app should now show unlimited rounds and all cards.
