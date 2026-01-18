
import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { usePurchase } from '@/contexts/PurchaseContext';
import { getColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import React, { useState, useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { Button } from '@/components/Button';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 40,
    gap: 16,
  },
  settingsButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 8,
  },
  premiumBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 10,
  },
  premiumBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  demoNotice: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  demoNoticeText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#FF9800',
    fontWeight: '600',
  },
});

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { isPremium, isLoading } = usePurchase();
  const colors = getColors(theme);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Animation values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    console.log('HomeScreen: Component mounted, premium status:', isPremium);
    
    // Pulse animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Subtle rotation
    rotation.value = withRepeat(
      withSequence(
        withTiming(2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-2, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [isPremium, scale, rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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

        <View style={styles.logoContainer}>
          {!imageLoaded && (
            <ActivityIndicator size="large" color={colors.primary} />
          )}
          <Animated.View style={animatedStyle}>
            <Image
              source={require('@/assets/images/cf8fe377-20e1-49ba-a973-c53e0228ba43.png')}
              style={styles.logo}
              resizeMode="contain"
              onLoad={() => setImageLoaded(true)}
            />
          </Animated.View>
          <Text style={[styles.title, { color: colors.text }]}>
            Toxic - The Card Game
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Extracting the poison out of you
          </Text>
          {isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>PREMIUM</Text>
            </View>
          )}
        </View>

        {!isPremium && !isLoading && (
          <View style={styles.demoNotice}>
            <Text style={styles.demoNoticeText}>
              🎮 Demo Mode: 3 scenarios & 3 response cards
              {'\n'}
              Unlock full game in Settings
            </Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Start Game"
            onPress={() => {
              console.log('HomeScreen: User tapped Start Game');
              router.push('/game-setup');
            }}
            variant="primary"
          />
          <Button
            title="Rules"
            onPress={() => {
              console.log('HomeScreen: User tapped Rules');
              router.push('/rules');
            }}
            variant="secondary"
          />
          <Button
            title="Settings"
            onPress={() => {
              console.log('HomeScreen: User tapped Settings');
              router.push('/settings');
            }}
            variant="outline"
          />
        </View>
      </ScrollView>
    </View>
  );
}
