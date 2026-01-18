
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { PurchaseProvider } from '@/contexts/PurchaseContext';
import { useEffect } from 'react';
import { adManager } from '@/utils/adManager';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we initialize
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    console.log('RootLayout: Initializing app');
    
    // Initialize ad manager after a short delay to ensure native modules are ready
    const initializeApp = async () => {
      try {
        // Wait for native modules to be ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('RootLayout: Initializing ad manager');
        await adManager.initialize();
        console.log('RootLayout: Ad manager initialized');
      } catch (error) {
        console.error('RootLayout: Error initializing app:', error);
      } finally {
        // Hide splash screen after initialization
        await SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, []);

  return (
    <ThemeProvider>
      <PurchaseProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="game" options={{ headerShown: false }} />
          <Stack.Screen name="game-setup" options={{ headerShown: false }} />
          <Stack.Screen name="player-names" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="rules" options={{ headerShown: false }} />
          <Stack.Screen name="thank-you" options={{ headerShown: false }} />
        </Stack>
      </PurchaseProvider>
    </ThemeProvider>
  );
}
