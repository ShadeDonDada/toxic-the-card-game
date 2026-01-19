
# In-App Purchase Setup Guide

This guide will help you set up in-app purchases for both iOS (Apple In-App Purchase) and Android (Google Play Billing).

## Overview

The app uses `react-native-iap` library to handle native in-app purchases on both platforms. The implementation is in `contexts/PurchaseContext.tsx`.

## Product ID Configuration

**IMPORTANT:** Before releasing your app, you must update the product IDs in `contexts/PurchaseContext.tsx`:

```typescript
const PRODUCT_IDS = Platform.select({
  ios: ['com.toxicgame.fullversion'], // Replace with your iOS product ID
  android: ['com.toxicgame.fullversion'], // Replace with your Android product ID
  default: ['com.toxicgame.fullversion'],
}) as string[];
```

---

## iOS Setup (Apple In-App Purchase)

### 1. App Store Connect Configuration

1. **Sign in to App Store Connect**
   - Go to https://appstoreconnect.apple.com
   - Sign in with your Apple Developer account

2. **Create In-App Purchase**
   - Select your app
   - Go to "Features" → "In-App Purchases"
   - Click the "+" button to create a new in-app purchase
   - Select "Non-Consumable" (since this is a one-time purchase to unlock full version)

3. **Configure Product Details**
   - **Product ID**: `com.toxicgame.fullversion` (or your custom ID)
   - **Reference Name**: "Toxic Full Version" (internal name)
   - **Price**: Select your price tier (e.g., $6.99)
   - **Localization**: Add at least one localization
     - **Display Name**: "Buy me a drink"
     - **Description**: "Unlock unlimited rounds and all cards in Toxic - The Card Game"

4. **Add Screenshot** (required for review)
   - Upload a screenshot showing what the purchase unlocks
   - This is required for App Store review

5. **Submit for Review**
   - In-app purchases must be reviewed along with your app
   - Make sure to test thoroughly before submission

### 2. Testing on iOS

**Sandbox Testing:**

