
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
  // Start with true to avoid showing demo mode before checking purchase status
  const [isFullVersion, setIsFullVersion] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPurchaseStatus();
  }, []);

  const loadPurchaseStatus = async () => {
    try {
      console.log('Loading purchase status from AsyncStorage...');
      const status = await AsyncStorage.getItem('fullVersion');
      console.log('Purchase status loaded:', status);
      
      // Only set to false if explicitly set to 'false' in storage
      // This ensures the app is not in demo mode by default
      if (status === 'false') {
        setIsFullVersion(false);
      } else {
        // Default to full version if no status is stored or if it's 'true'
        setIsFullVersion(true);
      }
    } catch (error) {
      console.error('Failed to load purchase status:', error);
      // On error, default to full version to avoid blocking users
      setIsFullVersion(true);
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
