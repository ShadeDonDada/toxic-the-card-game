
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/styles/commonStyles';
import { Button } from '@/components/Button';
import { IconSymbol } from '@/components/IconSymbol';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

export default function HomeScreen() {
  const router = useRouter();
  const { effectiveColorScheme } = useTheme();
  const colors = getColors(effectiveColorScheme);
  const [imageLoaded, setImageLoaded] = useState(false);

  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.8);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    console.log('Home screen mounted - starting animations');
    
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [imageLoaded, scale, opacity, glowOpacity]);

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const animatedGlowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  const handleStartGame = () => {
    console.log('User tapped Start Game button - navigating to game setup');
    router.push('/game-setup');
  };

  const handleViewRules = () => {
    console.log('User tapped View Rules button - navigating to rules screen');
    router.push('/rules');
  };

  const handleSettings = () => {
    console.log('User tapped Settings button - navigating to settings screen');
    router.push('/settings');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          {!imageLoaded && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
          
          <Animated.View style={[styles.glowContainer, animatedGlowStyle]}>
            <View style={[styles.glow, { backgroundColor: colors.primary }]} />
          </Animated.View>

          <Animated.View style={animatedLogoStyle}>
            <Image
              source={require('@/assets/images/9fdb7b2d-17b1-4d90-ac0d-5696f20ad1cf.png')}
              style={styles.logo}
              resizeMode="contain"
              onLoad={() => {
                console.log('Toxic logo image loaded successfully');
                setImageLoaded(true);
              }}
              onError={(error) => {
                console.error('Toxic logo image failed to load:', error);
                setImageLoaded(true);
              }}
            />
          </Animated.View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Toxic</Text>
          <Text style={[styles.subtitle, { color: colors.primary }]}>The Card Game</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            Extracting the poison out of you
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Start Game"
            onPress={handleStartGame}
            variant="primary"
            style={styles.button}
          />
          
          <Button
            title="View Rules"
            onPress={handleViewRules}
            variant="secondary"
            style={styles.button}
          />

          <Button
            title="Settings"
            onPress={handleSettings}
            variant="secondary"
            style={styles.button}
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <IconSymbol
              ios_icon_name="person.3.fill"
              android_material_icon_name="group"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.infoText, { color: colors.text }]}>2-10 Players</Text>
          </View>

          <View style={styles.infoCard}>
            <IconSymbol
              ios_icon_name="18.circle.fill"
              android_material_icon_name="warning"
              size={24}
              color={colors.accent}
            />
            <Text style={[styles.infoText, { color: colors.text }]}>18+ Only</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    height: width * 0.6,
    position: 'relative',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowContainer: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.3,
    opacity: 0.2,
    boxShadow: '0px 0px 60px 30px',
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 16,
    marginBottom: 40,
  },
  button: {
    width: '100%',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  infoCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
