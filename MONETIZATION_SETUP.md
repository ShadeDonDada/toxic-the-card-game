
# Monetization Setup Guide - Superwall Integration

This app now includes a complete free demo + paywall system using **Superwall** for seamless App Store and Google Play Store in-app purchases.

## Features Implemented

### 1. Free Demo Mode
- Limits gameplay to exactly 3 scenarios and 3 response cards
- Applies only when user has not purchased the full version
- Does not modify how scenarios or cards are presented—only restricts the count

### 2. Superwall Paywall Integration
- Native App Store (iOS) and Google Play Store (Android) payment processing
- Beautiful, customizable paywall UI managed through Superwall dashboard
- Automatic receipt validation and subscription management
- Supports one-time purchases, subscriptions, and free trials
- Handles restore purchases automatically

### 3. Paid Unlock
- One-time $6.99 "Buy Me a Drink" unlock (configurable in Superwall dashboard)
- After purchase:
  - Unlocks unlimited scenarios and response cards
  - Persists unlock across app restarts and reinstalls
  - Automatic restore on new devices

### 4. Purchase Handling
- Verifies purchases using platform's native receipt validation via Superwall
- Maintains a secure isPremium state
- Automatically restores premium access when app is reinstalled
- Real-time subscription status updates

### 5. Settings Page
- Two buttons:
  - "Buy me a drink" - Opens Superwall paywall
  - "Restore Purchases" - Restores previous purchases from App Store/Play Store

## Setup Instructions

### 1. Create Superwall Account

1. Go to https://superwall.com/
2. Sign up for a free account
3. Create a new app in the Superwall dashboard
4. Note your **API Key** from the dashboard

### 2. Configure Superwall API Key

In `contexts/PurchaseContext.tsx`, replace the placeholder API key:

```typescript
await Superwall.configure({
  apiKey: 'YOUR_SUPERWALL_API_KEY', // Replace with your actual Superwall API key from dashboard
});
```

### 3. Set Up In-App Purchases

#### iOS (Apple App Store)

1. **App Store Connect Setup:**
   - Go to https://appstoreconnect.apple.com/
   - Select your app
   - Go to "Features" → "In-App Purchases"
   - Click "+" to create a new in-app purchase
   - Select "Non-Consumable" (for one-time purchase) or "Auto-Renewable Subscription"
   - Product ID: `com.toxicgame.premium` (or your choice)
   - Price: $6.99
   - Display Name: "Buy Me a Drink"
   - Description: "Unlock unlimited scenarios, response cards, and full game access"

2. **Add Product to Superwall:**
   - In Superwall dashboard, go to "Products"
   - Click "Add Product"
   - Enter the Product ID from App Store Connect
   - Superwall will automatically sync pricing and details

#### Android (Google Play)

1. **Google Play Console Setup:**
   - Go to https://play.google.com/console/
   - Select your app
   - Go to "Monetize" → "Products" → "In-app products"
   - Click "Create product"
   - Product ID: `com.toxicgame.premium` (must match iOS for cross-platform)
   - Name: "Buy Me a Drink"
   - Description: "Unlock unlimited scenarios, response cards, and full game access"
   - Price: $6.99

2. **Add Product to Superwall:**
   - In Superwall dashboard, go to "Products"
   - Add the same Product ID for Android
   - Superwall handles cross-platform product management

### 4. Design Your Paywall

1. **In Superwall Dashboard:**
   - Go to "Paywalls" → "Create Paywall"
   - Choose a template or design from scratch
   - Customize:
     - Title: "Unlock Full Access"
     - Subtitle: "Get unlimited rounds and all cards"
     - Features list:
       - ✓ Unlimited scenarios
       - ✓ All response cards unlocked
       - ✓ No restrictions
     - Call-to-action button: "Buy Me a Drink - $6.99"
   - Add your product to the paywall
   - Publish the paywall

2. **Set Paywall Rules:**
   - Go to "Campaigns"
   - Create a campaign for the `purchase_full_version` event
   - Set the paywall to show when this event is triggered
   - Save and activate the campaign

