
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import * as IAP from 'react-native-iap';

interface PurchaseContextType {
  isPremium: boolean;
  isLoading: boolean;
  purchaseFullVersion: () => Promise<void>;
  restorePurchase: () => Promise<void>;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

const PREMIUM_KEY = '@toxic_premium_status';

// Product IDs - IMPORTANT: These must match your App Store Connect / Google Play Console product IDs
const PRODUCT_ID = Platform.select({
  ios: 'com.toxicgame.premium', // TODO: Replace with your actual iOS product ID
  android: 'com.toxicgame.premium', // TODO: Replace with your actual Android product ID
}) || 'com.toxicgame.premium';

export const PurchaseProvider = ({ children }: { children: ReactNode }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeIAP();
    loadPremiumStatus();

    return () => {
      // Clean up IAP connection
      IAP.endConnection();
    };
  }, []);

  const initializeIAP = async () => {
    try {
      console.log('Initializing IAP connection...');
      await IAP.initConnection();
      console.log('IAP connection initialized');

      // Set up purchase update listener
      const purchaseUpdateSubscription = IAP.purchaseUpdatedListener(
        async (purchase: IAP.Purchase) => {
          console.log('Purchase updated:', purchase);
          const receipt = purchase.transactionReceipt;
          
          if (receipt) {
            try {
              // Finish the transaction
              await IAP.finishTransaction({ purchase, isConsumable: false });
              
              // Save premium status
              await savePremiumStatus(true);
              
              Alert.alert(
                '🎉 Thank You!',
                'You now have full access to all scenarios and cards. Enjoy the game!',
                [{ text: 'OK' }]
              );

              // Optionally request a review after successful purchase
              if (await StoreReview.isAvailableAsync()) {
                setTimeout(() => {
                  StoreReview.requestReview();
                }, 2000);
              }
            } catch (error) {
              console.error('Error finishing transaction:', error);
            }
          }
        }
      );

      const purchaseErrorSubscription = IAP.purchaseErrorListener(
        (error: IAP.PurchaseError) => {
          console.error('Purchase error:', error);
          if (error.code !== 'E_USER_CANCELLED') {
            Alert.alert(
              'Purchase Failed',
              'Unable to complete purchase. Please try again.',
              [{ text: 'OK' }]
            );
          }
        }
      );

      return () => {
        purchaseUpdateSubscription.remove();
        purchaseErrorSubscription.remove();
      };
    } catch (error) {
      console.error('Error initializing IAP:', error);
    }
  };

  const loadPremiumStatus = async () => {
    try {
      const status = await AsyncStorage.getItem(PREMIUM_KEY);
      setIsPremium(status === 'true');
      
      // Also check for existing purchases on app start
      if (status !== 'true') {
        await checkExistingPurchases();
      }
    } catch (error) {
      console.error('Error loading premium status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkExistingPurchases = async () => {
    try {
      console.log('Checking for existing purchases...');
      const purchases = await IAP.getAvailablePurchases();
      console.log('Available purchases:', purchases);
      
      const hasPurchased = purchases.some(
        (purchase) => purchase.productId === PRODUCT_ID
      );
      
      if (hasPurchased) {
        console.log('Found existing purchase, restoring premium status');
        await savePremiumStatus(true);
      }
    } catch (error) {
      console.error('Error checking existing purchases:', error);
    }
  };

  const savePremiumStatus = async (status: boolean) => {
    try {
      await AsyncStorage.setItem(PREMIUM_KEY, status.toString());
      setIsPremium(status);
    } catch (error) {
      console.error('Error saving premium status:', error);
    }
  };

  const purchaseFullVersion = async () => {
    try {
      setIsLoading(true);
      
      console.log('Fetching products...');
      const products = await IAP.getProducts({ skus: [PRODUCT_ID] });
      console.log('Products:', products);
      
      if (products.length === 0) {
        throw new Error('Product not found. Please make sure the product is configured in your app store.');
      }
      
      console.log('Requesting purchase...');
      await IAP.requestPurchase({ sku: PRODUCT_ID });
      
      // The purchase update listener will handle the rest
    } catch (error: any) {
      console.error('Error purchasing:', error);
      
      if (error.code !== 'E_USER_CANCELLED') {
        Alert.alert(
          'Purchase Failed',
          error.message || 'Unable to complete purchase. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const restorePurchase = async () => {
    try {
      setIsLoading(true);
      
      console.log('Restoring purchases...');
      const purchases = await IAP.getAvailablePurchases();
      console.log('Available purchases:', purchases);
      
      const hasPurchased = purchases.some(
        (purchase) => purchase.productId === PRODUCT_ID
      );
      
      if (hasPurchased) {
        await savePremiumStatus(true);
        Alert.alert(
          '✅ Restored',
          'Your premium access has been restored!',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'No Purchase Found',
          'No previous purchase found to restore.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error restoring purchase:', error);
      Alert.alert(
        'Restore Failed',
        'Unable to restore purchase. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PurchaseContext.Provider
      value={{
        isPremium,
        isLoading,
        purchaseFullVersion,
        restorePurchase,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = () => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchase must be used within PurchaseProvider');
  }
  return context;
};
