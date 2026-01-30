
import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');

export default function SplashScreenComponent() {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? '#000000' : '#0a0a0a';
  const textColor = colorScheme === 'dark' ? '#FFFFFF' : '#f5f5f5';
  const isMounted = useRef(true);

  useEffect(() => {
    console.log('Splash screen mounted, color scheme:', colorScheme);
    
    // Hide the splash screen after a delay
    const timer = setTimeout(() => {
      if (isMounted.current) {
        SplashScreen.hideAsync();
        router.replace('/(tabs)');
      }
    }, 1500);

    return () => {
      isMounted.current = false;
      clearTimeout(timer);
    };
  }, [colorScheme]);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <Image
          source={require('../assets/images/62b14892-bec0-4f79-a1b2-390183b945dd.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.footer}>
        <Text style={[styles.copyright, { color: textColor }]}>© 2026 Steven A. Pennant. All rights reserved.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: width * 1.9,
    height: height * 1.8,
  },
  footer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  copyright: {
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
});
