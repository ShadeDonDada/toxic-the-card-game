
import { getColors } from '@/styles/commonStyles';
import { useTheme } from '@/contexts/ThemeContext';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { useRouter, useLocalSearchParams } from 'expo-router';

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
  inputSection: {
    marginBottom: 40,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default function PlayerNamesScreen() {
  const params = useLocalSearchParams();
  const playerCount = parseInt(params.playerCount as string) || 2;
  
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array.from({ length: playerCount }, (_, i) => `Player ${i + 1}`)
  );
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  
  const { theme } = useTheme();
  const router = useRouter();
  const colors = getColors(theme);

  const handleNameChange = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleNameFocus = (index: number) => {
    setFocusedIndex(index);
    // Clear default name on focus
    if (playerNames[index] === `Player ${index + 1}`) {
      const newNames = [...playerNames];
      newNames[index] = '';
      setPlayerNames(newNames);
    }
  };

  const handleNameBlur = (index: number) => {
    setFocusedIndex(null);
    // Restore default name if empty
    if (playerNames[index].trim() === '') {
      const newNames = [...playerNames];
      newNames[index] = `Player ${index + 1}`;
      setPlayerNames(newNames);
    }
  };

  const handleStartGame = () => {
    console.log('PlayerNamesScreen: Starting game with names:', playerNames);
    router.push({
      pathname: '/game',
      params: {
        playerCount: playerCount.toString(),
        playerNames: JSON.stringify(playerNames),
      },
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              console.log('PlayerNamesScreen: User tapped back button');
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
          <Text style={[styles.title, { color: colors.text }]}>Player Names</Text>
        </View>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Enter names for all {playerCount} players
        </Text>

        <View style={styles.inputSection}>
          {playerNames.map((name, index) => (
            <View key={index}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Player {index + 1}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: focusedIndex === index ? colors.primary : colors.border,
                    color: colors.text,
                  },
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

        <View style={styles.buttonContainer}>
          <Button title="Start Game" onPress={handleStartGame} variant="primary" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