1. **Create Sandbox Tester Account**
   - In App Store Connect, go to "Users and Access" → "Sandbox Testers"
   - Click "+" to add a new sandbox tester
   - Use a unique email (doesn't need to be real)
   - Remember the password

2. **Configure Device for Testing**
   - On your iOS device, go to Settings → App Store
   - Scroll down to "Sandbox Account"
   - Sign in with your sandbox tester account
   - **Important**: Do NOT sign in with your sandbox account in the regular App Store

3. **Test Purchase Flow**
   - Build and run your app on the device
   - Tap "Buy me a drink" in settings
   - You'll see "[Sandbox]" in the purchase dialog
   - Complete the purchase (you won't be charged)
   - Test "Restore Purchases" by reinstalling the app

**Important Notes:**
- Sandbox purchases are free
- You can make unlimited test purchases
- Sandbox receipts expire after a short time (for testing subscription renewals)
- Always test on a real device, not simulator

### 3. Bundle Identifier

Make sure your bundle identifier in `app.json` matches your App Store Connect app:

```json
"ios": {
  "bundleIdentifier": "com.anonymous.Natively"
}
```

---

## Android Setup (Google Play Billing)

### 1. Google Play Console Configuration

1. **Sign in to Google Play Console**
   - Go to https://play.google.com/console
   - Sign in with your Google Play Developer account

2. **Create In-App Product**
   - Select your app
   - Go to "Monetize" → "In-app products"
   - Click "Create product"
   - Select "One-time" product type

3. **Configure Product Details**
   - **Product ID**: `com.toxicgame.fullversion` (must match your code)
   - **Name**: "Buy me a drink"
   - **Description**: "Unlock unlimited rounds and all cards in Toxic - The Card Game"
   - **Price**: Set your price (e.g., $6.99)
   - **Status**: Set to "Active"

4. **Save and Activate**
   - Click "Save" to create the product
   - Make sure the status is "Active"

### 2. Testing on Android

**License Testing:**

1. **Add License Testers**
   - In Google Play Console, go to "Setup" → "License testing"
   - Add email addresses of testers (must be Gmail accounts)
   - Set license response to "RESPOND_NORMALLY"

2. **Create Internal Testing Track**
   - Go to "Release" → "Testing" → "Internal testing"
   - Create a new release
   - Upload your APK/AAB
   - Add testers to the internal testing track

3. **Test Purchase Flow**
   - Testers must opt-in via the testing link
   - Install the app from the Play Store (internal testing)
   - Tap "Buy me a drink" in settings
   - You'll see "Test purchase" in the dialog
   - Complete the purchase (you won't be charged)
   - Test "Restore Purchases" by clearing app data

**Important Notes:**
- Test purchases are free for license testers
- You must use the Play Store version (not sideloaded APK)
- Test purchases are automatically refunded after 5 minutes
- Always test on a real device

### 3. Package Name

Make sure your package name in `app.json` matches your Google Play Console app:

```json
"android": {
  "package": "com.StevenAndrePennant.ToxicTheCardGame"
}
```

### 4. Permissions

The Android billing permission is already added in `app.json`:

```json
"android": {
  "permissions": [
    "com.android.vending.BILLING"
  ]
}
```

---

## Building for Production

### iOS

```bash
# Build for iOS
eas build --platform ios --profile production

# Or for local build
expo prebuild --platform ios
cd ios
xcodebuild -workspace YourApp.xcworkspace -scheme YourApp -configuration Release
```

### Android

```bash
# Build for Android
eas build --platform android --profile production

# Or for local build
expo prebuild --platform android
cd android
./gradlew assembleRelease
```

---

## Testing Checklist

Before releasing your app, test the following scenarios:

### Purchase Flow
- [ ] Purchase completes successfully
- [ ] Full version is unlocked after purchase
- [ ] Demo limit is removed after purchase
- [ ] Purchase status persists after app restart
- [ ] Purchase status persists after app reinstall (via restore)

### Restore Flow
- [ ] Restore finds existing purchase
- [ ] Restore unlocks full version
- [ ] Restore shows "no purchases found" if no purchase exists
- [ ] Restore works after reinstalling app

### Error Handling
- [ ] User cancellation is handled gracefully (no error alert)
- [ ] Network errors show appropriate message
- [ ] Products load correctly on app start
- [ ] App works in demo mode if IAP fails to initialize

### Edge Cases
- [ ] Multiple rapid purchase attempts are handled
- [ ] App works offline (uses cached purchase status)
- [ ] Purchase works on slow network
- [ ] Restore works on slow network

---

## Troubleshooting

### iOS Issues

**"Cannot connect to iTunes Store"**
- Make sure you're signed in with a sandbox account
- Check your internet connection
- Try signing out and back in to sandbox account

**"This In-App Purchase has already been bought"**
- This is normal for non-consumable purchases
- Use "Restore Purchases" instead
- Or create a new sandbox tester account

**Products not loading**
- Verify product ID matches App Store Connect
- Make sure in-app purchase is approved
- Check bundle identifier matches
- Wait a few hours after creating the product

### Android Issues

**"Item not available for purchase"**
- Make sure product is "Active" in Play Console
- Verify product ID matches exactly
- Check package name matches
- Make sure you're using the Play Store version (not sideloaded)

**"You already own this item"**
- This is normal for one-time purchases
- Use "Restore Purchases" instead
- Or clear Play Store cache and data

**Products not loading**
- Verify product ID matches Play Console
- Make sure product is "Active"
- Check package name matches
- Make sure app is published to at least internal testing track

---

## Support

For more information, refer to:
- [react-native-iap documentation](https://github.com/dooboolab-community/react-native-iap)
- [Apple In-App Purchase documentation](https://developer.apple.com/in-app-purchase/)
- [Google Play Billing documentation](https://developer.android.com/google/play/billing)

---

## Important Notes

1. **Product IDs**: Must be unique and match exactly between your code and store consoles
2. **Testing**: Always test on real devices, not emulators/simulators
3. **Sandbox/Test Purchases**: Are free and don't charge real money
4. **Production**: Real purchases will charge real money
5. **Refunds**: Handle through App Store Connect (iOS) or Play Console (Android)
6. **Receipt Validation**: For production apps, consider implementing server-side receipt validation for additional security
