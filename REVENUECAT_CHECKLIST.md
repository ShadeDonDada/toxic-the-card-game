
# RevenueCat Configuration Checklist

Use this checklist to ensure everything is configured correctly.

## ☑️ Pre-Launch Checklist

### 1. RevenueCat Dashboard Setup
- [ ] Created RevenueCat account
- [ ] Created project: "Toxic - The Card Game"
- [ ] Added iOS app (Bundle ID: `com.stevenandrepennant.toxicthecardgame`)
- [ ] Added Android app (Package: `com.stevenandrepennant.toxicthecardgame`)
- [ ] Connected to App Store Connect (iOS)
- [ ] Uploaded Google Play service account JSON (Android)
- [ ] Copied iOS API key (starts with `appl_`)
- [ ] Copied Android API key (starts with `goog_`)

### 2. App Store Connect (iOS)
- [ ] Created Non-Consumable in-app purchase
- [ ] Product ID: `com.stevenandrepennant.toxicthecardgame.fullversion`
- [ ] Price: $6.99
- [ ] Reference Name: "Toxic Full Version"
- [ ] Added localized descriptions
- [ ] Product status: Ready to Submit (or Approved)

### 3. Google Play Console (Android)
- [ ] Created in-app product
- [ ] Product ID: `com.stevenandrepennant.toxicthecardgame.fullversion`
- [ ] Price: $6.99
- [ ] Name: "Toxic Full Version"
- [ ] Status: Active

### 4. RevenueCat Entitlements
- [ ] Created entitlement with identifier: `pro` ⚠️ **EXACT MATCH REQUIRED**
- [ ] Display name: "Full Version"

### 5. RevenueCat Offerings
- [ ] Created offering (identifier: `default` or any name)
- [ ] Added package with product ID: `com.stevenandrepennant.toxicthecardgame.fullversion`
- [ ] Linked package to "pro" entitlement
- [ ] Set offering as "Current"
- [ ] Verified iOS product is linked
- [ ] Verified Android product is linked

### 6. App Configuration (app.json)
- [ ] Updated `revenueCatApiKeyIos` with actual iOS key
- [ ] Updated `revenueCatApiKeyAndroid` with actual Android key
- [ ] Verified `revenueCatEntitlementId` is set to `pro`
- [ ] Test keys are present for development

### 7. Build & Deploy
- [ ] Run `npx expo prebuild` to generate native projects
- [ ] Build iOS app (Xcode or EAS Build)
- [ ] Build Android app (Android Studio or EAS Build)
- [ ] Test on physical device (not simulator for purchases)

### 8. Testing
- [ ] Tested purchase flow on iOS
- [ ] Tested purchase flow on Android
- [ ] Verified full version unlocks after purchase
- [ ] Tested "Restore Purchases" on iOS
- [ ] Tested "Restore Purchases" on Android
- [ ] Verified demo limits work (3 rounds, 3 cards)
- [ ] Verified full version removes limits
- [ ] Checked console logs for errors

### 9. Verification
- [ ] Purchase completes successfully
- [ ] Full version unlocks immediately
- [ ] Settings shows "Thank You!" message
- [ ] Game allows unlimited rounds
- [ ] Game deals 6 cards per player (not 3)
- [ ] All scenario cards are available
- [ ] Restore purchases works on new device

## 🔍 Troubleshooting Checklist

If purchases aren't working, verify:

- [ ] Product IDs match **exactly** (case-sensitive)
- [ ] Entitlement ID is **exactly** `pro` (lowercase)
- [ ] Offering is set as "Current" in RevenueCat
- [ ] Products are active in App Store Connect / Google Play
- [ ] API keys are correct in app.json
- [ ] App is built with `npx expo prebuild` (not Expo Go for production)
- [ ] Testing on physical device (not simulator)
- [ ] Signed in with sandbox account (iOS) or test account (Android)

## 📊 Expected Console Logs

When everything is working, you should see:

```
[RevenueCat] Initializing in DEV mode with key: test_quMXN...
[RevenueCat] Entitlement ID: pro
[RevenueCat] Expected Product ID: com.stevenandrepennant.toxicthecardgame.fullversion
[RevenueCat] Fetching offerings...
[RevenueCat] Current offering found: default
[RevenueCat] Available packages: 1
[RevenueCat] Package 1: {
  identifier: 'fullversion',
  productId: 'com.stevenandrepennant.toxicthecardgame.fullversion',
  price: '$6.99',
  title: 'Toxic Full Version'
}
[RevenueCat] Checking subscription status...
[RevenueCat] Has entitlement: false
[RevenueCat] ⚠️ Demo version active
```

After purchase:
```
[RevenueCat] Attempting to purchase package: fullversion
[RevenueCat] Purchase completed
[RevenueCat] Has entitlement after purchase: true
[RevenueCat] ✅ Purchase successful - Full version unlocked!
```

## 🚨 Common Issues

### "No offerings found"
**Cause**: Offering not set as "Current" or products not synced
**Fix**: Set offering as "Current" in RevenueCat, wait 5-10 minutes

### "Purchase completed but entitlement not found"
**Cause**: Product not linked to entitlement, or entitlement ID mismatch
**Fix**: Verify product is linked to "pro" entitlement in RevenueCat dashboard

### "Product not available"
**Cause**: Product ID mismatch or product not active
**Fix**: Verify product ID matches exactly, check product is active in store

### Restore doesn't find purchases
**Cause**: Different Apple ID / Google account, or purchase not synced
**Fix**: Ensure same account, check RevenueCat dashboard for purchase

## ✅ Success Criteria

Your RevenueCat integration is successful when:

1. ✅ Settings screen shows product price ($6.99)
2. ✅ Purchase flow completes without errors
3. ✅ Full version unlocks immediately after purchase
4. ✅ Settings shows "Thank You!" message
5. ✅ Game allows unlimited rounds (no 3-round limit)
6. ✅ Game deals 6 cards per player (not 3)
7. ✅ Restore purchases works on new device
8. ✅ Console logs show successful entitlement check

---

**Need detailed help?** See `REVENUECAT_CONFIGURATION_GUIDE.md`

**Quick start?** See `REVENUECAT_QUICK_START.md`
