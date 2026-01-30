
# RevenueCat Configuration Guide for Toxic - The Card Game

This guide will help you configure RevenueCat for the one-time "Full Version" purchase in your app.

## 📋 Prerequisites

- RevenueCat account (sign up at https://www.revenuecat.com/)
- Apple Developer account (for iOS)
- Google Play Console account (for Android)

## 🔧 Step 1: RevenueCat Dashboard Setup

### 1.1 Create a New Project
1. Log in to RevenueCat dashboard
2. Create a new project named "Toxic - The Card Game"

### 1.2 Configure App Platforms

#### iOS Configuration:
1. Go to Project Settings → Apps → Add App
2. Select "iOS"
3. Enter Bundle ID: `com.stevenandrepennant.toxicthecardgame`
4. Connect to App Store Connect:
   - Enter your App Store Connect credentials
   - Or upload App Store Connect API Key (recommended)

#### Android Configuration:
1. Go to Project Settings → Apps → Add App
2. Select "Android"
3. Enter Package Name: `com.stevenandrepennant.toxicthecardgame`
4. Upload your Google Play Service Account JSON key:
   - Go to Google Play Console → Setup → API access
   - Create a service account
   - Download the JSON key file
   - Upload to RevenueCat

### 1.3 Get API Keys
1. Go to Project Settings → API Keys
2. Copy the following keys:
   - **iOS API Key** (starts with `appl_`)
   - **Android API Key** (starts with `goog_`)
   - **Test Store API Keys** (starts with `test_`) - for development/testing

## 🛍️ Step 2: Create Products in App Stores

### 2.1 iOS - App Store Connect

1. Go to App Store Connect → My Apps → Your App
2. Navigate to "In-App Purchases"
3. Click "+" to create a new in-app purchase
4. Select **"Non-Consumable"** (one-time purchase)
5. Configure:
   - **Product ID**: `com.stevenandrepennant.toxicthecardgame.fullversion`
   - **Reference Name**: "Toxic Full Version"
   - **Price**: $6.99 (or your preferred price)
   - **Localized Description**: "Unlock unlimited rounds and all cards. One-time payment, no subscriptions!"
6. Add localized names and descriptions
7. Submit for review (or use in sandbox for testing)

### 2.2 Android - Google Play Console

1. Go to Google Play Console → Your App → Monetize → Products → In-app products
2. Click "Create product"
3. Configure:
   - **Product ID**: `com.stevenandrepennant.toxicthecardgame.fullversion`
   - **Name**: "Toxic Full Version"
   - **Description**: "Unlock unlimited rounds and all cards. One-time payment, no subscriptions!"
   - **Status**: Active
   - **Price**: $6.99 (or your preferred price)
4. Save and activate

## 🎯 Step 3: Configure RevenueCat Entitlements & Offerings

### 3.1 Create Entitlement
1. In RevenueCat dashboard, go to "Entitlements"
2. Click "New Entitlement"
3. Configure:
   - **Identifier**: `pro` (CRITICAL - must match app.json)
   - **Display Name**: "Full Version"
   - **Description**: "Unlock all features"

### 3.2 Create Offering
1. Go to "Offerings" in RevenueCat dashboard
2. Click "New Offering"
3. Configure:
   - **Identifier**: `default` (or any name you prefer)
   - **Description**: "Full Version Purchase"
4. Click "Add Package"
5. Configure package:
   - **Identifier**: `fullversion` (or `$rc_lifetime` for lifetime package)
   - **iOS Product**: Select `com.stevenandrepennant.toxicthecardgame.fullversion`
   - **Android Product**: Select `com.stevenandrepennant.toxicthecardgame.fullversion`
6. Link to entitlement: Select "pro" entitlement
7. Save and make this offering "Current"

### 3.3 Verify Configuration
- Ensure the product is linked to the "pro" entitlement
- Ensure the offering is set as "Current"
- Verify product IDs match exactly on both platforms

## 🔑 Step 4: Update App Configuration

### 4.1 Update app.json
Replace the placeholder API keys in `app.json`:

```json
{
  "expo": {
    "extra": {
      "revenueCatApiKeyIos": "appl_YOUR_ACTUAL_IOS_KEY_HERE",
      "revenueCatApiKeyAndroid": "goog_YOUR_ACTUAL_ANDROID_KEY_HERE",
      "revenueCatTestApiKeyIos": "test_quMXNzeUDRgKAgXdvcXRBSwpMlP",
      "revenueCatTestApiKeyAndroid": "test_quMXNzeUDRgKAgXdvcXRBSwpMlP",
      "revenueCatEntitlementId": "pro"
    }
  }
}
```

**IMPORTANT**: 
- Replace `appl_YOUR_ACTUAL_IOS_KEY_HERE` with your iOS API key from RevenueCat
- Replace `goog_YOUR_ACTUAL_ANDROID_KEY_HERE` with your Android API key from RevenueCat
- Keep the test keys for development/testing in Expo Go
- The entitlement ID **MUST** be `pro` (matches RevenueCat dashboard)

## 🧪 Step 5: Testing

### 5.1 Test in Development (Expo Go)
1. The app will use test store keys automatically in development
2. Test purchases won't charge real money
3. Use RevenueCat's test store to simulate purchases

### 5.2 Test on iOS (Sandbox)
1. Create a sandbox tester account in App Store Connect
2. Sign out of your real Apple ID on the device
3. Build and install the app
4. Make a test purchase - you'll be prompted to sign in with sandbox account
5. Verify purchase completes and full version unlocks

### 5.3 Test on Android (Test Track)
1. Upload app to Google Play Console Internal Testing track
2. Add test users
3. Install app from Play Store
4. Make a test purchase
5. Verify purchase completes and full version unlocks

### 5.4 Test Restore Purchases
1. Make a purchase on one device
2. Install app on another device (same Apple ID / Google account)
3. Tap "Restore Purchases" in Settings
4. Verify full version unlocks

## 🔍 Troubleshooting

### Issue: "No offerings found"
**Solution**: 
- Verify offering is set as "Current" in RevenueCat dashboard
- Check that products are active in App Store Connect / Google Play Console
- Wait 5-10 minutes for RevenueCat to sync with app stores

### Issue: "Purchase completed but entitlement not found"
**Solution**:
- Verify product is linked to "pro" entitlement in RevenueCat dashboard
- Check that entitlement ID in app.json matches RevenueCat dashboard (`pro`)
- Check RevenueCat dashboard → Customers → find your user → verify entitlements

### Issue: "Product not available"
**Solution**:
- Ensure product ID matches exactly: `com.stevenandrepennant.toxicthecardgame.fullversion`
- Verify product is active in App Store Connect / Google Play Console
- Check RevenueCat logs for product sync errors

### Issue: Restore doesn't find purchases
**Solution**:
- Ensure user is signed in with same Apple ID / Google account
- Check RevenueCat dashboard → Customers → search by user ID
- Verify purchase appears in RevenueCat dashboard

## 📱 How It Works in the App

1. **Demo Mode**: By default, users have 3 rounds and 3 cards per player
2. **Purchase Flow**: 
   - User taps "Buy me a drink" in Settings ($6.99)
   - Native purchase dialog appears
   - After successful purchase, full version unlocks immediately
3. **Full Version**: Unlimited rounds and all cards available
4. **Restore**: Users can restore purchases on new devices via "Restore Purchases" button

## 🔐 Security Notes

- API keys in `app.json` are public keys (safe to include in app)
- Never commit secret API keys to version control
- RevenueCat handles all purchase validation server-side
- Purchases are verified with Apple/Google before granting entitlements

## 📊 Monitoring

- View purchases in RevenueCat dashboard → Customers
- Monitor revenue in RevenueCat dashboard → Charts
- Check for errors in RevenueCat dashboard → Logs
- Use console logs in app for debugging (search for `[RevenueCat]`)

## 🚀 Going Live

1. Submit app for review with in-app purchase
2. Ensure products are approved in App Store Connect / Google Play Console
3. Verify RevenueCat API keys are production keys (not test keys)
4. Test purchase flow one final time before launch
5. Monitor RevenueCat dashboard for first purchases

## 📞 Support

- RevenueCat Documentation: https://docs.revenuecat.com/
- RevenueCat Support: support@revenuecat.com
- Check app console logs for detailed error messages (search for `[RevenueCat]`)

---

**Current Configuration Summary:**
- **Entitlement ID**: `pro`
- **Product ID**: `com.stevenandrepennant.toxicthecardgame.fullversion`
- **Price**: $6.99
- **Type**: Non-consumable (one-time purchase)
- **Features Unlocked**: Unlimited rounds, all cards
