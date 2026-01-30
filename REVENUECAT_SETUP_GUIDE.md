
# RevenueCat Setup Guide for Toxic - The Card Game

This guide will walk you through setting up RevenueCat for in-app purchases with Google Play Billing and Apple App Store.

## Why RevenueCat?

RevenueCat provides:
- ✅ Unified API for iOS and Android purchases
- ✅ Built-in support for Google Play Billing Library (latest version)
- ✅ StoreKit 2 support for iOS
- ✅ Easy testing with sandbox environments
- ✅ Purchase validation and receipt verification
- ✅ Cross-platform purchase restoration
- ✅ Real-time purchase analytics

## Step 1: Create RevenueCat Account

1. Go to [https://www.revenuecat.com/](https://www.revenuecat.com/)
2. Sign up for a free account
3. Create a new project called "Toxic - The Card Game"

## Step 2: Configure iOS App Store Connect

### 2.1 Create In-App Purchase Product

1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Select your app: **Toxic - The Card Game**
3. Go to **Features** → **In-App Purchases**
4. Click **+** to create a new in-app purchase
5. Select **Non-Consumable** (one-time purchase)
6. Configure the product:
   - **Product ID**: `com.stevenandrepennant.toxicthecardgame.fullversion`
   - **Reference Name**: Full Version
   - **Price**: $6.99 (or your preferred price)
   - **Localized Description**: 
     - **Display Name**: Full Version
     - **Description**: Unlock unlimited rounds and all cards in Toxic - The Card Game
7. Add a screenshot (required for review)
8. Click **Save**

### 2.2 Create Sandbox Test User

1. In App Store Connect, go to **Users and Access** → **Sandbox Testers**
2. Click **+** to add a new sandbox tester
3. Fill in the details (use a unique email that's not associated with any Apple ID)
4. Save the tester account

### 2.3 Connect iOS to RevenueCat

1. In RevenueCat dashboard, go to your project
2. Click **Apps** → **+ New**
3. Select **iOS**
4. Enter your Bundle ID: `com.stevenandrepennant.toxicthecardgame`
5. Get your **App Store Connect API Key**:
   - Go to App Store Connect → **Users and Access** → **Keys** (under Integrations)
   - Click **+** to generate a new key
   - Name it "RevenueCat"
   - Select **App Manager** role
   - Download the `.p8` key file (save it securely!)
   - Copy the **Key ID** and **Issuer ID**
6. Upload the `.p8` file to RevenueCat
7. Enter the Key ID and Issuer ID
8. Click **Save**

## Step 3: Configure Google Play Console

### 3.1 Create In-App Product

1. Go to [Google Play Console](https://play.google.com/console/)
2. Select your app: **Toxic - The Card Game**
3. Go to **Monetize** → **Products** → **In-app products**
4. Click **Create product**
5. Configure the product:
   - **Product ID**: `com.stevenandrepennant.toxicthecardgame.fullversion`
   - **Name**: Full Version
   - **Description**: Unlock unlimited rounds and all cards in Toxic - The Card Game
   - **Status**: Active
   - **Price**: $6.99 (or your preferred price)
6. Click **Save**

### 3.2 Set Up License Testing

1. In Google Play Console, go to **Setup** → **License testing**
2. Add test Gmail accounts that you want to use for testing
3. These accounts will be able to make test purchases without being charged

### 3.3 Connect Android to RevenueCat

1. In RevenueCat dashboard, go to your project
2. Click **Apps** → **+ New**
3. Select **Android**
4. Enter your Package Name: `com.stevenandrepennant.toxicthecardgame`
5. Get your **Google Play Service Account Key**:
   - In Google Play Console, go to **Setup** → **API access**
   - Click **Create new service account**
   - Follow the link to Google Cloud Console
   - Create a new service account named "RevenueCat"
   - Grant it the **Viewer** role
   - Create a JSON key for this service account
   - Download the JSON key file
6. Upload the JSON key file to RevenueCat
7. Click **Save**

## Step 4: Configure Products in RevenueCat

1. In RevenueCat dashboard, go to **Products**
2. Click **+ New**
3. Create a new product:
   - **Identifier**: `full_version` (this is the entitlement identifier)
   - **Type**: Non-Consumable
   - **iOS Product ID**: `com.stevenandrepennant.toxicthecardgame.fullversion`
   - **Android Product ID**: `com.stevenandrepennant.toxicthecardgame.fullversion`
4. Click **Save**

## Step 5: Create Offering in RevenueCat

1. In RevenueCat dashboard, go to **Offerings**
2. Click **+ New**
3. Create a new offering:
   - **Identifier**: `default` (this is important - the app looks for the "current" offering)
   - **Description**: Default offering for full version
4. Add a package:
   - **Identifier**: `full_version_package`
   - **Product**: Select the `full_version` product you created
5. Set this offering as **Current**
6. Click **Save**

## Step 6: Get Your API Keys

1. In RevenueCat dashboard, go to your project settings
2. Copy your **Public API Keys**:
   - **iOS API Key**: Starts with `appl_`
   - **Android API Key**: Starts with `goog_`

## Step 7: Update the App Code

Open `contexts/PurchaseContext.tsx` and replace the placeholder API keys:

```typescript
const REVENUECAT_API_KEY = Platform.select({
  ios: 'appl_YOUR_ACTUAL_IOS_API_KEY_HERE',
  android: 'goog_YOUR_ACTUAL_ANDROID_API_KEY_HERE',
}) as string;
```

Replace:
- `appl_YOUR_ACTUAL_IOS_API_KEY_HERE` with your actual iOS API key from RevenueCat
- `goog_YOUR_ACTUAL_ANDROID_API_KEY_HERE` with your actual Android API key from RevenueCat

## Step 8: Testing on iOS

### 8.1 Build and Install

```bash
# Build for iOS
eas build --platform ios --profile preview

# Or run locally
npx expo run:ios
```

### 8.2 Test Purchase Flow

1. Sign out of your Apple ID on the device (Settings → App Store → Sign Out)
2. Launch the app
3. Go to Settings
4. Tap "Buy me a drink"
5. When prompted, sign in with your **Sandbox Test Account** (created in Step 2.2)
6. Complete the purchase (you won't be charged)
7. Verify that the app unlocks full version

### 8.3 Test Restore Purchases

1. Delete the app
2. Reinstall the app
3. Go to Settings
4. Tap "Restore Purchases"
5. Sign in with the same sandbox test account
6. Verify that the full version is restored

## Step 9: Testing on Android

### 9.1 Create Internal Testing Track

1. In Google Play Console, go to **Testing** → **Internal testing**
2. Create a new release
3. Upload your APK/AAB:
   ```bash
   # Build for Android
   eas build --platform android --profile preview
   ```
4. Add testers (use the Gmail accounts you added in Step 3.2)
5. Save and publish the release

### 9.2 Test Purchase Flow

1. Install the app from the Internal Testing track
2. Launch the app
3. Go to Settings
4. Tap "Buy me a drink"
5. Complete the purchase (you won't be charged - it's a test purchase)
6. Verify that the app unlocks full version

### 9.3 Test Restore Purchases

1. Uninstall the app
2. Reinstall the app from Internal Testing
3. Go to Settings
4. Tap "Restore Purchases"
5. Verify that the full version is restored

## Step 10: Production Release

### 10.1 iOS Production

1. In App Store Connect, submit your in-app purchase for review
2. Submit your app for review
3. Once approved, the in-app purchase will be live

### 10.2 Android Production

1. In Google Play Console, promote your Internal Testing release to Production
2. Or create a new Production release with the same APK/AAB
3. Once published, the in-app purchase will be live

## Troubleshooting

### iOS Issues

**Problem**: "Cannot connect to iTunes Store"
- **Solution**: Make sure you're signed in with a Sandbox Test Account, not your regular Apple ID

**Problem**: Purchase doesn't unlock full version
- **Solution**: Check RevenueCat dashboard → Customers to see if the purchase was recorded. Verify the entitlement identifier is `full_version`

**Problem**: "Product not found"
- **Solution**: 
  - Verify the product ID matches exactly in App Store Connect and RevenueCat
  - Make sure the product is in "Ready to Submit" or "Approved" status
  - Wait a few hours after creating the product (Apple's servers need time to sync)

### Android Issues

**Problem**: "Item unavailable"
- **Solution**: 
  - Make sure you're testing with an account added to License Testing
  - Verify the product is Active in Google Play Console
  - Make sure you're testing on a device with Google Play Services

**Problem**: Purchase doesn't unlock full version
- **Solution**: Check RevenueCat dashboard → Customers to see if the purchase was recorded. Verify the entitlement identifier is `full_version`

**Problem**: "Authentication required"
- **Solution**: Make sure you're signed in to a Google account on the device

### General Issues

**Problem**: RevenueCat shows "Invalid API Key"
- **Solution**: Double-check that you copied the correct API keys from RevenueCat dashboard

**Problem**: Purchases work but don't sync across devices
- **Solution**: This is expected behavior. RevenueCat syncs purchases per Apple ID / Google account, not per device

## Support

- RevenueCat Documentation: [https://docs.revenuecat.com/](https://docs.revenuecat.com/)
- RevenueCat Community: [https://community.revenuecat.com/](https://community.revenuecat.com/)
- Apple In-App Purchase Guide: [https://developer.apple.com/in-app-purchase/](https://developer.apple.com/in-app-purchase/)
- Google Play Billing Guide: [https://developer.android.com/google/play/billing](https://developer.android.com/google/play/billing)

## Next Steps

After completing this setup:

1. ✅ Test purchases on both iOS and Android
2. ✅ Test restore purchases on both platforms
3. ✅ Verify that demo mode limits work correctly
4. ✅ Submit your app for review
5. ✅ Monitor purchases in RevenueCat dashboard

Good luck with your launch! 🚀
