
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface GameCardProps {
  text: string;
  type: 'scenario' | 'response';
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export function GameCard({ text, type, onPress, selected, disabled }: GameCardProps) {
  const isScenario = type === 'scenario';
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.7}
      style={[
        styles.card,
        isScenario ? styles.scenarioCard : styles.responseCard,
        selected && styles.selectedCard,
        disabled && styles.disabledCard,
      ]}
    >
      <Text style={[styles.cardText, isScenario && styles.scenarioText]}>
        {text}
      </Text>
      {isScenario && (
        <View style={styles.scenarioBadge}>
          <Text style={styles.badgeText}>SCENARIO</Text>
        </View>
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
  },
  responseCard: {
    backgroundColor: colors.card,
    borderColor: colors.cardBorder,
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
    top: 8,
    right: 8,
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
});
