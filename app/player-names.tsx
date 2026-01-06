
import { useTheme } from '@/contexts/ThemeContext';
import React, { useState } from 'react';
import { getColors } from '@/styles/commonStyles';
import { Button } from '@/components/button';
import { IconSymbol } from '@/components/IconSymbol';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function PlayerNamesScreen() {
  const { playerCount } = useLocalSearchParams();
  const count = parseInt(playerCount as string);
  const [playerNames, setPlayerNames] = useState(
    Array.from({ length: count }, (_, i) => `Player ${i + 1}`)
  );
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const { theme } = useTheme();
  const colors = getColors(theme);
  const router = useRouter();

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleNameFocus = (index: number) => {
    setFocusedIndex(index);
    if (playerNames[index] === `Player ${index + 1}`) {
      const newNames = [...playerNames];
      newNames[index] = '';
      setPlayerNames(newNames);
    }
  };

  const handleNameBlur = (index: number) => {
    setFocusedIndex(null);
    if (playerNames[index].trim() === '') {
      const newNames = [...playerNames];
      newNames[index] = `Player ${index + 1}`;
      setPlayerNames(newNames);
    }
  };

  const handleStartGame = () => {
    router.push({
      pathname: '/game',
      params: {
        playerCount: count.toString(),
        playerNames: JSON.stringify(playerNames)
      }
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.text }]}>Enter Player Names</Text>
        
        <View style={styles.namesContainer}>
          {playerNames.map((name, index) => (
            <View key={index} style={styles.nameInputContainer}>
              <Text style={[styles.playerLabel, { color: colors.textSecondary }]}>
                Player {index + 1}
              </Text>
              <TextInput
                style={[
                  styles.nameInput,
                  {
                    backgroundColor: colors.card,
                    color: colors.text,
                    borderColor: focusedIndex === index ? colors.primary : colors.border,
                  }
                ]}
                value={name}
                onChangeText={(text) => handleNameChange(index, text)}
                onFocus={() => handleNameFocus(index)}
                onBlur={() => handleNameBlur(index)}
                placeholder={`Player ${index + 1}`}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          ))}
        </View>

        <Button
          title="Start Game"
          onPress={handleStartGame}
          style={styles.startButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  namesContainer: {
    gap: 16,
  },
  nameInputContainer: {
    gap: 8,
  },
  playerLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  nameInput: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 2,
  },
  startButton: {
    marginTop: 30,
  },
});
