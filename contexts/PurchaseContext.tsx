
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';

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

  useEffect(() => {
    console.log('PurchaseProvider: Checking premium status');
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    try {
      console.log('PurchaseProvider: Checking stored premium status');
      const storedStatus = await AsyncStorage.getItem(PREMIUM_KEY);
      const premium = storedStatus === 'true';
      console.log('PurchaseProvider: Stored premium status:', premium);
      setIsPremium(premium);
    } catch (error) {
      console.error('PurchaseProvider: Error checking premium status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setPremiumStatus = async (status: boolean) => {
    console.log('PurchaseProvider: Setting premium status to:', status);
    setIsPremium(status);
    await AsyncStorage.setItem(PREMIUM_KEY, status.toString());
  };

  const purchasePremium = async () => {
    try {
      console.log('PurchaseProvider: User initiated purchase');
      
      // For now, simulate a successful purchase
      // In production, this would integrate with react-native-iap
      Alert.alert(
        'Purchase',
        'In-app purchases are not yet configured. Would you like to unlock premium for testing?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Unlock',
            onPress: async () => {
              await setPremiumStatus(true);
              Alert.alert(
                'Purchase Successful!',
                'Thank you for your support! All ads have been removed and unlimited content is now available.',
                [{ text: 'OK' }]
              );
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('PurchaseProvider: Error purchasing premium:', error);
      Alert.alert('Purchase Error', 'Unable to complete purchase. Please try again.');
    }
  };

  const restorePurchases = async () => {
    try {
      console.log('PurchaseProvider: Restoring purchases');
      
      // For now, check AsyncStorage
      const storedStatus = await AsyncStorage.getItem(PREMIUM_KEY);
      const hasPremium = storedStatus === 'true';

      if (hasPremium) {
        console.log('PurchaseProvider: Premium purchase found, restoring');
        await setPremiumStatus(true);
        Alert.alert(
          'Restore Successful',
          'Your premium purchase has been restored!',
          [{ text: 'OK' }]
        );
      } else {
        console.log('PurchaseProvider: No premium purchase found');
        Alert.alert(
          'No Purchases Found',
          'No previous purchases were found to restore.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('PurchaseProvider: Error restoring purchases:', error);
      Alert.alert('Restore Error', 'Unable to restore purchases. Please try again.');
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
