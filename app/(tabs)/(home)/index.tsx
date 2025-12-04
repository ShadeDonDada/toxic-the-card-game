
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { getColors } from '@/styles/commonStyles';
import { Button } from '@/components/Button';
import { IconSymbol } from '@/components/IconSymbol';

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/0ed37ab6-3363-4785-9333-7f6211c02e59.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>&quot;Extracting the poison out of you&quot;</Text>
      </View>

      <View style={[styles.descriptionCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Text style={[styles.descriptionText, { color: colors.text }]}>
          Create the most toxic reaction for each scenario card. Compete with friends to see who can be the most hilariously petty!
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        <View style={[styles.featureRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <IconSymbol
            ios_icon_name="person.2.fill"
            android_material_icon_name="people"
            size={32}
            color={colors.primary}
          />
          <Text style={[styles.featureText, { color: colors.text }]}>2-10 Players</Text>
        </View>
        <View style={[styles.featureRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <IconSymbol
            ios_icon_name="18.circle.fill"
            android_material_icon_name="warning"
            size={32}
            color={colors.accent}
          />
          <Text style={[styles.featureText, { color: colors.text }]}>18+ Only</Text>
        </View>
        <View style={[styles.featureRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <IconSymbol
            ios_icon_name="arrow.counterclockwise"
            android_material_icon_name="refresh"
            size={32}
            color={colors.primary}
          />
          <Text style={[styles.featureText, { color: colors.text }]}>Counterclockwise Play</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Start New Game"
          onPress={() => router.push('/game-setup')}
          variant="primary"
          style={styles.button}
        />
        <Button
          title="How to Play"
          onPress={() => router.push('/rules')}
          variant="secondary"
          style={styles.button}
        />
        <Button
          title="Thank You"
          onPress={() => router.push('/thank-you')}
          variant="secondary"
          style={styles.button}
        />
      </View>

      <View style={[styles.copyrightContainer, { borderTopColor: colors.cardBorder }]}>
        <Text style={[styles.copyrightText, { color: colors.textSecondary }]}>
          © 2025 Steven A. Pennant. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  logo: {
    width: screenWidth - 20,
    height: (screenWidth - 20) * 0.8,
    marginBottom: 20,
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    marginTop: 10,
  },
  descriptionCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 2,
    boxShadow: '0px 4px 8px rgba(0, 255, 65, 0.25)',
    elevation: 4,
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
  },
  featureText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
  },
  copyrightContainer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
  copyrightText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
