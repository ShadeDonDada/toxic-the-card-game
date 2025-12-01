
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { colors } from '@/styles/commonStyles';

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
        isScenario ? styles.scenarioCard : styles.responseCard,
        selected && styles.selectedCard,
        disabled && styles.disabledCard,
        isCustom && styles.customCard,
      ]}
    >
      {isScenario && (
        <View style={styles.scenarioBadge}>
          <Text style={styles.badgeText}>SCENARIO</Text>
        </View>
      )}
      {isCustom ? (
        <View style={styles.customContainer}>
          <Text style={styles.customLabel}>✏️ Create Your Own Response</Text>
          <TextInput
            style={styles.customInput}
            placeholder="Type your toxic response here..."
            placeholderTextColor={colors.textSecondary}
            value={localCustomText}
            onChangeText={handleTextChange}
            multiline
            maxLength={200}
            textAlign="center"
          />
          <Text style={styles.characterCount}>{localCustomText.length}/200</Text>
        </View>
      ) : (
        <Text style={[styles.cardText, isScenario && styles.scenarioText]}>
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
    backgroundColor: colors.black,
    borderColor: colors.primary,
    paddingTop: 40,
  },
  responseCard: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
  },
  customCard: {
    backgroundColor: colors.darkGreen,
    borderColor: colors.accent,
    borderStyle: 'dashed',
  },
  selectedCard: {
    borderColor: colors.accent,
    borderWidth: 4,
    boxShadow: '0px 6px 12px rgba(57, 255, 20, 0.5)',
  },
  disabledCard: {
    opacity: 0.5,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.text,
    lineHeight: 22,
  },
  scenarioText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  scenarioBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.darkGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  badgeText: {
    color: colors.primary,
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
    color: colors.accent,
    textAlign: 'center',
    marginBottom: 4,
  },
  customInput: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: colors.text,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 2,
    borderColor: colors.cardBorder,
  },
  characterCount: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
});
