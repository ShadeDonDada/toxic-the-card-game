
# Monetization Setup Guide

This app now includes a complete free demo + paywall system with ads and in-app purchases.

## Features Implemented

### 1. Free Demo Mode
- Limits gameplay to exactly 3 scenarios and 3 response cards
- Applies only when user has not purchased the full version
- Does not modify how scenarios or cards are presented—only restricts the count

### 2. Ads (Free Users Only)
- Uses Google AdMob interstitial ads
- Shows ads only at round endings (after a round fully completes)
- Does not show ads during gameplay, card selection, menus, or onboarding
- Never shows ads before the first round starts
- Disables all ads immediately after a successful purchase

### 3. Paid Unlock
- One-time $6.99 "Buy Me a Coffee & Dounut" unlock
- Uses Apple In-App Purchases (iOS) and Google Play Billing (Android)
- After purchase:
  - Removes all ads permanently
  - Unlocks unlimited scenarios and response cards
  - Persists unlock across app restarts and reinstalls

### 4. Purchase Handling
- Verifies purchases using platform's native receipt validation
- Maintains a secure isPremium state
- Automatically restores premium access when app is reinstalled

### 5. Settings Page
- Two buttons added:
  - "Buy Full Version – $6.99"
  - "Restore Purchase"
- Restore button re-enables premium access without ads if previously purchased

## Setup Instructions

### 1. AdMob Setup

#### Create AdMob Account
1. Go to https://admob.google.com/
2. Sign in with your Google account
3. Create a new app for both iOS and Android

#### Get Ad Unit IDs
1. In AdMob console, create Interstitial ad units for both platforms
2. Copy the Ad Unit IDs
3. Replace the test IDs in `utils/adManager.ts`:

```typescript
const INTERSTITIAL_AD_UNIT_ID = Platform.select({
  ios: 'YOUR_IOS_AD_UNIT_ID', // Replace with your actual iOS Ad Unit ID
  android: 'YOUR_ANDROID_AD_UNIT_ID', // Replace with your actual Android Ad Unit ID
})
```

#### Update app.json
Replace the test App IDs in `app.json`:

```json
{
  "ios": {
    "config": {
      "googleMobileAdsAppId": "YOUR_IOS_APP_ID"
    }
  },
  "android": {
    "config": {
      "googleMobileAdsAppId": "YOUR_ANDROID_APP_ID"
    }
  }
}
```

### 2. In-App Purchase Setup

#### iOS (Apple App Store)

1. **App Store Connect Setup:**
   - Go to https://appstoreconnect.apple.com/
   - Select your app
   - Go to "Features" → "In-App Purchases"
   - Click "+" to create a new in-app purchase
   - Select "Non-Consumable"
   - Product ID: `com.toxicgame.premium`
   - Price: $6.99
   - Display Name: "Buy Me a Coffee & Dounut"
   - Description: "Unlock unlimited scenarios, response cards, and remove all ads"

2. **Update Product ID:**
   In `contexts/PurchaseContext.tsx`, update the product ID if needed:
   ```typescript
   const PRODUCT_ID = Platform.select({
     ios: 'com.toxicgame.premium', // Must match App Store Connect
     android: 'com.toxicgame.premium',
   })
   ```

#### Android (Google Play)

1. **Google Play Console Setup:**
   - Go to https://play.google.com/console/
   - Select your app
   - Go to "Monetize" → "Products" → "In-app products"
   - Click "Create product"
   - Product ID: `com.toxicgame.premium`
   - Name: "Buy Me a Coffee & Dounut"
   - Description: "Unlock unlimited scenarios, response cards, and remove all ads"
   - Price: $6.99

2. **Update Product ID:**
   Same as iOS, ensure the product ID matches in `contexts/PurchaseContext.tsx`

### 3. Testing

#### Test Ads
- The app currently uses AdMob test ad unit IDs
- Test ads will show during development
- Replace with production IDs before release

#### Test In-App Purchases

**iOS:**
1. Create a Sandbox Tester account in App Store Connect
2. Sign out of your Apple ID on the device
3. Run the app and attempt a purchase
4. Sign in with the Sandbox Tester account when prompted

**Android:**
1. Add your Google account as a License Tester in Google Play Console
2. Use a signed APK (not debug build)
3. Test the purchase flow

### 4. Build Configuration

#### iOS Build
```bash
npx expo prebuild -p ios
cd ios
pod install
cd ..
npx expo run:ios
```

#### Android Build
```bash
npx expo prebuild -p android
npx expo run:android
```

### 5. Important Notes

- **Demo Mode:** Free users are limited to 3 scenarios and 3 response cards
- **Ads:** Only show after round 2+ (never on first round)
- **Premium Status:** Persisted in AsyncStorage and verified with platform stores
- **Restore Purchases:** Always available in Settings for users who reinstall

### 6. Compliance

- ✅ Full compliance with Apple App Store guidelines
- ✅ Full compliance with Google Play Store guidelines
- ✅ Ads never appear after premium unlock
- ✅ Purchases are reversible via restore
- ✅ No external payment links or third-party checkout

## File Structure

```
contexts/
  PurchaseContext.tsx       # Manages premium status and IAP
  ThemeContext.tsx          # Theme management

utils/
  adManager.ts              # AdMob integration and ad display logic

hooks/
  useDemoMode.ts            # Demo mode limits for free users
  useGameState.ts           # Game state with demo mode integration

app/
  _layout.tsx               # Root layout with PurchaseProvider
  settings.tsx              # Settings with purchase buttons
  game.tsx                  # Game screen with ad integration
  (tabs)/(home)/index.tsx   # Home screen with demo notice
```

## Support

For issues or questions:
- Check the console logs (all actions are logged)
- Verify AdMob and IAP setup in respective consoles
- Test with sandbox/test accounts before production release
