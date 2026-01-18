
import { Button } from '@/components/Button';
import { useTheme } from '@/contexts/ThemeContext';
import { usePurchase } from '@/contexts/PurchaseContext';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { getColors } from '@/styles/commonStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 280,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 20,
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 8,
    borderRadius: 8,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 20,
  },
  premiumText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { isPremium, isLoading } = usePurchase();
  const colors = getColors(theme);

  const [isReady, setIsReady] = useState(false);

  // Animation values
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    console.log('HomeScreen: Component mounted');
    setIsReady(true);

    // Subtle rotation animation
    rotation.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(2, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Subtle scale animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [rotation, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  if (!isReady || isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => {
          console.log('HomeScreen: User tapped settings button');
          router.push('/settings');
        }}
      >
        <IconSymbol
          ios_icon_name="gear"
          android_material_icon_name="settings"
          size={28}
          color={colors.text}
        />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Animated.View style={animatedStyle}>
            <Image
              source={require('@/assets/images/62b14892-bec0-4f79-a1b2-390183b945dd.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
          <Text style={[styles.title, { color: colors.text }]}>
            Toxic
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            The Card Game
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Play Game"
            onPress={() => {
              console.log('HomeScreen: User tapped Play Game button');
              router.push('/game-setup');
            }}
            variant="primary"
          />
          <Button
            title="Rules"
            onPress={() => {
              console.log('HomeScreen: User tapped Rules button');
              router.push('/rules');
            }}
            variant="secondary"
          />
        </View>

        {isPremium && (
          <View style={[styles.premiumBadge, { backgroundColor: colors.primary }]}>
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={20}
              color="#FFFFFF"
            />
            <Text style={[styles.premiumText, { color: '#FFFFFF' }]}>
              Premium Unlocked
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
