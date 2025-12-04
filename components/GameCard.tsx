
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, useColorScheme } from 'react-native';
import { getColors } from '@/styles/commonStyles';

interface GameCardProps {
  text: string;
  type: 'scenario' | 'response';
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
  isCustom?: boolean;
  customText?: string;
  onCustomTextChange?: (text: string) => void;
}

export function GameCard({ 
  text, 
  type, 
  onPress, 
  selected, 
  disabled, 
  isCustom,
  customText,
  onCustomTextChange 
}: GameCardProps) {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);
  const isScenario = type === 'scenario';
  const [localCustomText, setLocalCustomText] = useState(customText || '');
  
  const handleTextChange = (newText: string) => {
    setLocalCustomText(newText);
    if (onCustomTextChange) {
      onCustomTextChange(newText);
    }
  };

  const handleCardPress = () => {
    if (onPress && !disabled) {
      onPress();
    }
  };
  
  return (
    <TouchableOpacity
      onPress={handleCardPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
      style={[
        styles.card,
        { 
          backgroundColor: isCustom ? colors.darkGreen : (isScenario ? colors.black : colors.card),
          borderColor: isCustom ? colors.accent : (isScenario ? colors.primary : colors.cardBorder)
        },
        isScenario && styles.scenarioCard,
        selected && { borderColor: colors.accent, borderWidth: 4 },
        disabled && styles.disabledCard,
        isCustom && styles.customCard,
      ]}
    >
      {isScenario && (
        <View style={[styles.scenarioBadge, { backgroundColor: colors.darkGreen, borderColor: colors.primary }]}>
          <Text style={[styles.badgeText, { color: colors.primary }]}>SCENARIO</Text>
        </View>
      )}
      {isCustom ? (
        <View style={styles.customContainer}>
          <Text style={[styles.customLabel, { color: colors.accent }]}>✏️ Create Your Own Response</Text>
          <TextInput
            style={[styles.customInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.cardBorder }]}
            placeholder="Type your toxic response here..."
            placeholderTextColor={colors.textSecondary}
            value={localCustomText}
            onChangeText={handleTextChange}
            multiline
            maxLength={200}
            textAlign="center"
          />
          <Text style={[styles.characterCount, { color: colors.textSecondary }]}>{localCustomText.length}/200</Text>
        </View>
      ) : (
        <Text style={[styles.cardText, { color: isScenario ? colors.primary : colors.text }, isScenario && styles.scenarioText]}>
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 20,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 4px 8px rgba(0, 255, 65, 0.25)',
    elevation: 5,
    borderWidth: 3,
  },
  scenarioCard: {
    paddingTop: 40,
  },
  customCard: {
    borderStyle: 'dashed',
  },
  disabledCard: {
    opacity: 0.5,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  scenarioText: {
    fontSize: 18,
    fontWeight: '700',
  },
  scenarioBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  customContainer: {
    width: '100%',
    gap: 8,
  },
  customLabel: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  customInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 2,
  },
  characterCount: {
    fontSize: 11,
    textAlign: 'right',
    marginTop: 4,
  },
});
