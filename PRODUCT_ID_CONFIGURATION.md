
# Product ID Configuration

## Quick Setup

Before releasing your app, update the product IDs in `contexts/PurchaseContext.tsx`:

### Current Configuration (Line 20-24)

```typescript
const PRODUCT_IDS = Platform.select({
  ios: ['com.toxicgame.fullversion'], // ⚠️ REPLACE THIS
  android: ['com.toxicgame.fullversion'], // ⚠️ REPLACE THIS
  default: ['com.toxicgame.fullversion'],
}) as string[];
```

### Steps to Configure

1. **Create your in-app purchase products:**
   - **iOS**: In App Store Connect → Features → In-App Purchases
   - **Android**: In Google Play Console → Monetize → In-app products

2. **Copy your product IDs** from the store consoles

3. **Update the code** with your actual product IDs:

```typescript
const PRODUCT_IDS = Platform.select({
  ios: ['com.yourcompany.yourapp.fullversion'], // Your iOS product ID
  android: ['com.yourcompany.yourapp.fullversion'], // Your Android product ID
  default: ['com.yourcompany.yourapp.fullversion'],
}) as string[];
```

## Product ID Naming Convention

**Recommended format:**
- `com.[company].[app].[product]`
- Example: `com.toxicgame.toxic.fullversion`

**Rules:**
- Use lowercase letters
- Use dots (.) as separators
- No spaces or special characters
- Must be unique across your app
- Should be descriptive

## Common Product IDs

For a one-time purchase to unlock full version:
- `com.yourcompany.yourapp.fullversion`
- `com.yourcompany.yourapp.premium`
- `com.yourcompany.yourapp.unlock`

## Important Notes

1. **Product IDs must match exactly** between:
   - Your code (`contexts/PurchaseContext.tsx`)
   - App Store Connect (iOS)
   - Google Play Console (Android)

2. **Product IDs cannot be changed** after creation in the store consoles

3. **Test thoroughly** with sandbox/test accounts before releasing

4. **Different IDs for iOS and Android** are allowed but not required

## Current App Configuration

**Bundle Identifier (iOS):** `com.anonymous.Natively`
**Package Name (Android):** `com.StevenAndrePennant.ToxicTheCardGame`

**Suggested Product IDs:**
- iOS: `com.anonymous.Natively.fullversion`
- Android: `com.StevenAndrePennant.ToxicTheCardGame.fullversion`

Or use a unified ID:
- Both: `com.toxicgame.fullversion`

## Testing

After updating the product IDs:

1. Create the products in App Store Connect and Google Play Console
2. Set up sandbox testers (iOS) and license testers (Android)
3. Build and test the app
4. Verify purchases and restores work correctly

See `IAP_SETUP_GUIDE.md` for detailed testing instructions.
