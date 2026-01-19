
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Superwall from 'expo-superwall';
import { Platform } from 'react-native';

interface PurchaseContextType {
  isFullVersion: boolean;
  loading: boolean;
  subscriptionStatus: string;
  purchaseFullVersion: () => Promise<void>;
  restorePurchases: () => Promise<void>;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export function PurchaseProvider({ children }: { children: ReactNode }) {
  // Start with false (demo mode) by default - requires explicit purchase or restore
  const [isFullVersion, setIsFullVersion] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeSuperwall();
  }, []);

  const initializeSuperwall = async () => {
    try {
      console.log('Initializing Superwall...');
      
      // Configure Superwall with your API key
      // Get your API key from https://superwall.com/dashboard
      await Superwall.configure({
        apiKey: 'YOUR_SUPERWALL_API_KEY', // TODO: Replace with your actual Superwall API key
      });

      console.log('Superwall configured successfully');

      // Set up subscription status listener
      Superwall.addSubscriptionStatusListener((status) => {
        console.log('Subscription status changed:', status);
        const isPremium = status === 'ACTIVE';
        setIsFullVersion(isPremium);
        
        // Persist the status
        AsyncStorage.setItem('fullVersion', isPremium ? 'true' : 'false').catch((error) => {
          console.error('Failed to save purchase status:', error);
        });
      });

      // Load initial purchase status
      await loadPurchaseStatus();
    } catch (error) {
      console.error('Failed to initialize Superwall:', error);
      // Fall back to loading from AsyncStorage
      await loadPurchaseStatus();
    }
  };

  const loadPurchaseStatus = async () => {
    try {
      console.log('Loading purchase status...');
      
      // First check Superwall subscription status
      try {
        const status = await Superwall.getSubscriptionStatus();
        console.log('Superwall subscription status:', status);
        
        if (status === 'ACTIVE') {
          setIsFullVersion(true);
          await AsyncStorage.setItem('fullVersion', 'true');
          console.log('Full version verified via Superwall - unlocking app');
          setLoading(false);
          return;
        }
      } catch (superwallError) {
        console.log('Could not get Superwall status, checking AsyncStorage:', superwallError);
      }

      // Fall back to AsyncStorage
      const status = await AsyncStorage.getItem('fullVersion');
      console.log('Purchase status from AsyncStorage:', status);
      
      // CRITICAL: Only set to true if explicitly set to 'true' in storage
      // This ensures newly installed apps are in demo mode by default
      // and require the user to press "Buy me a drink" or "Restore Purchases"
      if (status === 'true') {
        setIsFullVersion(true);
        console.log('Full version verified from cache - unlocking app');
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

  const purchaseFullVersion = async () => {
    try {
      console.log('User tapped Buy me a drink - presenting Superwall paywall...');
      
      // Present the Superwall paywall
      // The paywall will handle the entire purchase flow including:
      // - Displaying product options
      // - Processing the payment through App Store/Play Store
      // - Validating the receipt
      // - Updating subscription status
      const result = await Superwall.presentPaywall({
        event: 'purchase_full_version',
        params: {
          source: 'settings_screen',
        },
      });

      console.log('Paywall presentation result:', result);

      // The subscription status listener will automatically update isFullVersion
      // when the purchase completes successfully
      
      if (result.state === 'purchased') {
        console.log('Purchase completed successfully via Superwall');
        setIsFullVersion(true);
        await AsyncStorage.setItem('fullVersion', 'true');
      } else if (result.state === 'restored') {
        console.log('Purchase restored successfully via Superwall');
        setIsFullVersion(true);
        await AsyncStorage.setItem('fullVersion', 'true');
      } else {
        console.log('Paywall dismissed without purchase:', result.state);
      }
    } catch (error) {
      console.error('Failed to present paywall:', error);
      throw error;
    }
  };

  const restorePurchases = async () => {
    console.log('User tapped Restore Purchases - restoring via Superwall...');
    try {
      // Superwall handles restore purchases through the native store
      const result = await Superwall.restorePurchases();
      console.log('Restore purchases result:', result);

      // Check the updated subscription status
      const status = await Superwall.getSubscriptionStatus();
      console.log('Subscription status after restore:', status);

      if (status === 'ACTIVE') {
        setIsFullVersion(true);
        await AsyncStorage.setItem('fullVersion', 'true');
        console.log('Purchase restored successfully - full version unlocked');
      } else {
        console.log('No previous purchase found to restore');
        setIsFullVersion(false);
        await AsyncStorage.setItem('fullVersion', 'false');
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
