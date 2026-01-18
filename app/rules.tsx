
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/styles/commonStyles';
import React from 'react';
import { IconSymbol } from '@/components/IconSymbol';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  ruleNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    minWidth: 30,
  },
  ruleText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
});

export default function RulesScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const colors = getColors(theme);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              console.log('RulesScreen: User tapped back button');
              router.back();
            }}
          >
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow-back"
              size={28}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Rules</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Overview
          </Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            &quot;Extracting the poison out of you&quot;
          </Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            Objective of the game is to create the most toxic reaction for each scenario card provided.
          </Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            - Each player must draw 6 cards.
          </Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            - One scenario card gets placed then every player places their best response card.
          </Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            - Recommended 2-10 players.
          </Text>
          <Text style={[styles.text, { color: colors.textSecondary }]}>
            - Plays go counterclockwise.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            How to Play
          </Text>
          
          <View style={styles.ruleItem}>
            <Text style={[styles.ruleNumber, { color: colors.text }]}>1.</Text>
            <Text style={[styles.ruleText, { color: colors.textSecondary }]}>
              18+ only.
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <Text style={[styles.ruleNumber, { color: colors.text }]}>2.</Text>
            <Text style={[styles.ruleText, { color: colors.textSecondary }]}>
              Between 2 - 10 players.
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <Text style={[styles.ruleNumber, { color: colors.text }]}>3.</Text>
            <Text style={[styles.ruleText, { color: colors.textSecondary }]}>
              Shuffle the response cards.
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <Text style={[styles.ruleNumber, { color: colors.text }]}>4.</Text>
            <Text style={[styles.ruleText, { color: colors.textSecondary }]}>
              You choose the prize & points system.
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <Text style={[styles.ruleNumber, { color: colors.text }]}>5.</Text>
            <Text style={[styles.ruleText, { color: colors.textSecondary }]}>
              Place the scenario cards face down in the middle of all players then turn over the top card.
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <Text style={[styles.ruleNumber, { color: colors.text }]}>6.</Text>
            <Text style={[styles.ruleText, { color: colors.textSecondary }]}>
              Each player must draw 6 response cards.
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <Text style={[styles.ruleNumber, { color: colors.text }]}>7.</Text>
            <Text style={[styles.ruleText, { color: colors.textSecondary }]}>
              Objective of the game is to create the most toxic scenario through the cards.
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <Text style={[styles.ruleNumber, { color: colors.text }]}>8.</Text>
            <Text style={[styles.ruleText, { color: colors.textSecondary }]}>
              Players choose who goes first.
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <Text style={[styles.ruleNumber, { color: colors.text }]}>9.</Text>
            <Text style={[styles.ruleText, { color: colors.textSecondary }]}>
              Play rotation is counterclockwise.
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <Text style={[styles.ruleNumber, { color: colors.text }]}>10.</Text>
            <Text style={[styles.ruleText, { color: colors.textSecondary }]}>
              Only during play a player can request to exchange a card with any player once.
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <Text style={[styles.ruleNumber, { color: colors.text }]}>11.</Text>
            <Text style={[styles.ruleText, { color: colors.textSecondary }]}>
              Each round is completed when every player hand is empty.
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <Text style={[styles.ruleNumber, { color: colors.text }]}>12.</Text>
            <Text style={[styles.ruleText, { color: colors.textSecondary }]}>
              A player may pass if they cannot make a sensible response.
            </Text>
          </View>

          <View style={styles.ruleItem}>
            <Text style={[styles.ruleNumber, { color: colors.text }]}>13.</Text>
            <Text style={[styles.ruleText, { color: colors.textSecondary }]}>
              Playing while drinking is highly encouraged.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
