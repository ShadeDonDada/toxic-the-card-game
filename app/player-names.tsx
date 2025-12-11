
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/styles/commonStyles';
import { Button } from '@/components/Button';
import { IconSymbol } from '@/components/IconSymbol';

export default function PlayerNamesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { effectiveColorScheme } = useTheme();
  const colors = getColors(effectiveColorScheme);
  const playerCount = parseInt(params.playerCount as string) || 4;
  
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array.from({ length: playerCount }, (_, i) => `Player ${i + 1}`)
  );

  const handleNameChange = (index: number, name: string) => {
    const updatedNames = [...playerNames];
    updatedNames[index] = name;
    setPlayerNames(updatedNames);
  };

  const handleNameBlur = (index: number) => {
    // Only set default name if the field is empty when user finishes editing
    if (!playerNames[index] || playerNames[index].trim() === '') {
      const updatedNames = [...playerNames];
      updatedNames[index] = `Player ${index + 1}`;
      setPlayerNames(updatedNames);
    }
  };

  const handleStartGame = () => {
    console.log('Starting game with player names:', playerNames);
    // Ensure all names are filled before starting
    const finalNames = playerNames.map((name, index) => 
      name && name.trim() !== '' ? name : `Player ${index + 1}`
    );
    
    router.push({
      pathname: '/game',
      params: { 
        playerCount: playerCount.toString(),
        playerNames: JSON.stringify(finalNames),
      },
    });
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
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

        <Text style={[styles.title, { color: colors.primary, textShadowColor: colors.accent }]}>Enter Player Names</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Customize your player names or use the defaults</Text>

        <View style={styles.namesContainer}>
          {playerNames.map((name, index) => (
            <View key={index} style={[styles.nameInputContainer, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <View style={[styles.playerNumberBadge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.playerNumberText, { color: colors.background }]}>{index + 1}</Text>
              </View>
              <TextInput
                style={[styles.nameInput, { color: colors.text }]}
                value={name}
                onChangeText={(text) => handleNameChange(index, text)}
                onBlur={() => handleNameBlur(index)}
                placeholder={`Player ${index + 1}`}
                placeholderTextColor={colors.textSecondary}
                maxLength={20}
                autoCapitalize="words"
                returnKeyType={index === playerNames.length - 1 ? 'done' : 'next'}
              />
            </View>
          ))}
        </View>

        <Button
          title="Start Game"
          onPress={handleStartGame}
          variant="primary"
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
  scrollView: {
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
    marginBottom: 12,
    textAlign: 'center',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  namesContainer: {
    gap: 16,
    marginBottom: 32,
  },
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    boxShadow: '0px 2px 4px rgba(0, 255, 65, 0.15)',
    elevation: 2,
  },
  playerNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  playerNumberText: {
    fontSize: 18,
    fontWeight: '900',
  },
  nameInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    padding: 0,
  },
  startButton: {
    width: '100%',
    marginTop: 10,
  },
});
