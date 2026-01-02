
import { getColors } from '@/styles/commonStyles';
import { useTheme } from '@/contexts/ThemeContext';
import { IconSymbol } from '@/components/IconSymbol';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Button } from '@/components/Button';
import { usePurchase } from '@/contexts/PurchaseContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const { isFullVersion } = usePurchase();
  const [imageLoaded, setImageLoaded] = useState(false);

  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(5, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            {!imageLoaded && (
              <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
            )}
            <Animated.View style={[animatedStyle, { opacity: imageLoaded ? 1 : 0 }]}>
              <Image
                source={require('@/assets/images/ade019df-679f-48c9-b84b-d610ac5b8fe0.png')}
                style={styles.logo}
                resizeMode="contain"
                onLoad={() => setImageLoaded(true)}
              />
            </Animated.View>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>Toxic</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            The Card Game
          </Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            "Extracting the poison out of you"
          </Text>

          {/* Demo Mode Badge */}
          {!isFullVersion && (
            <View style={styles.demoBadgeContainer}>
              <View style={styles.demoBadge}>
                <IconSymbol ios_icon_name="exclamationmark.triangle.fill" android_material_icon_name="warning" size={16} color="#fff" />
                <Text style={styles.demoBadgeText}>DEMO MODE - 3 Rounds Only</Text>
              </View>
              <Text style={[styles.demoSubtext, { color: colors.textSecondary }]}>
                Upgrade in Settings to unlock unlimited gameplay
              </Text>
            </View>
          )}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              title="Start Game"
              onPress={() => router.push('/game-setup')}
            />
            <Button
              title="Rules"
              onPress={() => router.push('/rules')}
            />
            <Button
              title="Settings"
              onPress={() => router.push('/settings')}
            />
          </View>

          {/* Copyright */}
          <Text style={[styles.copyright, { color: colors.textSecondary }]}>
            © 2024 Toxic - The Card Game
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    width: width * 0.6,
    height: width * 0.6,
    maxWidth: 300,
    maxHeight: 300,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 32,
    textAlign: 'center',
  },
  demoBadgeContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FF9800',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  demoBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  demoSubtext: {
    fontSize: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 16,
  },
  copyright: {
    fontSize: 12,
    marginTop: 32,
    textAlign: 'center',
  },
});
