
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    loadPurchaseStatus();
  }, []);

  const loadPurchaseStatus = async () => {
    try {
      console.log('Loading purchase status from AsyncStorage...');
      const status = await AsyncStorage.getItem('fullVersion');
      console.log('Purchase status loaded:', status);
      
      // CRITICAL: Only set to true if explicitly set to 'true' in storage
      // This ensures newly installed apps are in demo mode by default
      // and require the user to press "Buy me a drink" or "Restore Purchases"
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

  const purchaseFullVersion = async () => {
    // For now, just unlock the full version locally
    // In a real app, this would integrate with app store purchases
    try {
      console.log('Purchasing full version...');
      await AsyncStorage.setItem('fullVersion', 'true');
      setIsFullVersion(true);
      console.log('Full version purchased and verified successfully');
    } catch (error) {
      console.error('Failed to save purchase status:', error);
      throw error;
    }
  };

  const restorePurchases = async () => {
    // In a real app, this would check with the app store
    // For now, we check AsyncStorage to see if purchase was made
    console.log('Restoring purchases...');
    try {
      const status = await AsyncStorage.getItem('fullVersion');
      if (status === 'true') {
        setIsFullVersion(true);
        console.log('Purchase restored successfully');
      } else {
        console.log('No previous purchase found to restore');
        // Keep isFullVersion as false if no purchase found
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
