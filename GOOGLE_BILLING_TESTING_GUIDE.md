
# Google Play Billing Testing Guide

## Why Google Billing Requires Special Setup

Unlike iOS which allows testing with just sandbox accounts, Google Play Billing requires your app to be published to at least the **Internal Testing track** before IAP will work. This is a Google requirement, not a limitation of the app.

## Critical Fixes Applied for Testing

### 1. Flush Failed Purchases (Android)
```typescript
// Added in PurchaseContext.tsx
if (Platform.OS === 'android') {
  await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
}
```
This clears old test purchases that might be stuck in "pending" state.

### 2. Proper Product ID Format
```typescript
// Updated to match bundle identifier
com.stevenandrepennant.toxicthecardgame.fullversion
```

### 3. Billing Permission
```json
// Added to app.json
"permissions": [
  "com.android.vending.BILLING"
]
```

### 4. Development Mode Mock Products
```typescript
// If products fail to load in dev mode, use mock for testing UI
if (__DEV__) {
  setProducts([mockProduct]);
}
```

---

## Step-by-Step Testing Setup

### Step 1: Create In-App Product in Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app (or create it if you haven't)
3. Navigate to: **Monetize → Products → In-app products**
4. Click **"Create product"**
5. Fill in:
   ```
   Product ID: com.stevenandrepennant.toxicthecardgame.fullversion
   Name: Full Version Unlock
   Description: Unlock unlimited rounds and all cards
   Status: Active ✅ (MUST be Active!)
   Price: $6.99 (or your preferred price)
   ```
6. Click **"Save"**

### Step 2: Set Up License Testing

1. In Google Play Console, go to: **Setup → License testing**
2. Under **"License testers"**, add Gmail accounts that will test:
   ```
   your.email@gmail.com
   tester1@gmail.com
   tester2@gmail.com
   ```
3. Set **"License test response"** to: **"RESPOND_NORMALLY"**
4. Click **"Save changes"**

⚠️ **Important:** Only Gmail accounts added here can make test purchases!

### Step 3: Publish to Internal Testing Track

This is **REQUIRED** for IAP to work on Android:

1. Go to: **Testing → Internal testing**
2. Click **"Create new release"**
3. Upload your AAB file:
   ```bash
   eas build --platform android --profile production
   ```
4. Add release notes (e.g., "Initial test release")
5. Click **"Review release"** → **"Start rollout to Internal testing"**
6. Go to **"Testers"** tab
7. Create an email list and add your test Gmail accounts
8. Click **"Save"**

### Step 4: Install App via Internal Testing

1. Testers will receive an email with opt-in link
2. Or share the opt-in link manually:
   - Go to **Testing → Internal testing**
   - Copy the **"Copy link"** URL
   - Share with testers
3. Testers must:
   - Open link on Android device
   - Click **"Become a tester"**
   - Click **"Download it on Google Play"**
   - Install the app

⚠️ **Critical:** App MUST be installed via this link, not sideloaded APK!

### Step 5: Test Purchases

1. Open the app on your test device
2. Go to Settings
3. Tap **"Buy me a drink"**
4. Google Play purchase dialog will appear
5. You'll see a banner: **"This is a test purchase. You will not be charged."**
6. Complete the purchase
7. App should unlock full version

---

## Testing Scenarios

### Scenario 1: First-Time Purchase
1. Fresh install of app
2. App should be in demo mode (3 rounds limit)
3. Go to Settings → Purchase
4. Complete test purchase
5. App should unlock immediately
6. Play unlimited rounds

### Scenario 2: Restore Purchases
1. Uninstall app
2. Reinstall app
3. App should be in demo mode
4. Go to Settings → **"Restore Purchases"**
5. App should detect previous purchase and unlock

### Scenario 3: Interrupted Purchase
1. Start purchase flow
2. Close app during purchase
3. Reopen app
4. App should automatically detect and finish the purchase

---

## Troubleshooting

### Problem: "No products found"

**Possible Causes:**
1. Product not set to "Active" in Google Play Console
2. App not published to Internal Testing track
3. Product ID mismatch

**Solutions:**
```bash
# 1. Verify product ID in code matches console
# Check contexts/PurchaseContext.tsx:
const PRODUCT_IDS = ['com.stevenandrepennant.toxicthecardgame.fullversion'];

# 2. Verify product is Active in Google Play Console
# Monetize → Products → In-app products → Status should be "Active"

# 3. Verify app is published to Internal Testing
# Testing → Internal testing → Should show "Active"

# 4. Wait 2-3 hours after creating product (Google propagation time)
```

### Problem: "Purchase failed" or "Item unavailable"

**Possible Causes:**
1. Not using license tester account
2. App installed via APK instead of Internal Testing link
3. Billing permission missing

