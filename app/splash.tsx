
import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');

export default function SplashScreenComponent() {
  useEffect(() => {
    // Hide the splash screen after a delay
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
      router.replace('/(tabs)');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/images/62b14892-bec0-4f79-a1b2-390183b945dd.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View style={styles.footer}>
        <Text style={styles.copyright}>© 2025 Steven A. Pennant. All rights reserved.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: width * 0.9,
    height: height * 0.8,
  },
  footer: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  copyright: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
});
