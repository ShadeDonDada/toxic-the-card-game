
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { Button } from '@/components/Button';
import { IconSymbol } from '@/components/IconSymbol';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/e8f37e8e-4b32-4755-b17f-9e37f4ee6b15.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.tagline}>&quot;Extracting the poison out of you&quot;</Text>
      </View>

      <View style={styles.descriptionCard}>
        <Text style={styles.descriptionText}>
          Create the most toxic reaction for each scenario card. Compete with friends to see who can be the most hilariously petty!
        </Text>
      </View>

      <View style={styles.featuresContainer}>
        <View style={styles.featureRow}>
          <IconSymbol
            ios_icon_name="person.2.fill"
            android_material_icon_name="people"
            size={32}
            color={colors.primary}
          />
          <Text style={styles.featureText}>2-10 Players</Text>
        </View>
        <View style={styles.featureRow}>
          <IconSymbol
            ios_icon_name="18.circle.fill"
            android_material_icon_name="warning"
            size={32}
            color={colors.accent}
          />
          <Text style={styles.featureText}>18+ Only</Text>
        </View>
        <View style={styles.featureRow}>
          <IconSymbol
            ios_icon_name="arrow.counterclockwise"
            android_material_icon_name="refresh"
            size={32}
            color={colors.primary}
          />
          <Text style={styles.featureText}>Counterclockwise Play</Text>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  },
  logo: {
    width: 280,
    height: 200,
    marginBottom: 20,
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.textSecondary,
    marginTop: 10,
  },
  descriptionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    boxShadow: '0px 4px 8px rgba(0, 255, 65, 0.25)',
    elevation: 4,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.text,
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
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.cardBorder,
  },
  featureText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 16,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    width: '100%',
  },
});
