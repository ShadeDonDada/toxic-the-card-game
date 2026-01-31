
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
  withDelay,
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function HomeScreen() {
  const router = useRouter();
  const { effectiveColorScheme } = useTheme();
  const colors = getColors(effectiveColorScheme);
  const [imageLoaded, setImageLoaded] = useState(false);

  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);
  
  // Drip animations - 5 drips with different timings
  const drip1Y = useSharedValue(-50);
  const drip1Opacity = useSharedValue(0);
  const drip2Y = useSharedValue(-50);
  const drip2Opacity = useSharedValue(0);
  const drip3Y = useSharedValue(-50);
  const drip3Opacity = useSharedValue(0);
  const drip4Y = useSharedValue(-50);
  const drip4Opacity = useSharedValue(0);
  const drip5Y = useSharedValue(-50);
  const drip5Opacity = useSharedValue(0);

  useEffect(() => {
    console.log('Home screen mounted - starting toxic drip animations with counter-clockwise rotation');
    
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

    // Smooth continuous counter-clockwise rotation (0 -> -360, repeating infinitely)
    rotation.value = withRepeat(
      withTiming(-360, {
        duration: 20000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    // Drip 1 - Left side
    drip1Y.value = withRepeat(
      withSequence(
        withTiming(200, { duration: 2500, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
        withTiming(-50, { duration: 0 })
      ),
      -1,
      false
    );
    drip1Opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 300 }),
        withTiming(0.8, { duration: 1900 }),
        withTiming(0, { duration: 300 }),
        withTiming(0, { duration: 0 })
      ),
      -1,
      false
    );

    // Drip 2 - Center left (delayed)
    drip2Y.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(220, { duration: 2800, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
          withTiming(-50, { duration: 0 })
        ),
        -1,
        false
      )
    );
    drip2Opacity.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(0.7, { duration: 300 }),
          withTiming(0.7, { duration: 2200 }),
          withTiming(0, { duration: 300 }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      )
    );

    // Drip 3 - Center
    drip3Y.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(240, { duration: 3000, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
          withTiming(-50, { duration: 0 })
        ),
        -1,
        false
      )
    );
    drip3Opacity.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(0.9, { duration: 300 }),
          withTiming(0.9, { duration: 2400 }),
          withTiming(0, { duration: 300 }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      )
    );

    // Drip 4 - Center right (delayed)
    drip4Y.value = withDelay(
      1500,
      withRepeat(
        withSequence(
          withTiming(210, { duration: 2600, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
          withTiming(-50, { duration: 0 })
        ),
        -1,
        false
      )
    );
    drip4Opacity.value = withDelay(
      1500,
      withRepeat(
        withSequence(
          withTiming(0.75, { duration: 300 }),
          withTiming(0.75, { duration: 2000 }),
          withTiming(0, { duration: 300 }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      )
    );

    // Drip 5 - Right side
    drip5Y.value = withDelay(
      2000,
      withRepeat(
        withSequence(
          withTiming(230, { duration: 2900, easing: Easing.bezier(0.4, 0, 0.6, 1) }),
          withTiming(-50, { duration: 0 })
        ),
        -1,
        false
      )
    );
    drip5Opacity.value = withDelay(
      2000,
      withRepeat(
        withSequence(
          withTiming(0.85, { duration: 300 }),
          withTiming(0.85, { duration: 2300 }),
          withTiming(0, { duration: 300 }),
          withTiming(0, { duration: 0 })
        ),
        -1,
        false
      )
    );
  }, [imageLoaded, scale, opacity, rotation, drip1Y, drip1Opacity, drip2Y, drip2Opacity, drip3Y, drip3Opacity, drip4Y, drip4Opacity, drip5Y, drip5Opacity]);

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
      ],
      opacity: opacity.value,
    };
  });

  const animatedDrip1Style = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: drip1Y.value }],
      opacity: drip1Opacity.value,
    };
  });

  const animatedDrip2Style = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: drip2Y.value }],
      opacity: drip2Opacity.value,
    };
  });

  const animatedDrip3Style = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: drip3Y.value }],
      opacity: drip3Opacity.value,
    };
  });

  const animatedDrip4Style = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: drip4Y.value }],
      opacity: drip4Opacity.value,
    };
  });

  const animatedDrip5Style = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: drip5Y.value }],
      opacity: drip5Opacity.value,
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
          
          {/* Toxic drip animations behind the logo - using the toxic droplet image */}
          <View style={styles.dripsContainer}>
            <AnimatedImage
              source={require('@/assets/images/709cbf9b-fc3f-4413-a3d2-41b5b1872407.png')}
              style={[styles.dripImage, styles.drip1Position, animatedDrip1Style]}
              resizeMode="contain"
            />

            <AnimatedImage
              source={require('@/assets/images/709cbf9b-fc3f-4413-a3d2-41b5b1872407.png')}
              style={[styles.dripImage, styles.drip2Position, animatedDrip2Style]}
              resizeMode="contain"
            />

            <AnimatedImage
              source={require('@/assets/images/709cbf9b-fc3f-4413-a3d2-41b5b1872407.png')}
              style={[styles.dripImage, styles.drip3Position, animatedDrip3Style]}
              resizeMode="contain"
            />

            <AnimatedImage
              source={require('@/assets/images/709cbf9b-fc3f-4413-a3d2-41b5b1872407.png')}
              style={[styles.dripImage, styles.drip4Position, animatedDrip4Style]}
              resizeMode="contain"
            />

            <AnimatedImage
              source={require('@/assets/images/709cbf9b-fc3f-4413-a3d2-41b5b1872407.png')}
              style={[styles.dripImage, styles.drip5Position, animatedDrip5Style]}
              resizeMode="contain"
            />
          </View>

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
    marginBottom: 50,
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
  dripsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  dripImage: {
    position: 'absolute',
    top: 0,
    width: 60,
    height: 80,
  },
  drip1Position: {
    left: '20%',
  },
  drip2Position: {
    left: '35%',
  },
  drip3Position: {
    left: '50%',
  },
  drip4Position: {
    left: '65%',
  },
  drip5Position: {
    left: '80%',
  },
  logo: {
    width: width * 0.7,
    height: width * 0.7,
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
