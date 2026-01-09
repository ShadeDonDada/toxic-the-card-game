
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
  const [isFullVersion, setIsFullVersion] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchaseStatus();
  }, []);

  const loadPurchaseStatus = async () => {
    try {
      const status = await AsyncStorage.getItem('fullVersion');
      setIsFullVersion(status === 'true');
    } catch (error) {
      console.error('Failed to load purchase status:', error);
    } finally {
      setLoading(false);
    }
  };

  const purchaseFullVersion = async () => {
    // For now, just unlock the full version locally
    // In a real app, this would integrate with app store purchases
    try {
      await AsyncStorage.setItem('fullVersion', 'true');
      setIsFullVersion(true);
    } catch (error) {
      console.error('Failed to save purchase status:', error);
    }
  };

  const restorePurchases = async () => {
    // In a real app, this would check with the app store
    await loadPurchaseStatus();
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
