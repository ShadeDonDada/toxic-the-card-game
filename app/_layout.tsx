
import "react-native-reanimated";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Alert } from "react-native";
import { useNetworkState } from "expo-network";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SuperwallProvider, SuperwallLoading, SuperwallLoaded } from "expo-superwall";
import { PurchaseProvider } from "@/contexts/PurchaseContext";
import { ActivityIndicator, View } from "react-native";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "splash",
};

// TODO: Replace with your actual Superwall API keys from the Superwall dashboard
const SUPERWALL_API_KEYS = {
  ios: "pk_d1efcfe8a9a3ddb6e9e3daf4c2b8c3e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
  android: "pk_d1efcfe8a9a3ddb6e9e3daf4c2b8c3e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
};

export default function RootLayout() {
  const networkState = useNetworkState();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      console.log('Fonts loaded');
    }
  }, [loaded]);

  React.useEffect(() => {
    if (
      !networkState.isConnected &&
      networkState.isInternetReachable === false
    ) {
      Alert.alert(
        "🔌 You are offline",
        "You can keep using the app! Your changes will be saved locally and synced when you are back online."
      );
    }
  }, [networkState.isConnected, networkState.isInternetReachable]);

  if (!loaded) {
    return null;
  }

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "rgb(148, 0, 211)",
      background: "rgb(240, 240, 240)",
      card: "rgb(255, 255, 255)",
      text: "rgb(51, 51, 51)",
      border: "rgb(216, 191, 216)",
      notification: "rgb(255, 105, 180)",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "rgb(148, 0, 211)",
      background: "rgb(30, 30, 30)",
      card: "rgb(45, 45, 45)",
      text: "rgb(227, 227, 227)",
      border: "rgb(216, 191, 216)",
      notification: "rgb(255, 105, 180)",
    },
  };
  
  return (
    <>
      <StatusBar hidden />
      <SuperwallProvider apiKeys={SUPERWALL_API_KEYS}>
        <SuperwallLoading>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e1e1e' }}>
            <ActivityIndicator size="large" color="#9400d3" />
          </View>
        </SuperwallLoading>
        <SuperwallLoaded>
          <PurchaseProvider>
            <ThemeProvider>
              <NavigationThemeProvider value={CustomDarkTheme}>
                <WidgetProvider>
                  <GestureHandlerRootView>
                  <Stack>
                    <Stack.Screen name="splash" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen
                      name="game-setup"
                      options={{
                        headerShown: false,
                        presentation: "card",
                      }}
                    />
                    <Stack.Screen
                      name="rules"
                      options={{
                        headerShown: false,
                        presentation: "card",
                      }}
                    />
                    <Stack.Screen
                      name="thank-you"
                      options={{
                        headerShown: false,
                        presentation: "card",
                      }}
                    />
                    <Stack.Screen
                      name="settings"
                      options={{
                        headerShown: false,
                        presentation: "card",
                      }}
                    />
                    <Stack.Screen
                      name="game"
                      options={{
                        headerShown: false,
                        presentation: "card",
                      }}
                    />
                    <Stack.Screen
                      name="player-names"
                      options={{
                        headerShown: false,
                        presentation: "card",
                      }}
                    />
                    <Stack.Screen
                      name="modal"
                      options={{
                        presentation: "modal",
                        title: "Standard Modal",
                      }}
                    />
                    <Stack.Screen
                      name="formsheet"
                      options={{
                        presentation: "formSheet",
                        title: "Form Sheet Modal",
                        sheetGrabberVisible: true,
                        sheetAllowedDetents: [0.5, 0.8, 1.0],
                        sheetCornerRadius: 20,
                      }}
                    />
                    <Stack.Screen
                      name="transparent-modal"
                      options={{
                        presentation: "transparentModal",
                        headerShown: false,
                      }}
                    />
                  </Stack>
                  <SystemBars style={"light"} hidden />
                  </GestureHandlerRootView>
                </WidgetProvider>
              </NavigationThemeProvider>
            </ThemeProvider>
          </PurchaseProvider>
        </SuperwallLoaded>
      </SuperwallProvider>
    </>
  );
}
