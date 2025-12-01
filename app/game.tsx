
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { useGameState } from '@/hooks/useGameState';
import { GameCard } from '@/components/GameCard';
import { PlayerHand } from '@/components/PlayerHand';
import { Button } from '@/components/Button';
import { IconSymbol } from '@/components/IconSymbol';

export default function GameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const playerCount = parseInt(params.playerCount as string) || 4;
  const playerNamesParam = params.playerNames as string;
  const scrollViewRef = useRef<ScrollView>(null);
  
  let playerNames: string[] = [];
  try {
    playerNames = playerNamesParam ? JSON.parse(playerNamesParam) : [];
  } catch (e) {
    console.log('Error parsing player names:', e);
  }
  
  if (playerNames.length === 0) {
    playerNames = Array.from({ length: playerCount }, (_, i) => `Player ${i + 1}`);
  }
  
  const {
    gameState,
    initializeGame,
    playCard,
    passCard,
    exchangeCard,
    nextRound,
    awardPoint,
    resetGame,
    updateCustomText,
  } = useGameState();

  const [selectedCardId, setSelectedCardId] = useState<string | undefined>();
  const [showExchangeOptions, setShowExchangeOptions] = useState(false);
  const [showPassPhoneModal, setShowPassPhoneModal] = useState(false);
  const [nextPlayerName, setNextPlayerName] = useState('');
  const [showPointSelection, setShowPointSelection] = useState(false);

  useEffect(() => {
    initializeGame(playerCount, playerNames);
  }, [playerCount, initializeGame]);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  const handleCardSelect = (cardId: string) => {
    setSelectedCardId(cardId);
  };

  const handleCustomTextChange = (cardId: string, text: string) => {
    if (currentPlayer) {
      updateCustomText(currentPlayer.id, cardId, text);
    }
  };

  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  const showPassPhonePrompt = (nextPlayer: string) => {
    setNextPlayerName(nextPlayer);
    setShowPassPhoneModal(true);
  };

  const handlePlayCard = () => {
    if (!selectedCardId || !currentPlayer) {
      console.log('No card selected or no current player');
      return;
    }

    const selectedCard = currentPlayer.hand.find(c => c.id === selectedCardId);
    if (selectedCard?.isCustom && (!selectedCard.customText || selectedCard.customText.trim() === '')) {
      Alert.alert(
        'Custom Response Required',
        'Please type your custom response before playing this card.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    playCard(currentPlayer.id, selectedCardId);
    setSelectedCardId(undefined);
    
    // Scroll to top after playing the card
    setTimeout(() => {
      scrollToTop();
    }, 100);

    // Show point selection after card is played
    setTimeout(() => {
      setShowPointSelection(true);
    }, 200);
  };

  const handlePass = () => {
    if (!currentPlayer) {
      console.log('No current player');
      return;
    }
    
    // Calculate next player
    let nextPlayerIndex = gameState.currentPlayerIndex - 1;
    if (nextPlayerIndex < 0) {
      nextPlayerIndex = gameState.players.length - 1;
    }
    const nextPlayer = gameState.players[nextPlayerIndex];
    
    Alert.alert(
      'Pass Turn',
      `Are you sure you want to pass? ${nextPlayer.name} will receive a point and a new round will begin.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pass',
          onPress: () => {
            passCard(currentPlayer.id);
            setSelectedCardId(undefined);
            
            // Scroll to top after passing
            setTimeout(() => {
              scrollToTop();
            }, 100);

            // Show pass phone prompt
            setTimeout(() => {
              showPassPhonePrompt(nextPlayer.name);
            }, 200);
          },
        },
      ]
    );
  };

  const handleExchange = () => {
    if (!currentPlayer || currentPlayer.hasExchanged) {
      Alert.alert('Exchange Not Available', 'You have already exchanged a card this round.');
      return;
    }

    if (!selectedCardId) {
      Alert.alert('Select a Card', 'Please select a card from your hand to exchange.');
      return;
    }
    
    setShowExchangeOptions(true);
  };

  const handleExchangeWithDirection = (direction: 'previous' | 'next') => {
    if (!selectedCardId || !currentPlayer) {
      Alert.alert('Select a Card', 'Please select a card from your hand to exchange.');
      setShowExchangeOptions(false);
      return;
    }

    // Calculate the target player index
    const currentIndex = gameState.currentPlayerIndex;
    let targetIndex: number;
    
    if (direction === 'previous') {
      // Previous player (counterclockwise, so +1)
      targetIndex = (currentIndex + 1) % gameState.players.length;
    } else {
      // Next player (clockwise, so -1)
      targetIndex = currentIndex - 1;
      if (targetIndex < 0) {
        targetIndex = gameState.players.length - 1;
      }
    }
    
    const targetPlayer = gameState.players[targetIndex];
    
    Alert.alert(
      'Exchange Card',
      `Exchange your selected card with a random card from ${targetPlayer.name}?`,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setShowExchangeOptions(false) },
        {
          text: 'Exchange',
          onPress: () => {
            exchangeCard(currentPlayer.id, selectedCardId, direction);
            setSelectedCardId(undefined);
            setShowExchangeOptions(false);
          },
        },
      ]
    );
  };

  const handleAwardPoint = (playerId: string) => {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) {
      console.log('Player not found');
      return;
    }

    awardPoint(playerId);
    setShowPointSelection(false);
    
    setTimeout(() => {
      if (gameState.scenarioDeck.length === 0) {
        Alert.alert(
          'Game Over!',
          `${player.name} wins the final round! Check the scores to see who won the game.`,
          [
            {
              text: 'View Final Scores',
              onPress: () => {
                console.log('Viewing final scores');
              },
            },
            {
              text: 'New Game',
              onPress: () => {
                resetGame();
                router.replace('/(tabs)/(home)/');
              },
            },
          ]
        );
      } else {
        nextRound();
        
        // Scroll to top after awarding point and starting new round
        setTimeout(() => {
          scrollToTop();
        }, 100);

        // Show pass phone prompt for the first player of the new round
        setTimeout(() => {
          const firstPlayer = gameState.players[gameState.currentPlayerIndex];
          if (firstPlayer) {
            showPassPhonePrompt(firstPlayer.name);
          }
        }, 200);
      }
    }, 1500);
  };

  const handleContinueWithoutPoint = () => {
    setShowPointSelection(false);
    
    // Check if all players have played
    if (gameState.roundComplete) {
      // If round is complete, we should show point selection again
      setShowPointSelection(true);
      return;
    }
    
    // Show pass phone prompt for next player
    setTimeout(() => {
      const nextPlayer = getNextPlayer();
      if (nextPlayer) {
        showPassPhonePrompt(nextPlayer.name);
      }
    }, 100);
  };

  // Get previous and next player names for display
  const getPreviousPlayer = () => {
    const prevIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    return gameState.players[prevIndex];
  };

  const getNextPlayer = () => {
    let nextIndex = gameState.currentPlayerIndex - 1;
    if (nextIndex < 0) {
      nextIndex = gameState.players.length - 1;
    }
    return gameState.players[nextIndex];
  };

  if (!gameState.gameStarted || !currentPlayer) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading game...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Alert.alert(
              'Quit Game',
              'Are you sure you want to quit? Game progress will be lost.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Quit',
                  style: 'destructive',
                  onPress: () => {
                    resetGame();
                    router.replace('/(tabs)/(home)/');
                  },
                },
              ]
            );
          }}
        >
          <IconSymbol
            ios_icon_name="xmark.circle.fill"
            android_material_icon_name="close"
            size={28}
            color={colors.primary}
          />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.roundText}>Round {gameState.round}</Text>
          <Text style={styles.playerTurnText}>
            {currentPlayer.name}&apos;s Turn
          </Text>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
      >
        {gameState.currentScenario && (
          <View style={styles.scenarioContainer}>
            <Text style={styles.scenarioLabel}>Current Scenario</Text>
            <GameCard
              text={gameState.currentScenario.text}
              type="scenario"
            />
          </View>
        )}

        {showPointSelection ? (
          <View style={styles.pointSelectionContainer}>
            <Text style={styles.pointSelectionTitle}>Who Gets the Point? 🏆</Text>
            <Text style={styles.pointSelectionSubtitle}>
              {gameState.roundComplete 
                ? 'All players have answered! Review the cards and award a point.'
                : 'Review the played cards so far and decide if anyone deserves a point, or continue playing.'}
            </Text>
            
            <View style={styles.playedCardsContainer}>
              {gameState.playedCards.map((played, index) => {
                const player = gameState.players.find(p => p.id === played.playerId);
                const displayText = played.card.isCustom && played.card.customText 
                  ? played.card.customText 
                  : played.card.text;
                
                return (
                  <View key={index} style={styles.playedCardItem}>
                    <Text style={styles.playedCardPlayer}>{player?.name}</Text>
                    <View style={styles.playedCardWrapper}>
                      <Text style={styles.playedCardText}>{displayText}</Text>
                      {played.card.isCustom && (
                        <Text style={styles.customBadge}>✏️ Custom</Text>
                      )}
                    </View>
                    <Button
                      title="Award Point"
                      onPress={() => handleAwardPoint(played.playerId)}
                      variant="accent"
                      style={styles.awardButton}
                    />
                  </View>
                );
              })}
            </View>

            {!gameState.roundComplete && (
              <Button
                title="Continue Playing (No Point Yet)"
                onPress={handleContinueWithoutPoint}
                variant="secondary"
                style={styles.continueButton}
              />
            )}
          </View>
        ) : (
          <>
            <View style={styles.scoresContainer}>
              <Text style={styles.scoresTitle}>Scores</Text>
              <View style={styles.scoresGrid}>
                {gameState.players.map((player, index) => (
                  <View key={index} style={styles.scoreItem}>
                    <Text style={styles.scorePlayerName}>{player.name}</Text>
                    <Text style={styles.scoreValue}>{player.score}</Text>
                  </View>
                ))}
              </View>
            </View>

            {gameState.playedCards.length > 0 && (
              <View style={styles.playedCardsPreviewContainer}>
                <Text style={styles.playedCardsPreviewTitle}>Played Cards This Round</Text>
                {gameState.playedCards.map((played, index) => {
                  const player = gameState.players.find(p => p.id === played.playerId);
                  const displayText = played.card.isCustom && played.card.customText 
                    ? played.card.customText 
                    : played.card.text;
                  
                  return (
                    <View key={index} style={styles.playedCardPreviewItem}>
                      <Text style={styles.playedCardPreviewPlayer}>{player?.name}</Text>
                      <View style={styles.playedCardPreviewWrapper}>
                        <Text style={styles.playedCardPreviewText}>{displayText}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {showExchangeOptions ? (
              <View style={styles.exchangeContainer}>
                <Text style={styles.exchangeTitle}>Exchange card with:</Text>
                <Text style={styles.exchangeSubtitle}>
                  Choose to exchange with the previous or next player
                </Text>
                
                <Button
                  title={`← Previous Player (${getPreviousPlayer().name})`}
                  onPress={() => handleExchangeWithDirection('previous')}
                  variant="secondary"
                  style={styles.exchangeButton}
                />
                
                <Button
                  title={`Next Player (${getNextPlayer().name}) →`}
                  onPress={() => handleExchangeWithDirection('next')}
                  variant="secondary"
                  style={styles.exchangeButton}
                />
                
                <Button
                  title="Cancel"
                  onPress={() => setShowExchangeOptions(false)}
                  variant="accent"
                  style={styles.exchangeButton}
                />
              </View>
            ) : (
              <>
                <PlayerHand
                  cards={currentPlayer.hand}
                  onCardPress={handleCardSelect}
                  selectedCardId={selectedCardId}
                  onCustomTextChange={handleCustomTextChange}
                />

                <View style={styles.actionsContainer}>
                  <Button
                    title="Play Card"
                    onPress={handlePlayCard}
                    variant="primary"
                    disabled={!selectedCardId}
                    style={styles.actionButton}
                  />
                  <Button
                    title={currentPlayer.hasExchanged ? "Already Exchanged" : "Exchange Card"}
                    onPress={handleExchange}
                    variant="secondary"
                    disabled={currentPlayer.hasExchanged || !selectedCardId}
                    style={styles.actionButton}
                  />
                  <Button
                    title="Pass"
                    onPress={handlePass}
                    variant="accent"
                    style={styles.actionButton}
                  />
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Pass Phone Modal */}
      <Modal
        visible={showPassPhoneModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPassPhoneModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <IconSymbol
                ios_icon_name="arrow.triangle.2.circlepath"
                android_material_icon_name="sync"
                size={64}
                color={colors.primary}
              />
            </View>
            
            <Text style={styles.modalTitle}>Pass the Phone!</Text>
            <Text style={styles.modalMessage}>
              Please pass the phone to
            </Text>
            <Text style={styles.modalPlayerName}>{nextPlayerName}</Text>
            
            <Button
              title="Ready"
              onPress={() => setShowPassPhoneModal(false)}
              variant="primary"
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    fontSize: 18,
    color: colors.text,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  backButton: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  roundText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  playerTurnText: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  scenarioContainer: {
    padding: 20,
  },
  scenarioLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  scoresContainer: {
    padding: 20,
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.cardBorder,
  },
  scoresTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  scoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  scoreItem: {
    alignItems: 'center',
    minWidth: 80,
    marginVertical: 8,
  },
  scorePlayerName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
  },
  playedCardsPreviewContainer: {
    padding: 20,
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.cardBorder,
  },
  playedCardsPreviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  playedCardPreviewItem: {
    marginBottom: 12,
  },
  playedCardPreviewPlayer: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
  },
  playedCardPreviewWrapper: {
    backgroundColor: colors.darkGreen,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.cardBorder,
  },
  playedCardPreviewText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 20,
  },
  actionsContainer: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    width: '100%',
  },
  exchangeContainer: {
    padding: 20,
    gap: 12,
  },
  exchangeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  exchangeSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  exchangeButton: {
    width: '100%',
  },
  pointSelectionContainer: {
    padding: 20,
  },
  pointSelectionTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  pointSelectionSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  playedCardsContainer: {
    gap: 20,
    marginBottom: 24,
  },
  playedCardItem: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.cardBorder,
  },
  playedCardPlayer: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  playedCardWrapper: {
    backgroundColor: colors.darkGreen,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    minHeight: 80,
    justifyContent: 'center',
  },
  playedCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  customBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    textAlign: 'center',
    marginTop: 8,
  },
  awardButton: {
    marginTop: 12,
  },
  continueButton: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  modalIconContainer: {
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalPlayerName: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
    minWidth: 200,
  },
});
