
# In-App Purchase Testing Checklist

Use this checklist to verify that IAP is working correctly before submitting to the App Store and Google Play.

## Pre-Testing Setup

- [ ] RevenueCat account created and configured
- [ ] iOS product created in App Store Connect (`com.stevenandrepennant.toxicthecardgame.fullversion`)
- [ ] Android product created in Google Play Console (`com.stevenandrepennant.toxicthecardgame.fullversion`)
- [ ] RevenueCat API keys added to `contexts/PurchaseContext.tsx`
- [ ] Entitlement `full_version` created in RevenueCat
- [ ] Offering `default` created and set as current in RevenueCat
- [ ] iOS Sandbox test account created
- [ ] Android license testing accounts added

## iOS Testing (Sandbox)

### Initial State
- [ ] App launches successfully
- [ ] Settings screen shows "Demo Version Active" notice
- [ ] Purchase button shows correct price
- [ ] Game is limited to 3 rounds
- [ ] Players get 3 cards each (not 6)

### Purchase Flow
- [ ] Tap "Buy me a drink" button
- [ ] iOS purchase sheet appears
- [ ] Sign in with Sandbox test account
- [ ] Complete purchase (not charged)
- [ ] Success alert appears: "Purchase Successful! 🎉"
- [ ] Settings screen updates to show "Thank You!"
- [ ] Demo notice disappears
- [ ] Game now allows unlimited rounds
- [ ] Players now get 6 cards each

### Restore Flow
- [ ] Delete app from device
- [ ] Reinstall app
- [ ] App starts in demo mode
- [ ] Tap "Restore Purchases"
- [ ] Sign in with same Sandbox account
- [ ] Success alert appears: "Restore Successful! ✅"
- [ ] Full version is unlocked
- [ ] Game works with unlimited rounds

### Edge Cases
- [ ] Cancel purchase → No error alert, stays in demo mode
- [ ] Airplane mode → Graceful error handling
- [ ] Multiple rapid taps on purchase button → No crashes
- [ ] Purchase while already purchased → Shows "Already purchased"

## Android Testing (Internal Testing)

### Initial State
- [ ] App launches successfully
- [ ] Settings screen shows "Demo Version Active" notice
- [ ] Purchase button shows correct price
- [ ] Game is limited to 3 rounds
- [ ] Players get 3 cards each (not 6)

### Purchase Flow
- [ ] Tap "Buy me a drink" button
- [ ] Google Play purchase dialog appears
- [ ] Complete purchase (test purchase, not charged)
- [ ] Success alert appears: "Purchase Successful! 🎉"
- [ ] Settings screen updates to show "Thank You!"
- [ ] Demo notice disappears
- [ ] Game now allows unlimited rounds
- [ ] Players now get 6 cards each

### Restore Flow
- [ ] Uninstall app from device
- [ ] Reinstall app from Internal Testing
- [ ] App starts in demo mode
- [ ] Tap "Restore Purchases"
- [ ] Success alert appears: "Restore Successful! ✅"
- [ ] Full version is unlocked
- [ ] Game works with unlimited rounds

### Edge Cases
- [ ] Cancel purchase → No error alert, stays in demo mode
- [ ] Airplane mode → Graceful error handling
- [ ] Multiple rapid taps on purchase button → No crashes
- [ ] Purchase while already purchased → Shows "Already purchased"

## Cross-Platform Testing

- [ ] Purchase on iOS → Restore on iOS (same Apple ID) → Works
- [ ] Purchase on Android → Restore on Android (same Google account) → Works
- [ ] Purchase on iOS → Install on Android → Stays in demo mode (expected - different stores)
- [ ] Purchase on Android → Install on iOS → Stays in demo mode (expected - different stores)

## Demo Mode Verification

### Round Limits
- [ ] Demo mode: Game stops after round 3
- [ ] Demo mode: "Demo limit reached" modal appears
- [ ] Demo mode: Modal directs to Settings
- [ ] Full version: Game continues past round 3
- [ ] Full version: No demo limit modal

### Card Limits
- [ ] Demo mode: Each player gets 3 cards
- [ ] Demo mode: Only 3 scenario cards available
- [ ] Full version: Each player gets 6 cards
- [ ] Full version: All scenario cards available

### UI Updates
- [ ] Demo mode: Settings shows "Demo Version Active" notice
- [ ] Demo mode: Purchase button enabled
- [ ] Full version: Demo notice hidden
- [ ] Full version: Purchase button shows "Thank You!" and is disabled

## RevenueCat Dashboard Verification

- [ ] Open RevenueCat dashboard
- [ ] Go to Customers
- [ ] Find test purchase by email/user ID
- [ ] Verify purchase shows "Active" status
- [ ] Verify entitlement `full_version` is active
- [ ] Check transaction details (product ID, price, date)

## Console Logs Verification

### iOS Logs (Xcode Console)
- [ ] "Initializing RevenueCat Purchases..."
- [ ] "RevenueCat SDK configured successfully"
- [ ] "Customer info received"
- [ ] "Products loaded" (with product details)
- [ ] "User initiated purchase..."
- [ ] "Purchase completed, customer info: ..."
- [ ] "Unlocking full version..."
- [ ] "Full version unlocked successfully"

### Android Logs (Logcat)
- [ ] "Initializing RevenueCat Purchases..."
- [ ] "RevenueCat SDK configured successfully"
- [ ] "Customer info received"
- [ ] "Products loaded" (with product details)
- [ ] "User initiated purchase..."
- [ ] "Purchase completed, customer info: ..."
- [ ] "Unlocking full version..."
- [ ] "Full version unlocked successfully"

## Error Handling

- [ ] Network error during purchase → User-friendly error message
- [ ] Network error during restore → User-friendly error message
- [ ] Invalid product ID → Graceful fallback (mock product in dev mode)
- [ ] RevenueCat API error → App continues in demo mode
- [ ] Purchase interrupted (app closed) → Purchase completes on next launch

## Performance

- [ ] App launches quickly (< 3 seconds)
- [ ] Purchase flow is smooth (no lag)
- [ ] Restore is fast (< 5 seconds)
- [ ] No memory leaks during purchase flow
- [ ] No crashes during testing

## Final Checks Before Submission

- [ ] All console.log statements reviewed (remove sensitive data)
- [ ] RevenueCat API keys are correct (not placeholder values)
- [ ] Product IDs match exactly in all places
- [ ] Entitlement identifier is `full_version` everywhere
- [ ] App version number incremented
- [ ] Screenshots updated (if needed)
- [ ] App description mentions in-app purchase
- [ ] Privacy policy updated (if needed)

## Post-Submission Monitoring

After app is live:
- [ ] Monitor RevenueCat dashboard for real purchases
- [ ] Check for any error reports related to IAP
- [ ] Verify purchase emails are being sent (if configured)
- [ ] Monitor app reviews for IAP-related issues
- [ ] Test with real money (small amount) to verify production flow

## Notes

- iOS Sandbox purchases don't charge real money
- Android Internal Testing purchases don't charge real money
- Production purchases charge real money - test carefully!
- RevenueCat provides 10,000 free monthly active users
- Purchases are tied to Apple ID / Google account, not device

## Support Resources

If you encounter issues:
1. Check RevenueCat dashboard → Customers for purchase records
2. Review console logs for error messages
3. Consult RevenueCat documentation: https://docs.revenuecat.com/
4. Check App Store Connect / Google Play Console for product status
5. Contact RevenueCat support: https://community.revenuecat.com/

---

**Testing completed by**: _______________  
**Date**: _______________  
**iOS Version**: _______________  
**Android Version**: _______________  
**Notes**: _______________
