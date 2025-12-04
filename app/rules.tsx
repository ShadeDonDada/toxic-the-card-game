
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { getColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function RulesScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.contentContainer}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <IconSymbol
          ios_icon_name="chevron.left"
          android_material_icon_name="arrow-back"
          size={24}
          color={colors.primary}
        />
        <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.primary, textShadowColor: colors.accent }]}>How to Play</Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Objective</Text>
        <Text style={[styles.bodyText, { color: colors.text }]}>
          Create the most toxic reaction for each scenario card provided. The goal is to be hilariously petty and outrageously dramatic!
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Overview</Text>
        <View style={styles.ruleItem}>
          <Text style={[styles.ruleNumber, { color: colors.accent }]}>1.</Text>
          <Text style={[styles.ruleText, { color: colors.text }]}>Game is for 18+ players only</Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={[styles.ruleNumber, { color: colors.accent }]}>2.</Text>
          <Text style={[styles.ruleText, { color: colors.text }]}>Between 2-10 players</Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={[styles.ruleNumber, { color: colors.accent }]}>3.</Text>
          <Text style={[styles.ruleText, { color: colors.text }]}>Game is played on one phone</Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={[styles.ruleNumber, { color: colors.accent }]}>4.</Text>
          <Text style={[styles.ruleText, { color: colors.text }]}>Choose each others consequences</Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={[styles.ruleNumber, { color: colors.accent }]}>5.</Text>
          <Text style={[styles.ruleText, { color: colors.text }]}>Pass the phone to each player when it&apos;s their turn</Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={[styles.ruleNumber, { color: colors.accent }]}>6.</Text>
          <Text style={[styles.ruleText, { color: colors.text }]}>Over 100 scenarios & responses</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Text style={[styles.sectionTitle, { color: colors.primary }]}>Gameplay</Text>
        <View style={styles.ruleItem}>
          <Text style={[styles.ruleNumber, { color: colors.accent }]}>7.</Text>
          <Text style={[styles.ruleText, { color: colors.text }]}>
            Create the most toxic conversation through the cards
          </Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={[styles.ruleNumber, { color: colors.accent }]}>8.</Text>
          <Text style={[styles.ruleText, { color: colors.text }]}>Each player starts with 6 cards</Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={[styles.ruleNumber, { color: colors.accent }]}>9.</Text>
          <Text style={[styles.ruleText, { color: colors.text }]}>Play rotation is counterclockwise</Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={[styles.ruleNumber, { color: colors.accent }]}>10.</Text>
          <Text style={[styles.ruleText, { color: colors.text }]}>
            During play, a player can request to exchange a random card with any player once per round
          </Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={[styles.ruleNumber, { color: colors.accent }]}>11.</Text>
          <Text style={[styles.ruleText, { color: colors.text }]}>
            Each round is completed when every player&apos;s hand is empty
          </Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={[styles.ruleNumber, { color: colors.accent }]}>12.</Text>
          <Text style={[styles.ruleText, { color: colors.text }]}>
            A player may pass if they cannot make a sensible response
          </Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={[styles.ruleNumber, { color: colors.accent }]}>13.</Text>
          <Text style={[styles.ruleText, { color: colors.text }]}>
            Playing while drinking is highly encouraged 🍺 21+
          </Text>
        </View>
      </View>

      <View style={[styles.card, styles.warningCard, { backgroundColor: colors.warningBackground, borderColor: colors.accent }]}>
        <IconSymbol
          ios_icon_name="exclamationmark.triangle.fill"
          android_material_icon_name="warning"
          size={32}
          color={colors.accent}
          style={styles.warningIcon}
        />
        <Text style={[styles.warningText, { color: colors.warningText }]}>
          Remember: This is all in good fun! Keep it light-hearted and don&apos;t take things too seriously.
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
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    fontSize: 18,
    marginLeft: 8,
    fontWeight: '600',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 30,
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    boxShadow: '0px 4px 8px rgba(0, 255, 65, 0.25)',
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  ruleNumber: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 12,
    minWidth: 30,
  },
  ruleText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
  },
  warningCard: {
    alignItems: 'center',
  },
  warningIcon: {
    marginBottom: 12,
  },
  warningText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '600',
  },
});
