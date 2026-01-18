
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
    console.log('RootLayout: Initializing ad manager');
    // Initialize ad manager
    adManager.initialize().then(() => {
      console.log('RootLayout: Ad manager initialized');
      // Hide splash screen after initialization
      SplashScreen.hideAsync();
    });
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
