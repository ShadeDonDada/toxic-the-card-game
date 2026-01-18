
import { getColors } from '@/styles/commonStyles';
import { useTheme } from '@/contexts/ThemeContext';
import { usePurchase } from '@/contexts/PurchaseContext';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Image } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { useGameState } from '@/hooks/useGameState';
import { Button } from '@/components/Button';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { adManager } from '@/utils/adManager';

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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  roundInfo: {
    alignItems: 'center',
  },
  roundText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 14,
  },
  scenarioCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    minHeight: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scenarioText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  currentPlayerSection: {
    marginBottom: 24,
  },
  currentPlayerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  cardText: {
    fontSize: 14,
    textAlign: 'center',
  },
  selectedCard: {
    borderColor: '#4CAF50',
    borderWidth: 3,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  playersListSection: {
    marginTop: 24,
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  playerScore: {
    fontSize: 16,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  playerCardContainer: {
    marginTop: 8,
  },
  playerCardText: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default function GameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  const { isPremium } = usePurchase();
  const colors = getColors(theme);
  const scrollViewRef = useRef<ScrollView>(null);

  const { gameState, initializeGame, selectCard, nextPlayer, awardPoint, nextRound } = useGameState();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showPassPhoneModal, setShowPassPhoneModal] = useState(false);
  const [nextPlayerName, setNextPlayerName] = useState('');
  const [showReadyModal, setShowReadyModal] = useState(false);

  const playerCount = parseInt(params.playerCount as string) || 2;
  const playerNames = params.playerNames ? JSON.parse(params.playerNames as string) : [];

  useEffect(() => {
    console.log('GameScreen: Initializing game with player count:', playerCount);
    initializeGame(playerCount, playerNames);
    
    // Set premium status in ad manager
    adManager.setPremiumStatus(isPremium);
    
    // Reset round counter when starting a new game
    adManager.resetRoundCounter();
  }, [playerCount, initializeGame, isPremium, playerNames]);

  useEffect(() => {
    // Update ad manager when premium status changes
    adManager.setPremiumStatus(isPremium);
  }, [isPremium]);

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  const handleCardSelect = (cardId: string) => {
    console.log('GameScreen: User selected card:', cardId);
    setSelectedCardId(cardId);
    if (currentPlayer) {
      selectCard(currentPlayer.id, cardId);
    }
  };

  const handlePlayCard = () => {
    if (!selectedCardId) {
      Alert.alert('No Card Selected', 'Please select a card to play.');
      return;
    }

    console.log('GameScreen: User played card');
    
    // Check if this is the last player
    const isLastPlayer = gameState.currentPlayerIndex === gameState.players.length - 1;
    
    if (isLastPlayer) {
      // Last player - show ready modal before awarding points
      console.log('GameScreen: Last player, showing ready modal');
      setShowReadyModal(true);
    } else {
      // Not last player - show pass phone prompt
      const nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
      const nextPlayer = gameState.players[nextPlayerIndex];
      setNextPlayerName(nextPlayer.name);
      setShowPassPhoneModal(true);
    }
  };

  const handleReadyPress = () => {
    console.log('GameScreen: User pressed Ready button');
    setShowReadyModal(false);
    setShowPassPhoneModal(false);
    setSelectedCardId(null);
    nextPlayer();
    scrollToTop();
  };

  const handleAwardPoint = (playerId: string) => {
    console.log('GameScreen: Awarding point to player:', playerId);
    
    // Award the point first
    awardPoint(playerId);
    
    // Show ad at round end (only for free users, not on first round)
    console.log('GameScreen: Round ended, triggering ad check');
    adManager.showAdAtRoundEnd();
  };

  const handlePlayAgain = () => {
    console.log('GameScreen: User tapped Play Again button');
    
    // Check if there are more scenarios
    if (gameState.scenarioDeck.length === 0) {
      console.log('GameScreen: No more scenarios available, game over');
      Alert.alert(
        'Game Over',
        'No more scenarios available! Thanks for playing!',
        [
          {
            text: 'Back to Menu',
            onPress: () => {
              console.log('GameScreen: User chose to return to menu after game over');
              adManager.resetRoundCounter();
              router.push('/(tabs)/(home)');
            },
          },
        ]
      );
      return;
    }
    
    console.log('GameScreen: Starting next round');
    nextRound();
    setSelectedCardId(null);
    scrollToTop();
  };

  // Render awarding phase
  if (gameState.gamePhase === 'awarding' || gameState.gamePhase === 'roundEnd') {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView style={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                console.log('GameScreen: User tapped back button during awarding');
                Alert.alert(
                  'Leave Game?',
                  'Are you sure you want to leave the game?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Leave',
                      style: 'destructive',
                      onPress: () => {
                        adManager.resetRoundCounter();
                        router.push('/(tabs)/(home)');
                      },
                    },
                  ]
                );
              }}
            >
              <IconSymbol
                ios_icon_name="chevron.left"
                android_material_icon_name="arrow-back"
                size={28}
                color={colors.text}
              />
            </TouchableOpacity>
            <View style={styles.roundInfo}>
              <Text style={[styles.roundText, { color: colors.text }]}>
                Round {gameState.roundNumber}
              </Text>
            </View>
            <View style={{ width: 44 }} />
          </View>

          <Text style={[styles.currentPlayerText, { color: colors.text }]}>
            Award Point
          </Text>

          <View style={[styles.scenarioCard, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.scenarioText, { color: colors.text }]}>
              {gameState.currentScenario?.text}
            </Text>
          </View>

          <View style={styles.playersListSection}>
            {gameState.players.map((player) => (
              <TouchableOpacity
                key={player.id}
                style={[styles.playerItem, { backgroundColor: colors.cardBackground }]}
                onPress={() => handleAwardPoint(player.id)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.playerName, { color: colors.text }]}>
                    {player.name}
                  </Text>
                  {player.selectedCard && (
                    <View style={styles.playerCardContainer}>
                      <Text style={[styles.playerCardText, { color: colors.textSecondary }]}>
                        &quot;{player.selectedCard.text}&quot;
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.playerScore, { color: colors.text }]}>
                  Score: {player.score}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {gameState.gamePhase === 'roundEnd' && (
            <View style={styles.buttonContainer}>
              <Button title="Play Again" onPress={handlePlayAgain} variant="primary" />
              <Button
                title="Back to Menu"
                onPress={() => {
                  console.log('GameScreen: User tapped Back to Menu');
                  adManager.resetRoundCounter();
                  router.push('/(tabs)/(home)');
                }}
                variant="secondary"
              />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // Render playing phase
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView ref={scrollViewRef} style={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              console.log('GameScreen: User tapped back button');
              Alert.alert(
                'Leave Game?',
                'Are you sure you want to leave the game?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Leave',
                    style: 'destructive',
                    onPress: () => {
                      adManager.resetRoundCounter();
                      router.push('/(tabs)/(home)');
                    },
                  },
                ]
              );
            }}
          >
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow-back"
              size={28}
              color={colors.text}
            />
          </TouchableOpacity>
          <View style={styles.roundInfo}>
            <Text style={[styles.roundText, { color: colors.text }]}>
              Round {gameState.roundNumber}
            </Text>
            <Text style={[styles.scoreText, { color: colors.textSecondary }]}>
              {currentPlayer?.name}: {currentPlayer?.score} pts
            </Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <View style={[styles.scenarioCard, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.scenarioText, { color: colors.text }]}>
            {gameState.currentScenario?.text}
          </Text>
        </View>

        <View style={styles.currentPlayerSection}>
          <Text style={[styles.currentPlayerText, { color: colors.text }]}>
            {currentPlayer?.name}&apos;s Turn
          </Text>

          <View style={styles.cardsGrid}>
            {currentPlayer?.hand.map((card) => (
              <View key={card.id} style={styles.cardWrapper}>
                <TouchableOpacity
                  style={[
                    styles.card,
                    { backgroundColor: colors.cardBackground, borderColor: colors.border },
                    selectedCardId === card.id && styles.selectedCard,
                  ]}
                  onPress={() => handleCardSelect(card.id)}
                >
                  <Text style={[styles.cardText, { color: colors.text }]}>
                    {card.text}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Play Card"
            onPress={handlePlayCard}
            variant="primary"
            disabled={!selectedCardId}
          />
        </View>
      </ScrollView>

      {/* Pass Phone Modal */}
      <Modal
        visible={showPassPhoneModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPassPhoneModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Image
              source={require('@/assets/images/cf8fe377-20e1-49ba-a973-c53e0228ba43.png')}
              style={{ width: 120, height: 168, marginBottom: 16, borderRadius: 12 }}
              resizeMode="cover"
            />
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Pass the Phone
            </Text>
            <Text style={[styles.modalText, { color: colors.textSecondary }]}>
              Pass the phone to {nextPlayerName}
            </Text>
            <Button title="Ready" onPress={handleReadyPress} variant="primary" />
          </View>
        </View>
      </Modal>

      {/* Ready Modal (for last player before awarding) */}
      <Modal
        visible={showReadyModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReadyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <Image
              source={require('@/assets/images/cf8fe377-20e1-49ba-a973-c53e0228ba43.png')}
              style={{ width: 120, height: 168, marginBottom: 16, borderRadius: 12 }}
              resizeMode="cover"
            />
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              All Cards Played!
            </Text>
            <Text style={[styles.modalText, { color: colors.textSecondary }]}>
              Ready to award points?
            </Text>
            <Button
              title="Ready"
              onPress={() => {
                console.log('GameScreen: User pressed Ready, transitioning to awarding phase');
                setShowReadyModal(false);
                // Transition to awarding phase
                awardPoint(''); // Empty string triggers awarding phase
              }}
              variant="primary"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
