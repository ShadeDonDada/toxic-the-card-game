
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Button } from '@/components/Button';

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
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  playerCountSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  playerCountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  playerCountButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
  },
  playerCountText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  selectedButton: {
    borderColor: '#4CAF50',
    borderWidth: 3,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default function GameSetupScreen() {
  const [playerCount, setPlayerCount] = useState(2);
  const { theme } = useTheme();
  const router = useRouter();
  const colors = getColors(theme);

  const handleStartGame = () => {
    console.log('GameSetupScreen: User starting game with', playerCount, 'players');
    router.push({
      pathname: '/player-names',
      params: { playerCount: playerCount.toString() },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              console.log('GameSetupScreen: User tapped back button');
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
          <Text style={[styles.title, { color: colors.text }]}>Game Setup</Text>
        </View>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Select the number of players (2-10)
        </Text>

        <View style={styles.playerCountSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Number of Players
          </Text>
          <View style={styles.playerCountGrid}>
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.playerCountButton,
                  { backgroundColor: colors.cardBackground, borderColor: colors.border },
                  playerCount === count && styles.selectedButton,
                ]}
                onPress={() => {
                  console.log('GameSetupScreen: User selected', count, 'players');
                  setPlayerCount(count);
                }}
              >
                <Text style={[styles.playerCountText, { color: colors.text }]}>
                  {count}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Continue" onPress={handleStartGame} variant="primary" />
        </View>
      </ScrollView>
    </View>
  );
}
