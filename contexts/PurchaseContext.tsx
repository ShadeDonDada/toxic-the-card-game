
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

interface PurchaseContextType {
  isFullVersion: boolean;
  loading: boolean;
  subscriptionStatus: string;
  purchaseFullVersion: () => Promise<void>;
  restorePurchases: () => Promise<void>;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

// Product IDs for iOS and Android
// IMPORTANT: Replace these with your actual product IDs from App Store Connect and Google Play Console
const PRODUCT_IDS = Platform.select({
  ios: ['com.toxicgame.fullversion'], // Replace with your iOS product ID
  android: ['com.toxicgame.fullversion'], // Replace with your Android product ID
  default: ['com.toxicgame.fullversion'],
}) as string[];

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const [isFullVersion, setIsFullVersion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    initializeIAP();
    return () => {
      cleanupIAP();
    };
  }, []);

  const initializeIAP = async () => {
    console.log('Initializing in-app purchases...');
    try {
      // Initialize connection to store
      const connected = await RNIap.initConnection();
      console.log('IAP connection initialized:', connected);

      // Load purchase status from AsyncStorage
      await loadPurchaseStatus();

      // Get available products
      try {
        const availableProducts = await RNIap.getProducts({ skus: PRODUCT_IDS });
        console.log('Available products:', availableProducts);
        setProducts(availableProducts);
      } catch (error) {
        console.error('Failed to get products:', error);
      }

      // Set up purchase update listener
      const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
        async (purchase: Purchase | SubscriptionPurchase) => {
          console.log('Purchase updated:', purchase);
          const receipt = purchase.transactionReceipt;
          
          if (receipt) {
            try {
              // Acknowledge the purchase (required for Android)
              if (Platform.OS === 'android') {
                await RNIap.acknowledgePurchaseAndroid({
                  token: purchase.purchaseToken!,
                  developerPayload: purchase.developerPayloadAndroid,
                });
                console.log('Purchase acknowledged on Android');
              }

              // Finish the transaction (required for iOS)
              await RNIap.finishTransaction({ purchase, isConsumable: false });
              console.log('Transaction finished');

              // Save purchase status
              await AsyncStorage.setItem('fullVersion', 'true');
              setIsFullVersion(true);
              console.log('Full version unlocked successfully');
            } catch (error) {
              console.error('Failed to finish transaction:', error);
            }
          }
        }
      );

      // Set up purchase error listener
      const purchaseErrorSubscription = RNIap.purchaseErrorListener(
        (error: PurchaseError) => {
          console.error('Purchase error:', error);
          if (error.code !== 'E_USER_CANCELLED') {
            Alert.alert(
              'Purchase Failed',
              error.message || 'Something went wrong. Please try again.',
              [{ text: 'OK' }]
            );
          }
        }
      );

      // Store subscriptions for cleanup
      (global as any).iapSubscriptions = {
        purchaseUpdate: purchaseUpdateSubscription,
        purchaseError: purchaseErrorSubscription,
      };

      // Check for any pending purchases
      await checkPendingPurchases();
    } catch (error) {
      console.error('Failed to initialize IAP:', error);
    } finally {
      setLoading(false);
    }
  };

  const cleanupIAP = async () => {
    console.log('Cleaning up IAP...');
    try {
      // Remove listeners
      if ((global as any).iapSubscriptions) {
        (global as any).iapSubscriptions.purchaseUpdate?.remove();
        (global as any).iapSubscriptions.purchaseError?.remove();
      }

      // End connection
      await RNIap.endConnection();
      console.log('IAP connection ended');
    } catch (error) {
      console.error('Failed to cleanup IAP:', error);
    }
  };

  const loadPurchaseStatus = async () => {
    try {
      console.log('Loading purchase status from AsyncStorage...');
      const status = await AsyncStorage.getItem('fullVersion');
      console.log('Purchase status loaded:', status);
      
      if (status === 'true') {
        setIsFullVersion(true);
        console.log('Full version verified - unlocking app');
      } else {
        setIsFullVersion(false);
        console.log('No purchase found - app in demo mode');
      }
    } catch (error) {
      console.error('Failed to load purchase status:', error);
      setIsFullVersion(false);
    }
  };

  const checkPendingPurchases = async () => {
    try {
      console.log('Checking for pending purchases...');
      
      // Get available purchases (non-consumed purchases on Android, all purchases on iOS)
      const availablePurchases = await RNIap.getAvailablePurchases();
      console.log('Available purchases:', availablePurchases);

      if (availablePurchases && availablePurchases.length > 0) {
        // Check if user has purchased the full version
        const fullVersionPurchase = availablePurchases.find(
          (purchase) => PRODUCT_IDS.includes(purchase.productId)
        );

        if (fullVersionPurchase) {
          console.log('Found existing purchase, unlocking full version');
          await AsyncStorage.setItem('fullVersion', 'true');
          setIsFullVersion(true);
        }
      }
    } catch (error) {
      console.error('Failed to check pending purchases:', error);
    }
  };

  const purchaseFullVersion = async () => {
    console.log('User tapped Buy me a drink button');
    
    if (products.length === 0) {
      Alert.alert(
        'Products Not Available',
        'Unable to load products. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      console.log('Initiating purchase for product:', PRODUCT_IDS[0]);
      
      // Request purchase
      await RNIap.requestPurchase({
        sku: PRODUCT_IDS[0],
        ...(Platform.OS === 'android' && {
          obfuscatedAccountIdAndroid: undefined,
          obfuscatedProfileIdAndroid: undefined,
        }),
      });
      
      console.log('Purchase request sent');
      // The purchase will be handled by the purchaseUpdatedListener
    } catch (error: any) {
      console.error('Purchase failed:', error);
      
      // Don't show alert for user cancellation
      if (error.code !== 'E_USER_CANCELLED') {
        Alert.alert(
          'Purchase Failed',
          error.message || 'Something went wrong. Please try again.',
          [{ text: 'OK' }]
        );
      }
      throw error;
    }
  };

  const restorePurchases = async () => {
    console.log('User tapped Restore Purchases button');
    
    try {
      console.log('Restoring purchases...');
      
      // Get available purchases from the store
      const availablePurchases = await RNIap.getAvailablePurchases();
      console.log('Available purchases for restore:', availablePurchases);

      if (availablePurchases && availablePurchases.length > 0) {
        // Check if user has purchased the full version
        const fullVersionPurchase = availablePurchases.find(
          (purchase) => PRODUCT_IDS.includes(purchase.productId)
        );

        if (fullVersionPurchase) {
          console.log('Purchase found and restored successfully');
          await AsyncStorage.setItem('fullVersion', 'true');
          setIsFullVersion(true);
          return; // Success - will show success alert in settings screen
        }
      }

      // No purchase found
      console.log('No previous purchase found to restore');
      // Keep isFullVersion as false - will show "no purchases found" alert in settings screen
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
