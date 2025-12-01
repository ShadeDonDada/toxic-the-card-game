
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { Button } from '@/components/Button';
import { IconSymbol } from '@/components/IconSymbol';

export default function GameSetupScreen() {
  const router = useRouter();
  const [playerCount, setPlayerCount] = useState(4);

  const handleStartGame = () => {
    router.push({
      pathname: '/player-names',
      params: { playerCount: playerCount.toString() },
    });
  };

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

      <Text style={styles.title}>Game Setup</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Number of Players</Text>
        <Text style={styles.sectionSubtitle}>Select between 2-10 players</Text>

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

          <View style={styles.playerCountDisplay}>
            <Text style={styles.playerCountNumber}>{playerCount}</Text>
            <Text style={styles.playerCountLabel}>Players</Text>
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

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Quick Reminders</Text>
        <View style={styles.reminderItem}>
          <Text style={styles.reminderBullet}>•</Text>
          <Text style={styles.reminderText}>Each player has 6 cards</Text>
        </View>
        <View style={styles.reminderItem}>
          <Text style={styles.reminderBullet}>•</Text>
          <Text style={styles.reminderText}>Play goes counterclockwise</Text>
        </View>
        <View style={styles.reminderItem}>
          <Text style={styles.reminderBullet}>•</Text>
          <Text style={styles.reminderText}>One card exchange allowed per round</Text>
        </View>
        <View style={styles.reminderItem}>
          <Text style={styles.reminderBullet}>•</Text>
          <Text style={styles.reminderText}>Decide your own prize & points system</Text>
        </View>
        <View style={styles.reminderItem}>
          <Text style={styles.reminderBullet}>•</Text>
          <Text style={styles.reminderText}>Playing while drinking is highly encouraged 🍺 21+</Text>
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
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
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
    backgroundColor: colors.background,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  playerCountNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.primary,
  },
  playerCountLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  reminderItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  reminderBullet: {
    fontSize: 20,
    color: colors.accent,
    marginRight: 12,
    fontWeight: '700',
  },
  reminderText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
    lineHeight: 24,
  },
  startButton: {
    width: '100%',
    marginTop: 10,
  },
});
