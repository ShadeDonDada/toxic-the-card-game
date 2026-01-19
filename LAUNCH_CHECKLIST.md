
# 🚀 Launch Checklist - Superwall In-App Purchases

Use this checklist to ensure everything is set up correctly before launching your app.

## ☑️ Pre-Launch Checklist

### 1. Superwall Configuration
- [ ] Created Superwall account at https://superwall.com/
- [ ] Created app in Superwall dashboard
- [ ] Copied API key from Superwall dashboard
- [ ] Replaced `YOUR_SUPERWALL_API_KEY` in `contexts/PurchaseContext.tsx` with actual API key
- [ ] Verified API key is correct (no typos)

### 2. iOS Setup (App Store Connect)
- [ ] Created app in App Store Connect
- [ ] Created In-App Purchase product:
  - [ ] Type: Non-Consumable
  - [ ] Product ID: `com.toxicgame.premium` (or your custom ID)
  - [ ] Price: $6.99 (or your chosen price)
  - [ ] Display Name: "Buy Me a Drink"
  - [ ] Description filled out
  - [ ] Screenshot uploaded (if required)
- [ ] Product status: "Ready to Submit"
- [ ] Added product to Superwall dashboard (Products section)

### 3. Android Setup (Google Play Console)
- [ ] Created app in Google Play Console
- [ ] Created In-App Product:
  - [ ] Product ID: `com.toxicgame.premium` (must match iOS)
  - [ ] Price: $6.99 (or your chosen price)
  - [ ] Name: "Buy Me a Drink"
  - [ ] Description filled out
- [ ] Product status: "Active"
- [ ] Added product to Superwall dashboard (Products section)

### 4. Superwall Paywall Design
- [ ] Created paywall in Superwall dashboard
- [ ] Customized paywall design:
  - [ ] Title set
  - [ ] Subtitle set
  - [ ] Features list added
  - [ ] Button text set
  - [ ] Colors match app theme
- [ ] Added product to paywall
- [ ] Published paywall

### 5. Superwall Campaign
- [ ] Created campaign in Superwall dashboard
- [ ] Set trigger event: `purchase_full_version`
- [ ] Selected paywall
- [ ] Activated campaign
- [ ] Verified campaign is live

### 6. Testing - iOS
- [ ] Created Sandbox Tester account in App Store Connect
- [ ] Built app for iOS: `npx expo prebuild -p ios`
- [ ] Installed pods: `cd ios && pod install && cd ..`
- [ ] Ran app on device: `npx expo run:ios`
- [ ] Tested purchase flow:
  - [ ] Tapped "Buy me a drink" button
  - [ ] Paywall appeared correctly
  - [ ] Completed test purchase
  - [ ] App unlocked (unlimited rounds/cards)
  - [ ] Verified purchase persists after app restart
- [ ] Tested restore purchases:
  - [ ] Deleted app
  - [ ] Reinstalled app
  - [ ] Tapped "Restore Purchases"
  - [ ] App unlocked successfully

### 7. Testing - Android
- [ ] Added Google account as License Tester in Play Console
- [ ] Built app for Android: `npx expo prebuild -p android`
- [ ] Ran app on device: `npx expo run:android`
- [ ] Tested purchase flow:
  - [ ] Tapped "Buy me a drink" button
  - [ ] Paywall appeared correctly
  - [ ] Completed test purchase
  - [ ] App unlocked (unlimited rounds/cards)
  - [ ] Verified purchase persists after app restart
- [ ] Tested restore purchases:
  - [ ] Deleted app
  - [ ] Reinstalled app
  - [ ] Tapped "Restore Purchases"
  - [ ] App unlocked successfully

### 8. Demo Mode Testing
- [ ] Tested with fresh install (no purchase):
  - [ ] App starts in demo mode
  - [ ] Limited to 3 scenarios
  - [ ] Limited to 3 cards per player
  - [ ] Demo limit prompt appears after 3 rounds
  - [ ] "Buy me a drink" button works
  - [ ] Settings page shows demo notice

### 9. App Configuration
- [ ] Updated `app.json` with correct bundle identifiers:
  - [ ] iOS: `bundleIdentifier` matches App Store Connect
  - [ ] Android: `package` matches Google Play Console
- [ ] Verified Superwall plugin is in `app.json` plugins array
- [ ] Updated app version number
- [ ] Updated app name and description

### 10. Build for Production
- [ ] iOS:
  - [ ] Created production build: `eas build -p ios`
  - [ ] Uploaded to App Store Connect
  - [ ] Submitted for review
- [ ] Android:
  - [ ] Created production build: `eas build -p android`
  - [ ] Uploaded to Google Play Console
  - [ ] Submitted for review

### 11. Post-Launch Monitoring
- [ ] Monitor Superwall dashboard for:
  - [ ] Purchase conversion rates
  - [ ] Revenue metrics
  - [ ] Error logs
- [ ] Check app reviews for purchase issues
- [ ] Verify purchases are processing correctly
- [ ] Monitor support emails for purchase problems

## 🎯 Common Issues & Solutions

### Issue: Paywall doesn't appear
**Solution:** 
- Verify API key is correct in `PurchaseContext.tsx`
- Check campaign is activated in Superwall dashboard
- Ensure trigger event name matches: `purchase_full_version`

### Issue: Purchase fails
**Solution:**
- Verify product ID matches in App Store Connect/Play Console and Superwall
- Check product status is "Ready to Submit" (iOS) or "Active" (Android)
- Ensure using Sandbox Tester (iOS) or License Tester (Android)

### Issue: Restore doesn't work
**Solution:**
- Verify you completed a test purchase first
- Check you're signed in with the same Apple ID/Google account
- Try signing out and back in to the store

### Issue: Demo mode not working
**Solution:**
- Check `useDemoMode.ts` hook is being used in game screen
- Verify `isFullVersion` state is false for new installs
- Clear app data and reinstall

## 📞 Support Resources

- **Superwall Docs:** https://docs.superwall.com/
- **Superwall Support:** support@superwall.com
- **Superwall Discord:** https://discord.gg/superwall
- **Apple Developer Support:** https://developer.apple.com/support/
- **Google Play Support:** https://support.google.com/googleplay/android-developer/

## ✅ Ready to Launch!

Once all items are checked, you're ready to submit your app to the App Store and Google Play Store!

**Good luck with your launch! 🎉**
