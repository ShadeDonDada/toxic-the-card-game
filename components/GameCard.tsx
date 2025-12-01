
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
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
    elevation: 5,
    borderWidth: 3,
  },
  scenarioCard: {
    backgroundColor: colors.primary,
    borderColor: colors.accent,
  },
  responseCard: {
    backgroundColor: colors.card,
    borderColor: colors.secondary,
  },
  selectedCard: {
    borderColor: colors.highlight,
    borderWidth: 4,
    boxShadow: '0px 6px 12px rgba(255, 255, 0, 0.4)',
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
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  scenarioBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
