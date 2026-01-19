
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
  // Start with false (demo mode) by default
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
      
      // Only set to true if explicitly set to 'true' in storage
      // This ensures the app is in demo mode by default
      if (status === 'true') {
        setIsFullVersion(true);
        console.log('Full version verified - unlocking app');
      } else {
        setIsFullVersion(false);
        console.log('No purchase found - app in demo mode');
      }
    } catch (error) {
      console.error('Failed to load purchase status:', error);
      // On error, default to demo mode
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
      console.log('Full version purchased successfully');
    } catch (error) {
      console.error('Failed to save purchase status:', error);
      throw error;
    }
  };

  const restorePurchases = async () => {
    // In a real app, this would check with the app store
    console.log('Restoring purchases...');
    await loadPurchaseStatus();
    console.log('Purchases restored');
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
