
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/styles/commonStyles';
import { Button } from '@/components/button';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter } from 'expo-router';

export default function GameSetupScreen() {
  const [playerCount, setPlayerCount] = useState(2);
  const { theme } = useTheme();
  const colors = getColors(theme);
  const router = useRouter();

  const handleStartGame = () => {
    router.push({
      pathname: '/player-names',
      params: { playerCount: playerCount.toString() }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.text }]}>Game Setup</Text>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Number of Players</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Select between 2-10 players
          </Text>
          
          <View style={styles.playerCountContainer}>
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.playerCountButton,
                  { 
                    backgroundColor: playerCount === count ? colors.primary : colors.card,
                    borderColor: playerCount === count ? colors.primary : colors.border
                  }
                ]}
                onPress={() => setPlayerCount(count)}
              >
                <Text style={[
                  styles.playerCountText,
                  { color: playerCount === count ? '#FFFFFF' : colors.text }
                ]}>
                  {count}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          title="Continue"
          onPress={handleStartGame}
          style={styles.startButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  playerCountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  playerCountButton: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  playerCountText: {
    fontSize: 20,
    fontWeight: '600',
  },
  startButton: {
    marginTop: 20,
  },
});
