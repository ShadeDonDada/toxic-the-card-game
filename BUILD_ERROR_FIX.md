
# Build Error Fix - react-native-purchases Plugin Issue

## Problem
The error occurred because `react-native-purchases` **does not have an Expo config plugin**. The library requires native code that cannot be configured through `app.json` alone.

## What Was Fixed

### 1. Removed Invalid Plugin Configuration
**Before (app.json):**
```json
"plugins": [
  ...
  [
    "react-native-purchases",
    {
      "apiKey": "REVENUECAT_API_KEY_PLACEHOLDER"
    }
  ]
]
```

**After (app.json):**
```json
"plugins": [
  "expo-font",
  "expo-router",
  "expo-web-browser",
  [
    "expo-splash-screen",
    {
      "backgroundColor": "#000000",
      "image": "./assets/images/461262ab-c67c-4edb-83cc-0d620afaa105.png",
      "resizeMode": "cover"
    }
  ]
]
```

### 2. Fixed App Scheme
Changed from `"Toxic - The Card Game"` to `"toxicthecardgame"` (no spaces or special characters).

## How to Build Your App

Since `react-native-purchases` requires native code, you **MUST** use EAS Build (not Expo Go):

### For iOS App Store:
```bash
# Build for production (App Store)
eas build --platform ios --profile production

# After build completes, submit to App Store
eas submit --platform ios --profile production
```

### For Android Google Play:
```bash
# Build for production (Google Play)
eas build --platform android --profile production

# After build completes, submit to Google Play
eas submit --platform android --profile production
```

### For Testing (Internal Distribution):
```bash
# iOS TestFlight
eas build --platform ios --profile preview

# Android APK for testing
eas build --platform android --profile preview
```

## Important Notes

1. **Cannot use Expo Go**: Because `react-native-purchases` requires native code, you cannot test IAP in Expo Go. You must create a development build:
   ```bash
   eas build --platform ios --profile development
   # or
   eas build --platform android --profile development
   ```

2. **RevenueCat Configuration**: Make sure you've configured your RevenueCat API keys in `contexts/PurchaseContext.tsx`:
   ```typescript
   const REVENUECAT_API_KEY = Platform.select({
     ios: 'appl_YOUR_ACTUAL_IOS_API_KEY_HERE',
     android: 'goog_YOUR_ACTUAL_ANDROID_API_KEY_HERE',
   }) as string;
   ```

3. **Product IDs**: Ensure your product IDs in RevenueCat match what's configured in App Store Connect and Google Play Console.

4. **Testing IAP**:
   - iOS: Use TestFlight with sandbox testers
   - Android: Use internal testing track with test accounts

## Build Process

1. **First time setup**:
   ```bash
   # Login to EAS
   eas login
   
   # Configure your project
   eas build:configure
   ```

2. **Build the app**:
   ```bash
   # For iOS
   eas build --platform ios --profile production
   
   # For Android
   eas build --platform android --profile production
   ```

3. **Submit to stores**:
   ```bash
   # iOS App Store
   eas submit --platform ios
   
   # Google Play Store
   eas submit --platform android
   ```

## Why This Error Occurred

The error message indicated:
- `react-native-purchases` doesn't have an `app.plugin.js` file
- The main export is not a config plugin
- Syntax error when trying to import the package as a plugin

This is because `react-native-purchases` is a **native module** that requires:
- Native iOS code (Swift/Objective-C)
- Native Android code (Kotlin/Java)
- Cannot be configured through Expo config plugins alone

The solution is to use **EAS Build** which handles the native code compilation automatically.

## Next Steps

1. ✅ Build error is now fixed
2. Update RevenueCat API keys in `contexts/PurchaseContext.tsx`
3. Run `eas build --platform ios --profile production` to build for iOS
4. Run `eas build --platform android --profile production` to build for Android
5. Test IAP functionality in the built apps (not Expo Go)
6. Submit to App Store and Google Play when ready

## Testing Checklist

- [ ] RevenueCat API keys configured
- [ ] Product IDs match in RevenueCat, App Store Connect, and Google Play Console
- [ ] iOS build completes successfully
- [ ] Android build completes successfully
- [ ] IAP purchase flow works in TestFlight
- [ ] IAP purchase flow works in Google Play internal testing
- [ ] Restore purchases works correctly
- [ ] Demo mode limits work as expected
- [ ] Full version unlocks after purchase

## Support

If you encounter issues during the build process:
1. Check EAS Build logs for detailed error messages
2. Verify all credentials are configured in EAS
3. Ensure bundle identifiers match in app.json and eas.json
4. Check that RevenueCat dashboard is properly configured
