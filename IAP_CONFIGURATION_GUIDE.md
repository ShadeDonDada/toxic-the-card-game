
# In-App Purchase Configuration Guide

This guide will help you set up native in-app purchases for the Toxic Card Game app on both iOS (App Store Connect) and Android (Google Play Console).

## Overview

The app uses `react-native-iap` to implement native in-app billing:
- **iOS**: Apple In-App Purchases with StoreKit 2
- **Android**: Google Play Billing Library (latest stable version)

## Product Configuration

### Current Product ID
The app is configured to use the following product ID:
- **Product ID**: `com.toxicgame.fullversion`
- **Type**: Non-consumable (one-time purchase)
- **Description**: Unlocks unlimited rounds and all cards

You can change this product ID in `contexts/PurchaseContext.tsx` by modifying the `PRODUCT_IDS` constant.

---

## iOS Setup (App Store Connect)

### Step 1: Create App in App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Navigate to "My Apps" and create your app if you haven't already
3. Fill in all required app information

### Step 2: Create In-App Purchase Product
1. In your app's page, go to the "In-App Purchases" section
2. Click the "+" button to create a new in-app purchase
3. Select **"Non-Consumable"** as the type
4. Configure the product:
   - **Product ID**: `com.toxicgame.fullversion` (must match the ID in the code)
   - **Reference Name**: "Full Version Unlock"
   - **Price**: Select your price tier (e.g., $6.99 USD)

### Step 3: Add Localized Information
1. Add at least one localization (English recommended):
   - **Display Name**: "Buy me a drink"
   - **Description**: "Unlock unlimited rounds and all cards. Support the developer and enjoy the full Toxic Card Game experience!"

### Step 4: Add Screenshot for Review
1. Upload a screenshot showing the in-app purchase in your app
2. This is required for App Store review

### Step 5: Submit for Review
1. Save your in-app purchase
2. Submit it for review along with your app
3. Note: In-app purchases must be reviewed and approved before they work in production

### Step 6: Testing on iOS (Sandbox)
1. Go to "Users and Access" > "Sandbox Testers" in App Store Connect
2. Create a sandbox test account with a unique email
3. On your iOS device:
   - Sign out of your real Apple ID in Settings > App Store
   - Run the app and attempt a purchase
   - Sign in with your sandbox test account when prompted
4. Sandbox purchases are free and can be tested unlimited times

---

## Android Setup (Google Play Console)

### Step 1: Create App in Google Play Console
1. Go to [Google Play Console](https://play.google.com/console/)
2. Create your app if you haven't already
3. Complete all required app information

### Step 2: Set Up Merchant Account
1. Go to "Monetization setup" in the left sidebar
2. Link a Google Merchant account (required for in-app purchases)
3. Complete the merchant account setup and verification

### Step 3: Create In-App Product
1. Navigate to "Monetize" > "Products" > "In-app products"
2. Click "Create product"
3. Configure the product:
   - **Product ID**: `com.toxicgame.fullversion` (must match the ID in the code)
   - **Name**: "Full Version Unlock"
   - **Description**: "Unlock unlimited rounds and all cards. Support the developer and enjoy the full Toxic Card Game experience!"
   - **Status**: Set to "Active"
   - **Price**: Set your price (e.g., $6.99 USD)

### Step 4: Set Pricing
1. Click "Set price" and choose your default price
2. You can set different prices for different countries if desired
3. Save the pricing configuration

### Step 5: Activate the Product
1. Make sure the product status is set to "Active"
2. Save all changes

### Step 6: Testing on Android
1. **Internal Testing Track**:
   - Go to "Testing" > "Internal testing"
   - Create an internal testing release
   - Add test users via email addresses
   - Share the opt-in link with testers

2. **License Testing**:
   - Go to "Setup" > "License testing"
   - Add test Gmail accounts
   - These accounts can make test purchases without being charged

3. **Test Purchases**:
   - Install the app from the internal testing track
   - Sign in with a test account
   - Attempt a purchase - it will show as a test purchase
   - Test purchases can be "consumed" to test again

---

## App Configuration

### Update Product IDs (if needed)
If you want to use different product IDs, update them in `contexts/PurchaseContext.tsx`:

```typescript
const PRODUCT_IDS = Platform.select({
  ios: ['your.ios.product.id'],
  android: ['your.android.product.id'],
  default: ['your.product.id'],
}) as string[];
```

### Build Configuration

#### iOS (app.json)
Make sure your `app.json` includes:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.toxicgame",
      "supportsTablet": true
    }
  }
}
```

#### Android (app.json)
Make sure your `app.json` includes:
```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.toxicgame",
      "permissions": []
    }
  }
}
```

---

## Building for Production

### iOS Build
```bash
# Build for App Store
eas build --platform ios --profile production

# Or using Expo
expo build:ios
```

### Android Build
```bash
# Build for Google Play
eas build --platform android --profile production

# Or using Expo
expo build:android
```

---

## Testing Checklist

### iOS Testing
- [ ] Sandbox account created in App Store Connect
- [ ] Product appears in the app with correct price
- [ ] Purchase flow completes successfully
- [ ] App unlocks after purchase
- [ ] Restore purchases works correctly
- [ ] Purchase persists after app restart
- [ ] Purchase persists after app reinstall (via restore)

### Android Testing
- [ ] Test account added to license testing
- [ ] Product appears in the app with correct price
- [ ] Purchase flow completes successfully
- [ ] App unlocks after purchase
- [ ] Restore purchases works correctly
- [ ] Purchase persists after app restart
- [ ] Purchase persists after app reinstall (via restore)

---

## Common Issues and Solutions

### iOS Issues

**Issue**: "Cannot connect to iTunes Store"
- **Solution**: Make sure you're signed in with a sandbox account, not your real Apple ID

**Issue**: Product not showing up
- **Solution**: 
  - Verify product ID matches exactly in code and App Store Connect
  - Ensure product is approved and active
  - Wait a few hours after creating the product

**Issue**: "This In-App Purchase has already been bought"
- **Solution**: This is normal in sandbox - the purchase is already owned

### Android Issues

**Issue**: "Item not available for purchase"
- **Solution**:
  - Ensure product is set to "Active" in Play Console
  - Verify the app is signed with the correct keystore
  - Make sure you're testing with the internal testing track

**Issue**: "Authentication required"
- **Solution**: Sign in with a Google account that's added to license testing

**Issue**: Product not showing up
- **Solution**:
  - Verify product ID matches exactly in code and Play Console
  - Ensure product is active
  - Wait a few minutes after creating the product

---

## Support and Resources

### Documentation
- [react-native-iap Documentation](https://github.com/dooboolab-community/react-native-iap)
- [Apple In-App Purchase Guide](https://developer.apple.com/in-app-purchase/)
- [Google Play Billing Guide](https://developer.android.com/google/play/billing)

### Testing Resources
- [iOS Sandbox Testing](https://developer.apple.com/documentation/storekit/in-app_purchase/testing_in-app_purchases_with_sandbox)
- [Android Testing Guide](https://developer.android.com/google/play/billing/test)

---

## Next Steps

1. **Create products in both stores** using the product ID: `com.toxicgame.fullversion`
2. **Test thoroughly** using sandbox/test accounts
3. **Submit for review** along with your app
4. **Monitor** purchases and user feedback after launch

The in-app purchase implementation is complete and ready to use once you configure the products in both stores!
