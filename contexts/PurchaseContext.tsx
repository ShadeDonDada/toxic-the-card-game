/*
import React, { createContext, useContext, ReactNode } from 'react';
import { useUser } from 'expo-superwall';

interface PurchaseContextType {
  isFullVersion: boolean;
  loading: boolean;
  subscriptionStatus: string;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export function PurchaseProvider({ children }: { children: ReactNode }) {
  const { subscriptionStatus } = useUser();
  
  // User has full version if subscription status is ACTIVE
  const isFullVersion = subscriptionStatus?.status === 'ACTIVE';
  const loading = false;

  return (
    <PurchaseContext.Provider value={{ isFullVersion, loading, subscriptionStatus: subscriptionStatus?.status || 'INACTIVE' }}>
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
*/