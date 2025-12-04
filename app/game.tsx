
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Image, useColorScheme } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getColors } from '@/styles/commonStyles';
import { useGameState } from '@/hooks/useGameState';
import { GameCard } from '@/components/GameCard';
import { PlayerHand } from '@/components/PlayerHand';
import { Button } from '@/components/Button';
import { IconSymbol } from '@/components/IconSymbol';

export default function GameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);
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
    restartGameWithSamePlayers,
    updateCustomText,
    changeScenarioAndContinue,
  } = useGameState();

  const [selectedCardId, setSelectedCardId] = useState<string | undefined>();
  const [showExchangeOptions, setShowExchangeOptions] = useState(false);
  const [showPassPhoneModal, setShowPassPhoneModal] = useState(false);
  const [nextPlayerName, setNextPlayerName] = useState('');
  const [showPointSelection, setShowPointSelection] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);

  useEffect(() => {
    initializeGame(playerCount, playerNames);
  }, [playerCount, initializeGame]);

  // Removed the automatic game completion check - we'll handle it after point is awarded

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

  const checkIfAllPlayersPassed = () => {
    // Check if all played cards are "PASSED" entries
    return gameState.playedCards.length === gameState.players.length &&
           gameState.playedCards.every(played => played.card.text === 'PASSED');
  };

  const getWinner = () => {
    if (gameState.players.length === 0) return null;
    
    const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
    const highestScore = sortedPlayers[0].score;
    const winners = sortedPlayers.filter(p => p.score === highestScore);
    
    return {
      winners,
      isTie: winners.length > 1,
      highestScore,
    };
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

    // Check if all players have now played
    const willBeRoundComplete = gameState.playedCards.length + 1 === gameState.players.length;
    
    if (willBeRoundComplete) {
      // All players have answered - show point selection
      setTimeout(() => {
        setShowPointSelection(true);
      }, 200);
    } else {
      // More players need to answer - show pass phone modal
      const nextPlayerIndex = gameState.currentPlayerIndex - 1 < 0 
        ? gameState.players.length - 1 
        : gameState.currentPlayerIndex - 1;
      const nextPlayer = gameState.players[nextPlayerIndex];
      
      setTimeout(() => {
        showPassPhonePrompt(nextPlayer.name);
      }, 200);
    }
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
      'Are you sure you want to pass? The game will continue to the next player.',
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

            // Check if all players have now played or passed
            const willBeRoundComplete = gameState.playedCards.length + 1 === gameState.players.length;
            
            if (willBeRoundComplete) {
              // Check if all players passed
              const willAllPass = gameState.playedCards.every(played => played.card.text === 'PASSED');
              
              if (willAllPass) {
                // All players passed - change scenario and continue
                setTimeout(() => {
                  if (gameState.scenarioDeck.length === 0) {
                    Alert.alert(
                      'Game Over!',
                      'All players passed and there are no more scenarios. Check the scores to see who won!',
                      [
                        {
                          text: 'View Final Scores',
                          onPress: () => {
                            setShowGameOverModal(true);
                          },
                        },
                      ]
                    );
                  } else {
                    Alert.alert(
                      'All Players Passed!',
                      'Everyone passed on this scenario. A new scenario will be presented.',
                      [
                        {
                          text: 'Continue',
                          onPress: () => {
                            changeScenarioAndContinue();
                            
                            // Scroll to top after changing scenario
                            setTimeout(() => {
                              scrollToTop();
                            }, 100);

                            // Show pass phone prompt for the next player
                            setTimeout(() => {
                              showPassPhonePrompt(nextPlayer.name);
                            }, 200);
                          },
                        },
                      ]
                    );
                  }
                }, 200);
              } else {
                // Some players played cards - show point selection
                setTimeout(() => {
                  setShowPointSelection(true);
                }, 200);
              }
            } else {
              // Show pass phone prompt for next player
              setTimeout(() => {
                showPassPhonePrompt(nextPlayer.name);
              }, 200);
            }
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

    // Award the point first
    awardPoint(playerId);
    setShowPointSelection(false);
    
    // Wait for state to update, then check game completion
    setTimeout(() => {
      // Re-check the updated game state after the point has been awarded
      // We need to check the players' hands to see if anyone is out of cards
      const anyPlayerOutOfCards = gameState.players.some(p => p.id === playerId ? player.hand.length === 0 : p.hand.length === 0);
      
      if (anyPlayerOutOfCards) {
        // Game is complete - show winner announcement
        console.log('Game complete after awarding point - a player has no cards left');
        setTimeout(() => {
          setShowGameOverModal(true);
        }, 500);
      } else if (gameState.scenarioDeck.length === 0) {
        // No more scenarios but players still have cards
        Alert.alert(
          'Game Over!',
          `${player.name} wins the final round! Check the scores to see who won the game.`,
          [
            {
              text: 'View Final Scores',
              onPress: () => {
                setShowGameOverModal(true);
              },
            },
          ]
        );
      } else {
        // Continue to next round
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
    }, 100);
  };

  const handlePlayAgain = () => {
    console.log('Play Again pressed - restarting with same players');
    setShowGameOverModal(false);
    
    // Use the new function to restart with same players
    restartGameWithSamePlayers();
    
    // Scroll to top after restarting
    setTimeout(() => {
      scrollToTop();
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
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading game...</Text>
      </View>
    );
  }

  const winnerInfo = getWinner();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.primary }]}>
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
          <Text style={[styles.roundText, { color: colors.textSecondary }]}>Round {gameState.round}</Text>
          <Text style={[styles.playerTurnText, { color: colors.primary }]}>
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
            <Text style={[styles.scenarioLabel, { color: colors.textSecondary }]}>Current Scenario</Text>
            <GameCard
              text={gameState.currentScenario.text}
              type="scenario"
            />
          </View>
        )}

        {showPointSelection ? (
          <View style={styles.pointSelectionContainer}>
            <Text style={[styles.pointSelectionTitle, { color: colors.primary }]}>Who Gets the Point? 🏆</Text>
            <Text style={[styles.pointSelectionSubtitle, { color: colors.textSecondary }]}>
              All players have responded! Review the cards and award a point.
            </Text>
            
            <View style={styles.playedCardsContainer}>
              {gameState.playedCards.map((played, index) => {
                const player = gameState.players.find(p => p.id === played.playerId);
                const isPassed = played.card.text === 'PASSED';
                
                if (isPassed) {
                  return (
                    <View key={index} style={[styles.playedCardItem, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                      <Text style={[styles.playedCardPlayer, { color: colors.primary }]}>{player?.name}</Text>
                      <View style={[styles.playedCardWrapper, styles.passedCardWrapper, { backgroundColor: colors.textSecondary }]}>
                        <Text style={[styles.passedCardText, { color: colors.background }]}>⏭️ PASSED</Text>
                      </View>
                    </View>
                  );
                }
                
                const displayText = played.card.isCustom && played.card.customText 
                  ? played.card.customText 
                  : played.card.text;
                
                return (
                  <View key={index} style={[styles.playedCardItem, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                    <Text style={[styles.playedCardPlayer, { color: colors.primary }]}>{player?.name}</Text>
                    <View style={[styles.playedCardWrapper, { backgroundColor: colorScheme === 'dark' ? '#ffffff' : '#ffffff', borderColor: colors.cardBorder }]}>
                      <Text style={[styles.playedCardText, { color: '#000000' }]}>{displayText}</Text>
                      {played.card.isCustom && (
                        <Text style={[styles.customBadge, { color: colors.accent }]}>✏️ Custom</Text>
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
          </View>
        ) : (
          <>
            <View style={[styles.scoresContainer, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Text style={[styles.scoresTitle, { color: colors.text }]}>Scores</Text>
              <View style={styles.scoresGrid}>
                {gameState.players.map((player, index) => (
                  <View key={index} style={styles.scoreItem}>
                    <Text style={[styles.scorePlayerName, { color: colors.textSecondary }]}>{player.name}</Text>
                    <Text style={[styles.scoreValue, { color: colors.primary }]}>{player.score}</Text>
                    <Text style={[styles.cardsLeftText, { color: colors.textSecondary }]}>
                      {player.hand.length} {player.hand.length === 1 ? 'card' : 'cards'} left
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {showExchangeOptions ? (
              <View style={styles.exchangeContainer}>
                <Text style={[styles.exchangeTitle, { color: colors.text }]}>Exchange card with:</Text>
                <Text style={[styles.exchangeSubtitle, { color: colors.textSecondary }]}>
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
          <View style={[styles.modalContent, { backgroundColor: colors.card, borderColor: colors.primary }]}>
            <View style={styles.modalIconContainer}>
              <IconSymbol
                ios_icon_name="arrow.triangle.2.circlepath"
                android_material_icon_name="sync"
                size={64}
                color={colors.primary}
              />
            </View>
            
            <Text style={[styles.modalTitle, { color: colors.primary }]}>Pass the Phone!</Text>
            <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>
              Please pass the phone to
            </Text>
            <Text style={[styles.modalPlayerName, { color: colors.text }]}>{nextPlayerName}</Text>
            
            <Button
              title="Ready"
              onPress={() => setShowPassPhoneModal(false)}
              variant="primary"
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      {/* Game Over Modal */}
      <Modal
        visible={showGameOverModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowGameOverModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.gameOverModalContent, { backgroundColor: colors.card, borderColor: colors.accent }]}>
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/0ed37ab6-3363-4785-9333-7f6211c02e59.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            
            <Text style={[styles.gameOverTitle, { color: colors.accent }]}>Game Over!</Text>
            
            {winnerInfo && (
              <>
                {winnerInfo.isTie ? (
                  <>
                    <Text style={[styles.gameOverSubtitle, { color: colors.primary }]}>It&apos;s a Tie!</Text>
                    <View style={styles.winnersContainer}>
                      {winnerInfo.winners.map((winner, index) => (
                        <Text key={index} style={[styles.winnerName, { color: colors.text }]}>
                          {winner.name}
                        </Text>
                      ))}
                    </View>
                    <Text style={[styles.winnerScore, { color: colors.primary }]}>
                      {winnerInfo.highestScore} {winnerInfo.highestScore === 1 ? 'point' : 'points'}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={[styles.gameOverSubtitle, { color: colors.primary }]}>Toxic Winner!</Text>
                    <Text style={[styles.winnerName, { color: colors.text }]}>{winnerInfo.winners[0].name}</Text>
                    <Text style={[styles.winnerScore, { color: colors.primary }]}>
                      {winnerInfo.highestScore} {winnerInfo.highestScore === 1 ? 'point' : 'points'}
                    </Text>
                  </>
                )}
              </>
            )}
            
            <View style={[styles.finalScoresContainer, { backgroundColor: colors.background, borderColor: colors.cardBorder }]}>
              <Text style={[styles.finalScoresTitle, { color: colors.text }]}>Final Scores</Text>
              {gameState.players
                .sort((a, b) => b.score - a.score)
                .map((player, index) => (
                  <View key={index} style={[styles.finalScoreItem, { borderBottomColor: colors.cardBorder }]}>
                    <Text style={[styles.finalScoreRank, { color: colors.textSecondary }]}>#{index + 1}</Text>
                    <Text style={[styles.finalScorePlayerName, { color: colors.text }]}>{player.name}</Text>
                    <Text style={[styles.finalScoreValue, { color: colors.primary }]}>{player.score}</Text>
                  </View>
                ))}
            </View>
            
            <Button
              title="Play Again"
              onPress={handlePlayAgain}
              variant="primary"
              style={styles.playAgainButton}
            />
            
            <Button
              title="Back to Home"
              onPress={() => {
                setShowGameOverModal(false);
                resetGame();
                router.replace('/(tabs)/(home)/');
              }}
              variant="secondary"
              style={styles.playAgainButton}
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
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
  },
  backButton: {
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  roundText: {
    fontSize: 14,
    fontWeight: '600',
  },
  playerTurnText: {
    fontSize: 20,
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
    marginBottom: 12,
    textAlign: 'center',
  },
  scoresContainer: {
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 2,
  },
  scoresTitle: {
    fontSize: 18,
    fontWeight: '700',
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
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: '900',
  },
  cardsLeftText: {
    fontSize: 11,
    marginTop: 2,
    fontStyle: 'italic',
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
    marginBottom: 4,
    textAlign: 'center',
  },
  exchangeSubtitle: {
    fontSize: 14,
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
    textAlign: 'center',
    marginBottom: 8,
  },
  pointSelectionSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  playedCardsContainer: {
    gap: 20,
    marginBottom: 24,
  },
  playedCardItem: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  playedCardPlayer: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  playedCardWrapper: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    minHeight: 80,
    justifyContent: 'center',
  },
  passedCardWrapper: {
    opacity: 0.6,
  },
  playedCardText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  passedCardText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  customBadge: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
  awardButton: {
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 3,
  },
  modalIconContainer: {
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalPlayerName: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 32,
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
    minWidth: 200,
  },
  gameOverModalContent: {
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 450,
    alignItems: 'center',
    borderWidth: 3,
  },
  logoContainer: {
    marginBottom: 24,
    width: 520,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  gameOverTitle: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
  },
  gameOverSubtitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  winnersContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  winnerName: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginVertical: 4,
  },
  winnerScore: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  finalScoresContainer: {
    width: '100%',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
  },
  finalScoresTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  finalScoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  finalScoreRank: {
    fontSize: 16,
    fontWeight: '700',
    width: 40,
  },
  finalScorePlayerName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  finalScoreValue: {
    fontSize: 20,
    fontWeight: '900',
    minWidth: 40,
    textAlign: 'right',
  },
  playAgainButton: {
    width: '100%',
    marginTop: 8,
  },
});
