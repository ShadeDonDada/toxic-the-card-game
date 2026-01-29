
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';
import * as RNIap from 'react-native-iap';
import type {
  Product,
  Purchase,
  PurchaseError,
  SubscriptionPurchase,
} from 'react-native-iap';

// IMPORTANT: Replace these with your actual product IDs from App Store Connect and Google Play Console
// For iOS: Create in App Store Connect under "In-App Purchases"
// For Android: Create in Google Play Console under "Monetization" > "Products" > "In-app products"
const PRODUCT_IDS = Platform.select({
  ios: ['com.stevenandrepennant.toxicthecardgame.fullversion'],
  android: ['com.stevenandrepennant.toxicthecardgame.fullversion'],
  default: ['com.stevenandrepennant.toxicthecardgame.fullversion'],
}) as string[];

interface PurchaseContextType {
  isFullVersion: boolean;
  loading: boolean;
  subscriptionStatus: string;
  products: Product[];
  purchaseFullVersion: () => Promise<void>;
  restorePurchases: () => Promise<void>;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export function PurchaseProvider({ children }: { children: ReactNode }) {
  // Start with false (demo mode) by default - requires explicit purchase or restore
  const [isFullVersion, setIsFullVersion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let purchaseUpdateSubscription: any;
    let purchaseErrorSubscription: any;

    const init = async () => {
      try {
        await initializeIAP();
        
        // Set up purchase update listener
        purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
          async (purchase: Purchase | SubscriptionPurchase) => {
            console.log('Purchase update received:', purchase);
            const receipt = purchase.transactionReceipt;
            
            if (receipt) {
              try {
                // Finish the transaction
                await RNIap.finishTransaction({ purchase, isConsumable: false });
                console.log('Transaction finished successfully');
                
                // Unlock full version
                await unlockFullVersion();
                
                Alert.alert(
                  'Purchase Successful! 🎉',
                  'Thank you for your support! You now have full access to unlimited rounds and all cards.',
                  [{ text: 'OK' }]
                );
              } catch (error) {
                console.error('Error finishing transaction:', error);
              }
            }
          }
        );

        // Set up purchase error listener
        purchaseErrorSubscription = RNIap.purchaseErrorListener(
          (error: PurchaseError) => {
            console.error('Purchase error:', error);
            if (error.code !== 'E_USER_CANCELLED') {
              Alert.alert(
                'Purchase Failed',
                'Something went wrong with your purchase. Please try again.',
                [{ text: 'OK' }]
              );
            }
          }
        );
      } catch (error) {
        console.error('Error in initialization:', error);
      }
    };

    init();
    
    return () => {
      // Cleanup subscriptions
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
      
      // End IAP connection
      if (isInitialized) {
        RNIap.endConnection().catch((err) => {
          console.error('Error ending IAP connection:', err);
        });
      }
    };
  }, []);

  const initializeIAP = async () => {
    try {
      console.log('Initializing In-App Purchases...');
      
      // Connect to the store
      const connected = await RNIap.initConnection();
      console.log('IAP connection established:', connected);
      setIsInitialized(true);

      // For Android, flush old pending purchases (important for testing)
      if (Platform.OS === 'android') {
        try {
          await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
          console.log('Flushed failed purchases on Android');
        } catch (error) {
          console.error('Error flushing failed purchases:', error);
        }
      }

      // Load purchase status from AsyncStorage
      await loadPurchaseStatus();

      // Get available products from the store
      await loadProducts();

      // Check for any pending purchases (important for handling interrupted purchases)
      await checkPendingPurchases();

    } catch (error) {
      console.error('Error initializing IAP:', error);
      // Continue with demo mode if IAP fails to initialize
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
        console.log('Full version verified - unlocking app');
      } else {
        setIsFullVersion(false);
        console.log('No purchase found - app in demo mode (requires purchase or restore)');
      }
    } catch (error) {
      console.error('Failed to load purchase status:', error);
      // On error, default to demo mode for safety
      setIsFullVersion(false);
    } finally {
      setLoading(false);
      console.log('Purchase status loading complete');
    }
  };

  const loadProducts = async () => {
    try {
      console.log('Loading products from store with IDs:', PRODUCT_IDS);
      const availableProducts = await RNIap.getProducts({ skus: PRODUCT_IDS });
      console.log('Products loaded:', availableProducts);
      setProducts(availableProducts);
      
      if (availableProducts.length === 0) {
        console.warn('No products found. Make sure product IDs are configured correctly in App Store Connect / Google Play Console');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // For testing purposes, create a mock product if loading fails
      if (__DEV__) {
        console.log('Development mode: Using mock product for testing');
        setProducts([{
          productId: PRODUCT_IDS[0],
          title: 'Full Version',
          description: 'Unlock unlimited rounds and all cards',
          price: '6.99',
          currency: 'USD',
          localizedPrice: '$6.99',
          type: 'inapp',
        } as Product]);
      }
    }
  };

  const checkPendingPurchases = async () => {
    try {
      console.log('Checking for pending purchases...');
      
      // Get available purchases (purchases that haven't been finished)
      const availablePurchases = await RNIap.getAvailablePurchases();
      console.log('Available purchases:', availablePurchases);

      if (availablePurchases && availablePurchases.length > 0) {
        // User has made a purchase - unlock full version
        console.log('Found existing purchase - unlocking full version');
        await unlockFullVersion();
        
        // Finish all pending transactions
        for (const purchase of availablePurchases) {
          try {
            await RNIap.finishTransaction({ purchase, isConsumable: false });
            console.log('Finished pending transaction:', purchase.productId);
          } catch (error) {
            console.error('Error finishing pending transaction:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error checking pending purchases:', error);
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
      
      if (PRODUCT_IDS.length === 0) {
        throw new Error('No product IDs configured');
      }

      // Request purchase from the store
      console.log('Requesting purchase for product:', PRODUCT_IDS[0]);
      await RNIap.requestPurchase({ 
        sku: PRODUCT_IDS[0],
        ...(Platform.OS === 'android' && {
          obfuscatedAccountIdAndroid: undefined,
          obfuscatedProfileIdAndroid: undefined,
        }),
      });
      
      // The purchase will be handled by the purchaseUpdatedListener
      console.log('Purchase request sent to store');
    } catch (error: any) {
      console.error('Purchase failed:', error);
      
      // Don't show alert for user cancellation
      if (error.code === 'E_USER_CANCELLED') {
        console.log('User cancelled the purchase');
        return;
      }
      
      throw error;
    }
  };

  const restorePurchases = async () => {
    console.log('Restoring purchases...');
    try {
      // Get all available purchases from the store
      const availablePurchases = await RNIap.getAvailablePurchases();
      console.log('Available purchases for restore:', availablePurchases);

      if (availablePurchases && availablePurchases.length > 0) {
        // Found previous purchases - unlock full version
        await unlockFullVersion();
        console.log('Purchase restored successfully');
        
        // Finish all transactions
        for (const purchase of availablePurchases) {
          try {
            await RNIap.finishTransaction({ purchase, isConsumable: false });
            console.log('Finished restored transaction:', purchase.productId);
          } catch (error) {
            console.error('Error finishing restored transaction:', error);
          }
        }
        
        return true;
      } else {
        console.log('No previous purchases found to restore');
        return false;
      }
    } catch (error) {
      console.error('Failed to restore purchases:', error);
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
