
# Product ID Configuration Quick Reference

## Current Configuration

The app is configured with the following product ID:

```typescript
Product ID: com.toxicgame.fullversion
Type: Non-consumable (one-time purchase)
Price: $6.99 (configurable in store)
```

## Where to Configure

### 1. In the Code (Already Done)
Location: `contexts/PurchaseContext.tsx`

```typescript
const PRODUCT_IDS = Platform.select({
  ios: ['com.toxicgame.fullversion'],
  android: ['com.toxicgame.fullversion'],
  default: ['com.toxicgame.fullversion'],
}) as string[];
```

### 2. In App Store Connect (iOS)
1. Go to your app → In-App Purchases
2. Create Non-Consumable product
3. **Product ID**: `com.toxicgame.fullversion`
4. **Display Name**: "Buy me a drink"
5. **Price**: $6.99 (or your preferred tier)

### 3. In Google Play Console (Android)
1. Go to Monetize → Products → In-app products
2. Create product
3. **Product ID**: `com.toxicgame.fullversion`
4. **Name**: "Full Version Unlock"
5. **Price**: $6.99 USD

## Changing the Product ID

If you want to use a different product ID:

1. **Update the code** in `contexts/PurchaseContext.tsx`:
   ```typescript
   const PRODUCT_IDS = Platform.select({
     ios: ['your.new.product.id'],
     android: ['your.new.product.id'],
     default: ['your.new.product.id'],
   }) as string[];
   ```

2. **Create new products** in both App Store Connect and Google Play Console with the new ID

3. **Rebuild the app** and test thoroughly

## Product ID Naming Convention

Recommended format: `com.yourcompany.appname.productname`

Examples:
- `com.toxicgame.fullversion`
- `com.toxicgame.unlock.all`
- `com.yourcompany.toxicgame.premium`

**Important**: 
- Product IDs are permanent and cannot be changed after creation
- Use lowercase letters, numbers, and periods only
- Must be unique across your entire developer account
- iOS and Android can use the same ID or different IDs

## Testing Product IDs

### iOS Sandbox
- Product IDs work immediately in sandbox after creation
- No approval needed for testing
- Use sandbox test accounts

### Android Testing
- Product IDs work immediately in internal testing
- No approval needed for testing
- Use license test accounts

## Production Checklist

- [ ] Product ID matches exactly in code and both stores
- [ ] Product is approved in App Store Connect (iOS)
- [ ] Product is active in Google Play Console (Android)
- [ ] Tested successfully on both platforms
- [ ] Price is set correctly in both stores
- [ ] Localized descriptions added

## Quick Test

To verify your product ID is working:

1. Run the app in development
2. Go to Settings
3. Check the console logs for:
   ```
   Products loaded: [{ productId: 'com.toxicgame.fullversion', ... }]
   ```
4. If the product appears, your configuration is correct!

## Need Help?

See `IAP_CONFIGURATION_GUIDE.md` for detailed setup instructions.
