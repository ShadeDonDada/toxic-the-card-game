
# RevenueCat IAP Implementation - Complete ✅

## What Was Changed

### 1. Switched from `react-native-iap` to `react-native-purchases`

**Why?**
- `react-native-purchases` (RevenueCat SDK) provides better support for Google Play Billing
- Easier testing with sandbox environments
- Built-in receipt validation and cross-platform purchase restoration
- Better error handling and debugging
- Real-time analytics dashboard

### 2. Updated Files

#### `contexts/PurchaseContext.tsx`
- Replaced `react-native-iap` imports with `react-native-purchases`
- Updated purchase flow to use RevenueCat's `purchasePackage()` method
- Updated restore flow to use RevenueCat's `restorePurchases()` method
- Added entitlement checking (`full_version` entitlement)
- Improved error handling and user feedback
- Added `productPrice` to context for dynamic pricing display

#### `app/settings.tsx`
- Updated to use `productPrice` from context instead of hardcoded price
- Improved error handling for purchase cancellations
- Better user feedback with alerts

#### `app.json`
- Replaced `react-native-iap` plugin with `react-native-purchases` plugin
- Added placeholder for RevenueCat API key configuration

### 3. Created Documentation

#### `REVENUECAT_SETUP_GUIDE.md`
- Complete step-by-step guide for setting up RevenueCat
- Instructions for configuring iOS App Store Connect
- Instructions for configuring Google Play Console
- How to create products and offerings in RevenueCat
- How to get API keys
- Testing instructions for both platforms

#### `IAP_TESTING_CHECKLIST.md`
- Comprehensive testing checklist
- Pre-testing setup verification
- iOS testing steps (sandbox)
- Android testing steps (internal testing)
- Cross-platform testing
- Demo mode verification
- Error handling checks
- Performance checks

## What You Need to Do

### Step 1: Create RevenueCat Account (5 minutes)

1. Go to https://www.revenuecat.com/
2. Sign up for a free account
3. Create a new project: "Toxic - The Card Game"

### Step 2: Configure iOS (30 minutes)

1. **App Store Connect**:
   - Create in-app purchase product: `com.stevenandrepennant.toxicthecardgame.fullversion`
   - Set price: $6.99
   - Create sandbox test account

2. **RevenueCat**:
   - Add iOS app with bundle ID: `com.stevenandrepennant.toxicthecardgame`
   - Connect App Store Connect API (upload .p8 key)
   - Get iOS API key (starts with `appl_`)

### Step 3: Configure Android (30 minutes)

1. **Google Play Console**:
   - Create in-app product: `com.stevenandrepennant.toxicthecardgame.fullversion`
   - Set price: $6.99
   - Add license testing accounts

2. **RevenueCat**:
   - Add Android app with package: `com.stevenandrepennant.toxicthecardgame`
   - Connect Google Play (upload service account JSON)
   - Get Android API key (starts with `goog_`)

### Step 4: Configure RevenueCat Products (10 minutes)

1. **Create Product**:
   - Identifier: `full_version` (this is the entitlement)
   - Type: Non-Consumable
   - Link iOS and Android product IDs

2. **Create Offering**:
   - Identifier: `default`
   - Add package with `full_version` product
   - Set as current offering

### Step 5: Update App Code (2 minutes)

Open `contexts/PurchaseContext.tsx` and replace the API keys:

```typescript
const REVENUECAT_API_KEY = Platform.select({
  ios: 'appl_YOUR_ACTUAL_IOS_API_KEY_HERE',  // Replace with your iOS key
  android: 'goog_YOUR_ACTUAL_ANDROID_API_KEY_HERE',  // Replace with your Android key
}) as string;
```

### Step 6: Test (1-2 hours)

Follow the checklist in `IAP_TESTING_CHECKLIST.md`:

**iOS Testing**:
```bash
# Build for iOS
eas build --platform ios --profile preview

# Or run locally
npx expo run:ios
```

**Android Testing**:
```bash
# Build for Android
eas build --platform android --profile preview
```

Test:
- ✅ Purchase flow
- ✅ Restore purchases
- ✅ Demo mode limits
- ✅ Full version unlock
- ✅ Cross-platform behavior

### Step 7: Submit to Stores

Once testing is complete:

