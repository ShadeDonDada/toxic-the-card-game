
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
  withSpring,
} from 'react-native-reanimated';

export default function HomeScreen() {
  const router = useRouter();
  const { effectiveColorScheme } = useTheme();
  const colors = getColors(effectiveColorScheme);
  const [imageLoaded, setImageLoaded] = useState(false);

  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);
  const glowOpacity1 = useSharedValue(0.2);
  const glowOpacity2 = useSharedValue(0.1);
  const glowScale1 = useSharedValue(1);
  const glowScale2 = useSharedValue(1);

  useEffect(() => {
    console.log('Home screen mounted - starting enhanced animations');
    
    // Initial entrance animation
    scale.value = withSpring(1, {
      damping: 8,
      stiffness: 100,
    });
    
    opacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.ease),
    });

    // Continuous pulsing scale animation (more pronounced)
    setTimeout(() => {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }, 800);

    // Subtle rotation animation
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 20000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // First glow layer - faster pulse
    glowOpacity1.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.2, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    glowScale1.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Second glow layer - slower, offset pulse
    glowOpacity2.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    glowScale2.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [imageLoaded, scale, opacity, rotation, glowOpacity1, glowOpacity2, glowScale1, glowScale2]);

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  const animatedGlow1Style = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity1.value,
      transform: [{ scale: glowScale1.value }],
    };
  });

  const animatedGlow2Style = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity2.value,
      transform: [{ scale: glowScale2.value }],
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
          
          <Animated.View style={[styles.glowContainer1, animatedGlow1Style]}>
            <View style={[styles.glow1, { backgroundColor: colors.primary }]} />
          </Animated.View>

          <Animated.View style={[styles.glowContainer2, animatedGlow2Style]}>
            <View style={[styles.glow2, { backgroundColor: colors.accent }]} />
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
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    height: width * 0.85,
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
  glowContainer1: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow1: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.4,
    opacity: 0.3,
    boxShadow: '0px 0px 80px 40px',
  },
  glowContainer2: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow2: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.45,
    opacity: 0.2,
    boxShadow: '0px 0px 100px 50px',
  },
  logo: {
    width: width * 0.7,
    height: width * 0.7,
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
