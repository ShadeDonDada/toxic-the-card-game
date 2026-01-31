
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/styles/commonStyles';
import { Button } from '@/components/Button';
import { IconSymbol } from '@/components/IconSymbol';

export default function GameSetupScreen() {
  const router = useRouter();
  const { effectiveColorScheme } = useTheme();
  const colors = getColors(effectiveColorScheme);
  const [playerCount, setPlayerCount] = useState(4);

  const handleStartGame = () => {
    console.log('Starting game with', playerCount, 'players');
    router.push({
      pathname: '/player-names',
      params: { playerCount: playerCount.toString() },
    });
  };

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

      <Text style={[styles.title, { color: colors.primary, textShadowColor: colors.accent }]}>Game Setup</Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }, Platform.OS === 'ios' && styles.shadowIOS]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Number of Players</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>Select between 2-10 players</Text>

        <View style={styles.playerSelector}>
          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() => setPlayerCount(Math.max(2, playerCount - 1))}
          >
            <IconSymbol
              ios_icon_name="minus.circle.fill"
              android_material_icon_name="remove-circle"
              size={40}
              color={colors.accent}
            />
          </TouchableOpacity>

          <View style={[styles.playerCountDisplay, { backgroundColor: colors.background, borderColor: colors.primary }]}>
            <Text style={[styles.playerCountNumber, { color: colors.primary }]}>{playerCount}</Text>
            <Text style={[styles.playerCountLabel, { color: colors.textSecondary }]}>Players</Text>
          </View>

          <TouchableOpacity
            style={styles.adjustButton}
            onPress={() => setPlayerCount(Math.min(10, playerCount + 1))}
          >
            <IconSymbol
              ios_icon_name="plus.circle.fill"
              android_material_icon_name="add-circle"
              size={40}
              color={colors.accent}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }, Platform.OS === 'ios' && styles.shadowIOS]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Reminders</Text>
        <View style={styles.reminderItem}>
          <Text style={[styles.reminderBullet, { color: colors.accent }]}>•</Text>
          <Text style={[styles.reminderText, { color: colors.text }]}>Each player has 6 cards</Text>
        </View>
        <View style={styles.reminderItem}>
          <Text style={[styles.reminderBullet, { color: colors.accent }]}>•</Text>
          <Text style={[styles.reminderText, { color: colors.text }]}>Player 1 goes first</Text>
        </View>
        <View style={styles.reminderItem}>
          <Text style={[styles.reminderBullet, { color: colors.accent }]}>•</Text>
          <Text style={[styles.reminderText, { color: colors.text }]}>One card exchange allowed per round</Text>
        </View>
        <View style={styles.reminderItem}>
          <Text style={[styles.reminderBullet, { color: colors.accent }]}>•</Text>
          <Text style={[styles.reminderText, { color: colors.text }]}>Decide your own consequences</Text>
        </View>
        <View style={styles.reminderItem}>
          <Text style={[styles.reminderBullet, { color: colors.accent }]}>•</Text>
          <Text style={[styles.reminderText, { color: colors.text }]}>Playing while drinking is highly encouraged 🍺 21+</Text>
        </View>
      </View>

      <Button
        title="Continue"
        onPress={handleStartGame}
        variant="primary"
        style={styles.startButton}
      />
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
    elevation: 4,
  },
  shadowIOS: {
    shadowColor: 'rgba(0, 255, 65, 0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  playerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  adjustButton: {
    padding: 8,
  },
  playerCountDisplay: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    borderWidth: 2,
  },
  playerCountNumber: {
    fontSize: 48,
    fontWeight: '900',
  },
  playerCountLabel: {
    fontSize: 16,
    marginTop: 4,
  },
  reminderItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  reminderBullet: {
    fontSize: 20,
    marginRight: 12,
    fontWeight: '700',
  },
  reminderText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 24,
  },
  startButton: {
    width: '100%',
    marginTop: 10,
  },
});