1. **iOS**: Submit app + in-app purchase for review in App Store Connect
2. **Android**: Promote to production in Google Play Console

## How It Works

### Purchase Flow

1. User taps "Buy me a drink" in Settings
2. App calls `purchaseFullVersion()` in `PurchaseContext`
3. RevenueCat SDK shows native purchase dialog (iOS/Android)
4. User completes purchase
5. RevenueCat validates receipt with Apple/Google
6. App receives `customerInfo` with active `full_version` entitlement
7. App unlocks full version and saves to AsyncStorage
8. Success alert shown to user

### Restore Flow

1. User taps "Restore Purchases" in Settings
2. App calls `restorePurchases()` in `PurchaseContext`
3. RevenueCat SDK queries Apple/Google for previous purchases
4. If purchase found, RevenueCat returns `customerInfo` with active entitlement
5. App unlocks full version and saves to AsyncStorage
6. Success alert shown to user

### Demo Mode

- **Default**: App starts in demo mode (3 rounds, 3 cards per player)
- **After Purchase**: Full version unlocked (unlimited rounds, 6 cards per player)
- **After Restore**: Full version unlocked (same as purchase)
- **Persistence**: Purchase status saved to AsyncStorage for offline support

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         App Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Settings   │  │     Game     │  │  DemoLimit   │      │
│  │    Screen    │  │    Screen    │  │    Modal     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                 │                  │               │
│         └─────────────────┼──────────────────┘               │
│                           │                                  │
│  ┌────────────────────────▼──────────────────────────────┐  │
│  │           PurchaseContext (Global State)              │  │
│  │  - isFullVersion                                      │  │
│  │  - purchaseFullVersion()                              │  │
│  │  - restorePurchases()                                 │  │
│  └────────────────────────┬──────────────────────────────┘  │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                   RevenueCat SDK Layer                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  react-native-purchases                              │   │
│  │  - configure()                                        │   │
│  │  - purchasePackage()                                  │   │
│  │  - restorePurchases()                                 │   │
│  │  - getCustomerInfo()                                  │   │
│  └────────────────────────┬─────────────────────────────┘   │
└───────────────────────────┼──────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                    Platform Layer                             │
│  ┌──────────────────┐              ┌──────────────────┐      │
│  │   iOS StoreKit   │              │  Google Play     │      │
│  │   (StoreKit 2)   │              │  Billing Library │      │
│  └──────────────────┘              └──────────────────┘      │
└───────────────────────────────────────────────────────────────┘
```

## Key Features

✅ **Native Billing**: Uses Apple StoreKit 2 and Google Play Billing Library
✅ **Cross-Platform**: Single codebase for iOS and Android
✅ **Offline Support**: Purchase status cached in AsyncStorage
✅ **Receipt Validation**: RevenueCat validates all purchases server-side
✅ **Restore Purchases**: Users can restore on new devices
✅ **Demo Mode**: 3 rounds, 3 cards per player (limited experience)
✅ **Full Version**: Unlimited rounds, 6 cards per player
✅ **Error Handling**: Graceful fallbacks for network issues
✅ **User Feedback**: Clear alerts for success/failure
✅ **Testing Support**: Works with sandbox/test accounts

## Pricing

- **RevenueCat**: Free for up to 10,000 monthly active users
- **Apple**: 30% commission on purchases (15% after year 1)
- **Google**: 30% commission on purchases (15% after year 1)

## Support

If you encounter issues:

1. **Check RevenueCat Dashboard**: Go to Customers tab to see purchase records
2. **Review Console Logs**: Look for error messages in Xcode/Logcat
3. **Consult Documentation**: 
   - RevenueCat: https://docs.revenuecat.com/
   - Apple IAP: https://developer.apple.com/in-app-purchase/
   - Google Play Billing: https://developer.android.com/google/play/billing
4. **Community Support**: https://community.revenuecat.com/

## Next Steps

1. ✅ Complete RevenueCat setup (Steps 1-5 above)
2. ✅ Test on iOS with sandbox account
3. ✅ Test on Android with internal testing
4. ✅ Verify demo mode limits work correctly
5. ✅ Submit to App Store and Google Play
6. ✅ Monitor purchases in RevenueCat dashboard

---

**Implementation Date**: January 2025
**SDK Version**: react-native-purchases ^9.7.5
**Status**: Ready for testing ✅
