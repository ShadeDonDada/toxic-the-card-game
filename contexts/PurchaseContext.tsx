
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as IAP from 'react-native-iap';
import { Platform, Alert } from 'react-native';

const PRODUCT_ID = Platform.select({
  ios: 'com.toxicgame.premium',
  android: 'com.toxicgame.premium',
}) || 'com.toxicgame.premium';

const PREMIUM_KEY = '@toxic_premium_status';

interface PurchaseContextType {
  isPremium: boolean;
  isLoading: boolean;
  purchasePremium: () => Promise<void>;
  restorePurchases: () => Promise<void>;
}

const PurchaseContext = createContext<PurchaseContextType>({
  isPremium: false,
  isLoading: true,
  purchasePremium: async () => {},
  restorePurchases: async () => {},
});

export const usePurchase = () => useContext(PurchaseContext);

interface PurchaseProviderProps {
  children: ReactNode;
}

export const PurchaseProvider: React.FC<PurchaseProviderProps> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const setPremiumStatus = useCallback(async (status: boolean) => {
    console.log('PurchaseProvider: Setting premium status to:', status);
    setIsPremium(status);
    await AsyncStorage.setItem(PREMIUM_KEY, status.toString());
  }, []);

  const initializeIAP = useCallback(async () => {
    try {
      console.log('PurchaseProvider: Connecting to IAP store');
      await IAP.initConnection();
      console.log('PurchaseProvider: IAP connection established');
      
      // Set up purchase update listener
      const purchaseUpdateSubscription = IAP.purchaseUpdatedListener(
        async (purchase) => {
          console.log('PurchaseProvider: Purchase update received', purchase);
          const receipt = purchase.transactionReceipt;
          if (receipt) {
            try {
              // Finish the transaction
              await IAP.finishTransaction({ purchase, isConsumable: false });
              console.log('PurchaseProvider: Transaction finished, setting premium status');
              await setPremiumStatus(true);
              Alert.alert(
                'Purchase Successful!',
                'Thank you for your support! All ads have been removed and unlimited content is now available.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              console.error('PurchaseProvider: Error finishing transaction:', error);
            }
          }
        }
      );

      const purchaseErrorSubscription = IAP.purchaseErrorListener(
        (error) => {
          console.error('PurchaseProvider: Purchase error:', error);
          if (error.code !== 'E_USER_CANCELLED') {
            Alert.alert('Purchase Failed', 'There was an error processing your purchase. Please try again.');
          }
        }
      );

      return () => {
        purchaseUpdateSubscription.remove();
        purchaseErrorSubscription.remove();
      };
    } catch (error) {
      console.error('PurchaseProvider: Error initializing IAP:', error);
    }
  }, [setPremiumStatus]);

  const checkPremiumStatus = useCallback(async () => {
    try {
      console.log('PurchaseProvider: Checking stored premium status');
      const storedStatus = await AsyncStorage.getItem(PREMIUM_KEY);
      const premium = storedStatus === 'true';
      console.log('PurchaseProvider: Stored premium status:', premium);
      setIsPremium(premium);
      
      // Also check for active purchases to restore automatically
      if (!premium) {
        console.log('PurchaseProvider: Not premium, checking for active purchases');
        await restorePurchases(true);
      }
    } catch (error) {
      console.error('PurchaseProvider: Error checking premium status:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const restorePurchases = useCallback(async (silent: boolean = false) => {
    try {
      console.log('PurchaseProvider: Restoring purchases');
      const purchases = await IAP.getAvailablePurchases();
      console.log('PurchaseProvider: Available purchases:', purchases);
      
      const hasPremium = purchases.some(
        (purchase) => purchase.productId === PRODUCT_ID
      );

      if (hasPremium) {
        console.log('PurchaseProvider: Premium purchase found, restoring');
        await setPremiumStatus(true);
        if (!silent) {
          Alert.alert(
            'Restore Successful',
            'Your premium purchase has been restored!',
            [{ text: 'OK' }]
          );
        }
      } else {
        console.log('PurchaseProvider: No premium purchase found');
        if (!silent) {
          Alert.alert(
            'No Purchases Found',
            'No previous purchases were found to restore.',
            [{ text: 'OK' }]
          );
        }
      }
    } catch (error) {
      console.error('PurchaseProvider: Error restoring purchases:', error);
      if (!silent) {
        Alert.alert('Restore Error', 'Unable to restore purchases. Please try again.');
      }
    }
  }, [setPremiumStatus]);

  useEffect(() => {
    console.log('PurchaseProvider: Initializing IAP and checking premium status');
    initializeIAP();
    checkPremiumStatus();

    return () => {
      console.log('PurchaseProvider: Cleaning up IAP connection');
      IAP.endConnection();
    };
  }, [initializeIAP, checkPremiumStatus]);

  const purchasePremium = async () => {
    try {
      console.log('PurchaseProvider: User initiated purchase for product:', PRODUCT_ID);
      
      // Get available products
      const products = await IAP.getProducts({ skus: [PRODUCT_ID] });
      console.log('PurchaseProvider: Available products:', products);
      
      if (products.length === 0) {
        Alert.alert('Error', 'Product not available. Please try again later.');
        return;
      }

      // Request purchase
      console.log('PurchaseProvider: Requesting purchase');
      await IAP.requestPurchase({ sku: PRODUCT_ID });
    } catch (error: any) {
      console.error('PurchaseProvider: Error purchasing premium:', error);
      if (error.code !== 'E_USER_CANCELLED') {
        Alert.alert('Purchase Error', 'Unable to complete purchase. Please try again.');
      }
    }
  };

  return (
    <PurchaseContext.Provider
      value={{
        isPremium,
        isLoading,
        purchasePremium,
        restorePurchases,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
};
