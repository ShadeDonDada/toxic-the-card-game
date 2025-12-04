
import React from 'react';
import { View, Text, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { GameCard } from './GameCard';
import { ResponseCard } from '@/types/game';
import { getColors } from '@/styles/commonStyles';

interface PlayerHandProps {
  cards: ResponseCard[];
  onCardPress: (cardId: string) => void;
  selectedCardId?: string;
  disabled?: boolean;
  onCustomTextChange?: (cardId: string, text: string) => void;
}

export function PlayerHand({ 
  cards, 
  onCardPress, 
  selectedCardId, 
  disabled,
  onCustomTextChange 
}: PlayerHandProps) {
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Your Hand ({cards.length} cards)</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {cards.map((card) => (
          <View key={card.id} style={styles.cardWrapper}>
            <GameCard
              text={card.text}
              type="response"
              onPress={() => onCardPress(card.id)}
              selected={selectedCardId === card.id}
              disabled={disabled}
              isCustom={card.isCustom}
              customText={card.customText}
              onCustomTextChange={(text) => {
                if (onCustomTextChange) {
                  onCustomTextChange(card.id, text);
                }
              }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cardWrapper: {
    width: 200,
    marginRight: 12,
  },
});
