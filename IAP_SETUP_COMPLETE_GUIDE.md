
# Complete IAP Setup Guide for App Store Submission

## Critical Fixes Applied

### 1. App Configuration (app.json)
✅ **Fixed Bundle Identifiers:**
- iOS: `com.stevenandrepennant.toxicthecardgame` (removed spaces and special characters)
- Android: `com.stevenandrepennant.toxicthecardgame` (consistent with iOS)

✅ **Added Required Configurations:**
- Google Play Billing permission: `com.android.vending.BILLING`
- react-native-iap plugin configuration
- Proper scheme without spaces: `toxicthecardgame`
- Android versionCode for proper versioning

### 2. Product ID Configuration
✅ **Updated Product IDs to match bundle identifier:**
- iOS: `com.stevenandrepennant.toxicthecardgame.fullversion`
- Android: `com.stevenandrepennant.toxicthecardgame.fullversion`

### 3. Google Play Billing Testing Improvements
✅ **Added Android-specific fixes:**
- `flushFailedPurchasesCachedAsPendingAndroid()` - Clears old test purchases
- Proper obfuscated account ID handling for Android
- Mock product support in development mode
- Better error handling for testing phase

### 4. IAP Implementation Improvements
✅ **Enhanced reliability:**
- Proper connection initialization and cleanup
- Subscription cleanup in useEffect return
- Better error handling for interrupted purchases
- Development mode mock products for testing

---

## Step-by-Step Setup Instructions

### Part A: Apple App Store Connect Setup

#### 1. Create App in App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - **Platform:** iOS
   - **Name:** Toxic The Card Game
   - **Primary Language:** English
   - **Bundle ID:** Select `com.stevenandrepennant.toxicthecardgame`
   - **SKU:** toxicthecardgame (or any unique identifier)

#### 2. Create In-App Purchase Product
1. In your app, go to "Features" → "In-App Purchases"
2. Click "+" to create new in-app purchase
3. Select **"Non-Consumable"** (one-time purchase)
4. Fill in:
   - **Reference Name:** Full Version Unlock
   - **Product ID:** `com.stevenandrepennant.toxicthecardgame.fullversion`
   - **Price:** Select your price tier (e.g., $6.99 = Tier 7)
   - **Localization:**
     - Display Name: "Full Version"
     - Description: "Unlock unlimited rounds and all cards"

#### 3. Add Screenshot for Review
- Upload a simple screenshot showing the purchase screen
- This is required for App Store review

#### 4. Submit for Review
- The IAP must be submitted along with your app binary
- Status will show "Waiting for Review" until you submit the app

#### 5. Testing with Sandbox Accounts
1. Go to "Users and Access" → "Sandbox Testers"
2. Create test accounts with unique emails
3. On your iOS device:
   - Settings → App Store → Sandbox Account
   - Sign in with test account
4. Test purchases will be free and won't charge real money

---

### Part B: Google Play Console Setup

#### 1. Create App in Google Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in:
   - **App name:** Toxic The Card Game
   - **Default language:** English
   - **App or game:** Game
   - **Free or paid:** Free

#### 2. Set Up App Details
1. Complete all required sections:
   - Store listing
   - Content rating
   - Target audience
   - Privacy policy

#### 3. Create In-App Product
1. Go to "Monetize" → "Products" → "In-app products"
2. Click "Create product"
3. Fill in:
   - **Product ID:** `com.stevenandrepennant.toxicthecardgame.fullversion`
   - **Name:** Full Version Unlock
   - **Description:** Unlock unlimited rounds and all cards
   - **Status:** Active
   - **Price:** Set your price (e.g., $6.99)

#### 4. Testing with License Testers
1. Go to "Setup" → "License testing"
2. Add test Gmail accounts under "License testers"
3. Set "License test response" to "RESPOND_NORMALLY"
4. These accounts can make test purchases without being charged

#### 5. Internal Testing Track (Recommended)
1. Go to "Testing" → "Internal testing"
2. Create a new release
3. Upload your AAB file
4. Add testers (Gmail accounts)
5. Testers will receive an opt-in link to install the app
6. Test purchases will work immediately (no review needed)

---

## Part C: Building and Testing

### Build for iOS (TestFlight)
```bash
# Install EAS CLI if you haven't
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Submit to TestFlight
eas submit --platform ios
```

### Build for Android (Internal Testing)
```bash
# Build AAB for Google Play
eas build --platform android --profile production

# Submit to Google Play (Internal Testing)
eas submit --platform android
```

### Local Testing (Before Submission)

#### iOS Simulator Testing:
```bash
# Build for simulator
eas build --platform ios --profile development

# Install on simulator
# Download the .tar.gz file and drag to simulator
```

#### Android Testing:
```bash
# Build APK for testing
eas build --platform android --profile preview

# Install on device
adb install path-to-your-app.apk
```

---

## Part D: Testing IAP in Development