**Solutions:**
```bash
# 1. Verify Gmail account is added as license tester
# Setup → License testing → License testers

# 2. Uninstall app, reinstall via Internal Testing link
# Testing → Internal testing → Copy link → Install from Play Store

# 3. Verify billing permission in app.json
"permissions": ["com.android.vending.BILLING"]

# 4. Rebuild app after adding permission
eas build --platform android --profile production
```

### Problem: Purchase succeeds but doesn't unlock features

**Possible Causes:**
1. Transaction not finished properly
2. AsyncStorage not saving
3. App state not updating

**Solutions:**
```typescript
// Add debug logging to PurchaseContext.tsx
console.log('Purchase received:', purchase);
console.log('Finishing transaction...');
await RNIap.finishTransaction({ purchase, isConsumable: false });
console.log('Transaction finished');
console.log('Unlocking full version...');
await AsyncStorage.setItem('fullVersion', 'true');
console.log('Full version unlocked');

// Check AsyncStorage manually
const status = await AsyncStorage.getItem('fullVersion');
console.log('Current status:', status); // Should be 'true'
```

### Problem: "E_ALREADY_OWNED" error

**Cause:** You already own this product (from previous test)

**Solutions:**
```bash
# Option 1: Use "Restore Purchases" button
# This will unlock the app without repurchasing

# Option 2: Clear purchase history (for testing only)
# Google Play Store → Account → Payments & subscriptions → Budget & history
# Find the test purchase → Cancel/Refund

# Option 3: Use different test account
# Add another Gmail to license testers

# Option 4: Flush failed purchases (app does this automatically now)
await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
```

### Problem: "This version of the application is not configured for billing"

**Cause:** App not properly published to Internal Testing

**Solutions:**
```bash
# 1. Verify app is in Internal Testing track
# Testing → Internal testing → Should show release

# 2. Verify version code matches
# Check app.json: "versionCode": 2
# Should match or be higher than uploaded AAB

# 3. Wait 2-3 hours after publishing
# Google needs time to process the release

# 4. Verify package name matches
# app.json: "package": "com.stevenandrepennant.toxicthecardgame"
# Should match Google Play Console
```

---

## Testing Checklist

Before testing, verify:

- [ ] Product created in Google Play Console
- [ ] Product status is "Active"
- [ ] Product ID matches code exactly
- [ ] Gmail account added as license tester
- [ ] App published to Internal Testing track
- [ ] App installed via Internal Testing link (not APK)
- [ ] Billing permission in app.json
- [ ] Package name matches everywhere

---

## Testing Commands

```bash
# Build for Internal Testing
eas build --platform android --profile production

# Submit to Internal Testing
eas submit --platform android

# Check build status
eas build:list

# View build logs
eas build:view [build-id]
```

---

## Console Logs to Watch

When testing, watch for these logs:

```
✅ Good logs:
"Initializing In-App Purchases..."
"IAP connection established: true"
"Flushed failed purchases on Android"
"Products loaded: [...]"
"User initiated purchase..."
"Purchase update received: {...}"
"Transaction finished successfully"
"Full version unlocked successfully"

❌ Bad logs:
"Error initializing IAP: ..."
"Error loading products: ..."
"No products found"
"Purchase failed: ..."
"Error finishing transaction: ..."
```

---

## Important Notes

1. **Internal Testing is Required:** You cannot test Google Play Billing with a sideloaded APK
2. **License Testers Only:** Only Gmail accounts added as license testers can make test purchases
3. **Test Purchases are Free:** Test purchases won't charge real money
4. **Propagation Time:** Allow 2-3 hours after creating products or publishing releases
5. **One Purchase Per Account:** Each test account can only purchase once (use Restore or multiple accounts)
6. **Production vs Testing:** Test purchases only work in Internal/Closed/Open testing tracks, not production

---

## Quick Test Flow

```bash
# 1. Create product in Google Play Console
# 2. Add Gmail as license tester
# 3. Build and upload to Internal Testing
eas build --platform android --profile production
eas submit --platform android

# 4. Install via Internal Testing link
# 5. Open app → Settings → Buy me a drink
# 6. Complete test purchase (free)
# 7. Verify app unlocks
# 8. Test restore: Uninstall → Reinstall → Restore Purchases
```

---

## Support

If you're still having issues:

1. Check [Google Play Billing Documentation](https://developer.android.com/google/play/billing/test)
2. Review [react-native-iap Android Setup](https://github.com/dooboolab-community/react-native-iap#android)
3. Check Google Play Console → "Alerts" for any issues
4. Verify all steps in this guide are completed

Your app is now properly configured for Google Play Billing testing! 🎉
