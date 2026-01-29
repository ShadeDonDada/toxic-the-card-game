
# App Store Submission Fixes - Complete Guide

## ✅ Issues Fixed

### 1. **Invalid Slug (CRITICAL)**
- **Problem**: `"slug": "Toxic - The Card Game"` contained spaces
- **Fix**: Changed to `"slug": "toxic-the-card-game"` (URL-friendly, no spaces)
- **Why**: Expo requires slugs to be URL-friendly identifiers unique across your account

### 2. **Invalid Scheme (CRITICAL)**
- **Problem**: `"scheme": "Toxic - The Card Game"` contained spaces
- **Fix**: Changed to `"scheme": "toxicthecardgame"` (no spaces, lowercase)
- **Why**: Deep linking schemes cannot contain spaces or special characters

### 3. **Invalid iOS Bundle Identifier (CRITICAL)**
- **Problem**: `"bundleIdentifier": "com.anonymous.Natively"` was incorrect
- **Fix**: Changed to `"bundleIdentifier": "com.stevenandrepennant.toxicthecardgame"`
- **Why**: Must match your Apple Developer account and app identity

### 4. **Missing react-native-iap Plugin (CRITICAL for IAP)**
- **Problem**: IAP plugin not configured in app.json
- **Fix**: Added plugin configuration:
  ```json
  [
    "react-native-iap",
    {
      "disableStorekit2": false
    }
  ]
  ```
- **Why**: Required for In-App Purchases to work on iOS and Android

### 5. **Missing Android BILLING Permission (CRITICAL for IAP)**
- **Problem**: Android manifest missing BILLING permission
- **Fix**: Added to app.json:
  ```json
  "android": {
    "permissions": [
      "com.android.vending.BILLING"
    ]
  }
  ```
- **Why**: Required for Google Play Billing to function

### 6. **React State Update Error**
- **Problem**: "Can't perform a React state update on a component that hasn't mounted yet"
- **Fix**: Added proper initialization state management in `app/_layout.tsx`
- **Why**: Prevents race conditions during app startup

### 7. **Product ID Consistency**
- **Problem**: Product IDs may not match bundle identifier convention
- **Fix**: Updated to `com.stevenandrepennant.toxicthecardgame.fullversion`
- **Why**: Ensures consistency across iOS and Android stores

## 📋 Pre-Submission Checklist

### App Store Connect (iOS)
- [ ] Create app with bundle ID: `com.stevenandrepennant.toxicthecardgame`
- [ ] Create In-App Purchase product with ID: `com.stevenandrepennant.toxicthecardgame.fullversion`
- [ ] Set product as "Non-Consumable"
- [ ] Set price tier (e.g., $6.99)
- [ ] Add product description and screenshots
- [ ] Submit product for review

### Google Play Console (Android)
- [ ] Create app with package name: `com.stevenandrepennant.toxicthecardgame`
- [ ] Go to Monetization → Products → In-app products
- [ ] Create product with ID: `com.stevenandrepennant.toxicthecardgame.fullversion`
- [ ] Set product as "Managed product" (one-time purchase)
- [ ] Set price (e.g., $6.99)
- [ ] Add product description
- [ ] Activate the product

### Build Configuration
- [ ] Update `eas.json` submit section with your Apple ID and team ID
- [ ] Update `eas.json` submit section with your Google service account key path
- [ ] Ensure all assets (icons, splash screens) are present and valid
- [ ] Test IAP in sandbox/test mode before production

## 🚀 Building for Submission

### iOS Build
```bash
# Production build for App Store
eas build --platform ios --profile production

# After build completes, submit to App Store
eas submit --platform ios --profile production
```

### Android Build
```bash
# Production build for Google Play (AAB format)
eas build --platform android --profile production

# After build completes, submit to Google Play
eas submit --platform android --profile production
```

## 🧪 Testing IAP Before Submission

### iOS Testing
1. Add test users in App Store Connect → Users and Access → Sandbox Testers
2. Sign out of App Store on your device
3. Install the app via TestFlight or development build
4. When prompted, sign in with sandbox test account
5. Test purchase flow

### Android Testing
1. Add test users in Google Play Console → Setup → License testing
2. Install the app via internal testing track
3. Test purchase flow with test account
4. Verify purchase appears in Google Play Console

## ⚠️ Important Notes

1. **Bundle Identifiers Must Match**: Ensure the bundle ID in app.json matches exactly what's in App Store Connect and Google Play Console
2. **Product IDs Must Match**: Product IDs in the code must match exactly what's configured in both stores
3. **IAP Review**: In-App Purchases require separate review on both platforms
4. **Sandbox Testing**: Always test IAP in sandbox/test mode before submitting
5. **Privacy Policy**: Both stores require a privacy policy URL for apps with IAP
6. **Age Rating**: Set appropriate age rating (18+ for this game)

## 🔧 Troubleshooting

### "Product not found" error
- Verify product IDs match exactly in code and store consoles
- Ensure products are activated in store consoles
- Wait 2-4 hours after creating products for them to propagate

### "Invalid bundle identifier" error
- Ensure bundle ID in app.json matches App Store Connect
- Rebuild the app after changing bundle ID
- Clear Expo cache: `expo start -c`

### IAP not working in production
- Verify `react-native-iap` plugin is in app.json
- Verify BILLING permission is in Android manifest
- Check that products are approved and active in store consoles

## 📝 Next Steps

1. **Update EAS Submit Configuration**: Edit `eas.json` and add your actual Apple ID, App Store Connect app ID, team ID, and Google service account key path
2. **Create Store Listings**: Prepare app descriptions, screenshots, and promotional materials
3. **Test Thoroughly**: Test the app on real devices with sandbox/test accounts
4. **Submit for Review**: Use `eas submit` commands above
5. **Monitor Review Status**: Check App Store Connect and Google Play Console for review feedback

## ✨ Summary

All critical configuration issues have been fixed:
- ✅ Valid slug (URL-friendly)
- ✅ Valid scheme (no spaces)
- ✅ Correct bundle identifiers
- ✅ IAP plugin configured
- ✅ Android BILLING permission added
- ✅ Product IDs consistent
- ✅ React state initialization fixed

Your app is now ready for submission to both the App Store and Google Play Store!
