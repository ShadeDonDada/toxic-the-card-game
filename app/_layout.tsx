
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { PurchaseProvider } from '@/contexts/PurchaseContext';
import React from 'react';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <PurchaseProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="splash" />
          <Stack.Screen name="game-setup" />
          <Stack.Screen name="player-names" />
          <Stack.Screen name="game" />
          <Stack.Screen name="rules" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="thank-you" />
        </Stack>
      </PurchaseProvider>
    </ThemeProvider>
  );
}
