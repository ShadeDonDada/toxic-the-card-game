
import React, { createContext, useContext, ReactNode } from 'react';
import { 
  SuperwallProvider as SuperwallSDKProvider,
  useUser,
  usePlacement,
  SuperwallLoading,
  SuperwallLoaded,
  SuperwallError
} from 'expo-superwall';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';

// TODO: Replace with your actual Superwall API keys from dashboard
const SUPERWALL_API_KEYS = {
  ios: 'YOUR_IOS_API_KEY', // Get from Superwall dashboard
  android: 'YOUR_ANDROID_API_KEY', // Get from Superwall dashboard
};

interface PurchaseContextType {
  isPremium: boolean;
  loading: boolean;
  purchaseFullVersion: () => Promise<void>;
  restorePurchases: () => Promise<void>;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

// Inner component that uses Superwall hooks
function PurchaseProviderInner({ children }: { children: ReactNode }) {
  const { subscriptionStatus, identify } = useUser();
  const { registerPlacement } = usePlacement({
    onError: (err) => console.error('Paywall Error:', err),
    onPresent: (info) => console.log('Paywall Presented:', info),
    onDismiss: (info, result) => console.log('Paywall Dismissed:', result),
  });

  // Check if user has premium access
  const isPremium = subscriptionStatus?.status === 'ACTIVE';
  const loading = false; // Superwall handles loading internally

  const purchaseFullVersion = async () => {
    try {
      // Register the paywall placement for full version unlock
      await registerPlacement({
        placement: 'full_version_unlock', // Configure this in Superwall dashboard
        feature() {
          // This callback is called when user successfully purchases or already has access
          console.log('Full version unlocked!');
        },
      });
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  };

  const restorePurchases = async () => {
    try {
      // Superwall automatically handles restore via subscription status
      // Just need to refresh the user state
      console.log('Restoring purchases...');
      // The subscription status will automatically update if user has active subscription
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  };

  return (
    <PurchaseContext.Provider
      value={{
        isPremium,
        loading,
        purchaseFullVersion,
        restorePurchases,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}

// Main provider that wraps with Superwall
export function PurchaseProvider({ children }: { children: ReactNode }) {
  return (
    <SuperwallSDKProvider 
      apiKeys={SUPERWALL_API_KEYS}
      onConfigurationError={(error) => {
        console.error('Superwall configuration error:', error);
      }}
    >
      <SuperwallLoading>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00ff00" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SuperwallLoading>

      <SuperwallError>
        {(error) => (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Unable to Initialize</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.errorSubtext}>
              The app will continue in demo mode. Please check your internet connection.
            </Text>
          </View>
        )}
      </SuperwallError>

      <SuperwallLoaded>
        <PurchaseProviderInner>
          {children}
        </PurchaseProviderInner>
      </SuperwallLoaded>
    </SuperwallSDKProvider>
  );
}

export function usePurchase() {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchase must be used within PurchaseProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ffffff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 32,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff0000',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
  },
});