### 5. Testing

#### Test Mode
- Superwall automatically uses sandbox mode during development
- Test purchases won't charge real money

#### iOS Testing
1. Create a Sandbox Tester account in App Store Connect
2. Sign out of your Apple ID on the device
3. Run the app and tap "Buy me a drink"
4. Sign in with the Sandbox Tester account when prompted
5. Complete the test purchase

#### Android Testing
1. Add your Google account as a License Tester in Google Play Console
2. Use a signed APK or AAB (not debug build)
3. Install the app and test the purchase flow
4. Test purchases will be marked as test transactions

### 6. Build Configuration

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

### 7. Production Deployment

#### Before Release:
1. ✅ Replace `YOUR_SUPERWALL_API_KEY` with your actual API key
2. ✅ Test purchase flow on both iOS and Android
3. ✅ Test restore purchases functionality
4. ✅ Verify demo mode limits work correctly
5. ✅ Ensure paywall displays correctly on all screen sizes

#### iOS Submission:
- Superwall is fully compliant with Apple App Store guidelines
- No additional configuration needed
- Submit your app as normal

#### Android Submission:
- Superwall is fully compliant with Google Play Store guidelines
- No additional configuration needed
- Submit your app as normal

### 8. Important Notes

- **Demo Mode:** Free users are limited to 3 scenarios and 3 response cards
- **Premium Status:** Automatically synced across devices via App Store/Play Store
- **Restore Purchases:** Always available in Settings for users who reinstall
- **Subscription Management:** Handled automatically by Superwall and native stores
- **Receipt Validation:** Superwall validates all purchases server-side for security

### 9. Superwall Features

✅ **No Code Required for Paywall Changes:**
- Update paywall design, pricing, and copy from the dashboard
- Changes go live instantly without app updates

✅ **A/B Testing:**
- Test different paywall designs and pricing
- Optimize conversion rates

✅ **Analytics:**
- Track purchase conversion rates
- Monitor revenue and user behavior
- View detailed purchase funnel analytics

✅ **Localization:**
- Automatic price localization for 175+ countries
- Multi-language paywall support

✅ **Cross-Platform:**
- Single product ID works on both iOS and Android
- Unified purchase management

### 10. Compliance

- ✅ Full compliance with Apple App Store guidelines
- ✅ Full compliance with Google Play Store guidelines
- ✅ GDPR compliant
- ✅ Purchases are reversible via restore
- ✅ No external payment links or third-party checkout
- ✅ Native store payment processing only

## File Structure

```
contexts/
  PurchaseContext.tsx       # Superwall integration and premium status management

app/
  _layout.tsx               # Root layout with PurchaseProvider
  settings.tsx              # Settings with purchase buttons
  game.tsx                  # Game screen with demo mode integration

hooks/
  useDemoMode.ts            # Demo mode limits for free users
  useGameState.ts           # Game state with demo mode integration
```

## Superwall Dashboard

Access your Superwall dashboard at: https://superwall.com/dashboard

Key sections:
- **Products:** Manage your in-app purchase products
- **Paywalls:** Design and customize your paywall UI
- **Campaigns:** Set rules for when to show paywalls
- **Analytics:** Track revenue and conversion metrics
- **Settings:** Configure API keys and app settings

## Support

For issues or questions:

**Superwall Support:**
- Documentation: https://docs.superwall.com/
- Support: support@superwall.com
- Discord: https://discord.gg/superwall

**App Issues:**
- Check the console logs (all actions are logged)
- Verify Superwall API key is correct
- Test with sandbox/test accounts before production release
- Ensure products are created in both App Store Connect and Google Play Console

## Pricing

Superwall offers:
- **Free Tier:** Up to $10k in monthly revenue
- **Growth Tier:** 2% of revenue above $10k
- **Enterprise:** Custom pricing for high-volume apps

Start with the free tier and scale as your app grows!
