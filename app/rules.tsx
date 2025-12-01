
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function RulesScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>How to Play</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Objective</Text>
        <Text style={styles.bodyText}>
          Create the most toxic reaction for each scenario card provided. The goal is to be hilariously petty and outrageously dramatic!
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleNumber}>1.</Text>
          <Text style={styles.ruleText}>Game is for 18+ players only</Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleNumber}>2.</Text>
          <Text style={styles.ruleText}>Between 2-10 players recommended</Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleNumber}>3.</Text>
          <Text style={styles.ruleText}>Game is played on one phone</Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleNumber}>4.</Text>
          <Text style={styles.ruleText}>Choose your prize & points system</Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleNumber}>5.</Text>
          <Text style={styles.ruleText}>Pass the phone to each player when it&apos;s their turn</Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleNumber}>6.</Text>
          <Text style={styles.ruleText}>Each player draws 6 response cards</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Gameplay</Text>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleNumber}>7.</Text>
          <Text style={styles.ruleText}>
            Create the most toxic scenario through the cards
          </Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleNumber}>8.</Text>
          <Text style={styles.ruleText}>Players choose who goes first</Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleNumber}>9.</Text>
          <Text style={styles.ruleText}>Play rotation is counterclockwise</Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleNumber}>10.</Text>
          <Text style={styles.ruleText}>
            During play, a player can request to exchange a card with any player once per round
          </Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleNumber}>11.</Text>
          <Text style={styles.ruleText}>
            Each round is completed when every player&apos;s hand is empty
          </Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleNumber}>12.</Text>
          <Text style={styles.ruleText}>
            A player may pass if they cannot make a sensible response
          </Text>
        </View>
        <View style={styles.ruleItem}>
          <Text style={styles.ruleNumber}>13.</Text>
          <Text style={styles.ruleText}>
            Playing while drinking is highly encouraged 🍺 21+
          </Text>
        </View>
      </View>

      <View style={[styles.card, styles.warningCard]}>
        <IconSymbol
          ios_icon_name="exclamationmark.triangle.fill"
          android_material_icon_name="warning"
          size={32}
          color={colors.accent}
          style={styles.warningIcon}
        />
        <Text style={styles.warningText}>
          Remember: This is all in good fun! Keep it light-hearted and don&apos;t take things too seriously.
        </Text>
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
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backText: {
    fontSize: 18,
    color: colors.primary,
    marginLeft: 8,
    fontWeight: '600',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.primary,
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: colors.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    boxShadow: '0px 4px 8px rgba(0, 255, 65, 0.25)',
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 16,
    color: colors.text,
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
    color: colors.accent,
    marginRight: 12,
    minWidth: 30,
  },
  ruleText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
    lineHeight: 24,
  },
  warningCard: {
    backgroundColor: colors.darkGreen,
    borderColor: colors.accent,
    alignItems: 'center',
  },
  warningIcon: {
    marginBottom: 12,
  },
  warningText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '600',
  },
});