### Testing on iOS:
1. **Sandbox Testing:**
   - Use sandbox tester accounts (created in App Store Connect)
   - Sign out of real App Store account on device
   - Settings → App Store → Sandbox Account → Sign in with test account
   - Launch app and test purchase
   - Purchases are free and can be repeated

2. **StoreKit Configuration File (Optional):**
   - Create `.storekit` file in Xcode for local testing
   - Test without connecting to App Store servers

### Testing on Android:
1. **License Testing:**
   - Add your Gmail account as license tester
   - Install app via Internal Testing track
   - Test purchases (won't be charged)
   - Can test multiple times

2. **Clearing Test Purchases:**
   - The app now automatically flushes old test purchases on Android
   - Or manually: Google Play Store → Account → Payments & subscriptions → Budget & history

---

## Part E: Common Issues and Solutions

### Issue 1: "No products found"
**Solution:**
- Verify product IDs match exactly in code and store
- iOS: Wait 2-4 hours after creating product
- Android: Product must be "Active" status
- App must be published to at least Internal Testing (Android)

### Issue 2: "Purchase failed" on Android testing
**Solution:**
- Ensure you're using a license tester account
- App must be installed via Internal Testing track (not sideloaded APK)
- Check that billing permission is in app.json
- Try: `await RNIap.flushFailedPurchasesCachedAsPendingAndroid()`

### Issue 3: "Sandbox account not working" on iOS
**Solution:**
- Sign out of real App Store account completely
- Delete and reinstall app
- Make sure sandbox account is verified (check email)
- Try different sandbox account

### Issue 4: Purchase works but doesn't unlock features
**Solution:**
- Check AsyncStorage: `await AsyncStorage.getItem('fullVersion')`
- Verify `finishTransaction` is called
- Check console logs for errors
- Try "Restore Purchases" button

### Issue 5: "E_USER_CANCELLED" error
**Solution:**
- This is normal when user cancels purchase
- App handles this gracefully (no error shown to user)

---

## Part F: Pre-Submission Checklist

### iOS App Store:
- [ ] Bundle ID matches: `com.stevenandrepennant.toxicthecardgame`
- [ ] IAP product created with ID: `com.stevenandrepennant.toxicthecardgame.fullversion`
- [ ] IAP product has screenshot and description
- [ ] Tested with sandbox account
- [ ] App binary uploaded to TestFlight
- [ ] IAP submitted for review (happens with app submission)
- [ ] Privacy policy URL added (if collecting data)
- [ ] App screenshots and description complete

### Google Play Store:
- [ ] Package name matches: `com.stevenandrepennant.toxicthecardgame`
- [ ] IAP product created and set to "Active"
- [ ] Tested via Internal Testing track
- [ ] Content rating completed
- [ ] Privacy policy added
- [ ] Store listing complete with screenshots
- [ ] AAB file uploaded to Internal Testing first
- [ ] Tested with license tester account

---

## Part G: After Approval

### Monitoring Purchases:
1. **iOS:** App Store Connect → Sales and Trends
2. **Android:** Google Play Console → Monetization → Overview

### Handling Support:
- Users can restore purchases via "Restore Purchases" button
- Check AsyncStorage for purchase status
- Verify receipt with Apple/Google if needed

### Updating IAP:
- Price changes: Update in store console (no app update needed)
- Product changes: May require app update and review

---

## Quick Reference: Product IDs

```typescript
// iOS Product ID
com.stevenandrepennant.toxicthecardgame.fullversion

// Android Product ID  
com.stevenandrepennant.toxicthecardgame.fullversion

// These MUST match exactly in:
// 1. App Store Connect / Google Play Console
// 2. contexts/PurchaseContext.tsx (PRODUCT_IDS constant)
```

---

## Support Resources

- **Apple IAP Documentation:** https://developer.apple.com/in-app-purchase/
- **Google Play Billing:** https://developer.android.com/google/play/billing
- **react-native-iap Docs:** https://github.com/dooboolab-community/react-native-iap
- **Expo IAP Guide:** https://docs.expo.dev/guides/in-app-purchases/

---

## Testing Commands

```bash
# Clear AsyncStorage (reset purchase state)
# Add this temporarily to your app for testing:
await AsyncStorage.removeItem('fullVersion');

# Check current purchase state
const status = await AsyncStorage.getItem('fullVersion');
console.log('Purchase status:', status);

# Test restore purchases
# Use the "Restore Purchases" button in Settings

# View console logs
# Use Expo dev tools or React Native Debugger
```

---

## Final Notes

1. **Testing is crucial:** Test thoroughly before submitting to stores
2. **Use Internal Testing:** Both platforms offer internal testing - use it!
3. **Sandbox/License testers:** Set these up before building
4. **Product IDs:** Must match exactly everywhere
5. **Patience:** iOS products can take 2-4 hours to appear after creation
6. **Android requires published app:** Even Internal Testing track counts as "published"

Your app is now properly configured for IAP and ready for store submission! 🎉
