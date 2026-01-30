
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';
import Purchases, { 
  PurchasesPackage, 
  CustomerInfo,
  LOG_LEVEL,
  PurchasesStoreProduct
} from 'react-native-purchases';

// IMPORTANT: Product IDs must match exactly what's configured in App Store Connect and Google Play Console
// Bundle ID: com.stevenandrepennant.toxicthecardgame
// Product ID: com.stevenandrepennant.toxicthecardgame.fullversion
const PRODUCT_ID = 'com.stevenandrepennant.toxicthecardgame.fullversion';

// RevenueCat API Keys - You need to get these from RevenueCat dashboard
// For testing, you can use the same key for both platforms or separate keys
const REVENUECAT_API_KEY = Platform.select({
  ios: 'appl_YOUR_IOS_API_KEY_HERE',
  android: 'goog_YOUR_ANDROID_API_KEY_HERE',
}) as string;

interface PurchaseContextType {
  isFullVersion: boolean;
  loading: boolean;
  subscriptionStatus: string;
  products: PurchasesStoreProduct[];
  productPrice: string;
  purchaseFullVersion: () => Promise<void>;
  restorePurchases: () => Promise<void>;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export function PurchaseProvider({ children }: { children: ReactNode }) {
  // Start with false (demo mode) by default - requires explicit purchase or restore
  const [isFullVersion, setIsFullVersion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<PurchasesStoreProduct[]>([]);
  const [productPrice, setProductPrice] = useState('6.99');

  useEffect(() => {
    initializePurchases();
  }, []);

  const initializePurchases = async () => {
    try {
      console.log('Initializing RevenueCat Purchases...');
      
      // Configure RevenueCat SDK
      if (__DEV__) {
        // Enable debug logs in development
        Purchases.setLogLevel(LOG_LEVEL.DEBUG);
      }

      // Initialize Purchases SDK
      await Purchases.configure({ apiKey: REVENUECAT_API_KEY });
      console.log('RevenueCat SDK configured successfully');

      // Load purchase status from local storage first (for offline support)
      await loadPurchaseStatus();

      // Check current customer info from RevenueCat
      await checkCustomerInfo();

      // Load available products
      await loadProducts();

    } catch (error) {
      console.error('Error initializing Purchases:', error);
      // Continue with demo mode if initialization fails
      setLoading(false);
    }
  };

  const loadPurchaseStatus = async () => {
    try {
      console.log('Loading purchase status from AsyncStorage...');
      const status = await AsyncStorage.getItem('fullVersion');
      console.log('Purchase status loaded:', status);
      
      // CRITICAL: Only set to true if explicitly set to 'true' in storage
      // This ensures newly installed apps are in demo mode by default
      if (status === 'true') {
        setIsFullVersion(true);
        console.log('Full version verified from local storage');
      } else {
        setIsFullVersion(false);
        console.log('No purchase found in local storage - app in demo mode');
      }
    } catch (error) {
      console.error('Failed to load purchase status:', error);
      // On error, default to demo mode for safety
      setIsFullVersion(false);
    }
  };

  const checkCustomerInfo = async () => {
    try {
      console.log('Checking customer info from RevenueCat...');
      const customerInfo = await Purchases.getCustomerInfo();
      console.log('Customer info received:', customerInfo);
      
      // Check if user has active entitlement for full version
      const hasFullVersion = customerInfo.entitlements.active['full_version'] !== undefined;
      
      if (hasFullVersion) {
        console.log('User has active full version entitlement');
        await unlockFullVersion();
      } else {
        console.log('No active entitlement found - user in demo mode');
        setIsFullVersion(false);
        await AsyncStorage.setItem('fullVersion', 'false');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error checking customer info:', error);
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      console.log('Loading products from RevenueCat...');
      
      // Get available products
      const offerings = await Purchases.getOfferings();
      console.log('Offerings received:', offerings);
      
      if (offerings.current && offerings.current.availablePackages.length > 0) {
        const availableProducts = offerings.current.availablePackages.map(
          (pkg: PurchasesPackage) => pkg.product
        );
        console.log('Products loaded:', availableProducts);
        setProducts(availableProducts);
        
        // Set the price from the first product
        if (availableProducts.length > 0) {
          const price = availableProducts[0].priceString;
          setProductPrice(price);
          console.log('Product price set to:', price);
        }
      } else {
        console.warn('No offerings found. Make sure products are configured in RevenueCat dashboard');
        
        // For development/testing, create a mock product
        if (__DEV__) {
          console.log('Development mode: Using mock product for testing');
          setProductPrice('$6.99');
        }
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Use default price if loading fails
      setProductPrice('$6.99');
    }
  };

  const unlockFullVersion = async () => {
    try {
      console.log('Unlocking full version...');
      await AsyncStorage.setItem('fullVersion', 'true');
      setIsFullVersion(true);
      console.log('Full version unlocked successfully');
    } catch (error) {
      console.error('Failed to save purchase status:', error);
      throw error;
    }
  };

  const purchaseFullVersion = async () => {
    try {
      console.log('User initiated purchase...');
      
      // Get current offerings
      const offerings = await Purchases.getOfferings();
      
      if (!offerings.current || offerings.current.availablePackages.length === 0) {
        throw new Error('No products available for purchase');
      }

      // Get the first package (you can customize this to select specific packages)
      const packageToPurchase = offerings.current.availablePackages[0];
      console.log('Purchasing package:', packageToPurchase.identifier);

      // Make the purchase
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      console.log('Purchase completed, customer info:', customerInfo);

      // Check if the purchase was successful
      if (customerInfo.entitlements.active['full_version'] !== undefined) {
        console.log('Purchase successful - unlocking full version');
        await unlockFullVersion();
        
        Alert.alert(
          'Purchase Successful! 🎉',
          'Thank you for your support! You now have full access to unlimited rounds and all cards.',
          [{ text: 'OK' }]
        );
      } else {
        console.warn('Purchase completed but entitlement not found');
        Alert.alert(
          'Purchase Processing',
          'Your purchase is being processed. Please restart the app in a few moments.',
          [{ text: 'OK' }]
        );
      }
    } catch (error: any) {
      console.error('Purchase failed:', error);
      
      // Don't show alert for user cancellation
      if (error.userCancelled) {
        console.log('User cancelled the purchase');
        return;
      }
      
      Alert.alert(
        'Purchase Failed',
        error.message || 'Something went wrong with your purchase. Please try again.',
        [{ text: 'OK' }]
      );
      
      throw error;
    }
  };

  const restorePurchases = async () => {
    console.log('Restoring purchases...');
    try {
      // Restore purchases through RevenueCat
      const customerInfo = await Purchases.restorePurchases();
      console.log('Restore completed, customer info:', customerInfo);

      // Check if user has active entitlement
      if (customerInfo.entitlements.active['full_version'] !== undefined) {
        console.log('Purchase restored successfully');
        await unlockFullVersion();
        
        Alert.alert(
          'Restore Successful! ✅',
          'Your full version has been restored!',
          [{ text: 'OK' }]
        );
        
        return true;
      } else {
        console.log('No previous purchases found to restore');
        setIsFullVersion(false);
        await AsyncStorage.setItem('fullVersion', 'false');
        
        Alert.alert(
          'No Purchases Found',
          'No previous purchases were found for this account.',
          [{ text: 'OK' }]
        );
        
        return false;
      }
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      
      Alert.alert(
        'Restore Failed',
        'Unable to restore purchases. Please try again later.',
        [{ text: 'OK' }]
      );
      
      throw error;
    }
  };

  return (
    <PurchaseContext.Provider 
      value={{ 
        isFullVersion, 
        loading, 
        subscriptionStatus: isFullVersion ? 'ACTIVE' : 'INACTIVE',
        products,
        productPrice,
        purchaseFullVersion,
        restorePurchases
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}

export function usePurchase() {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchase must be used within PurchaseProvider');
  }
  return context;
}
