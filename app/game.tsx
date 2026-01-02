
import { getColors } from '@/styles/commonStyles';
import { PlayerHand } from '@/components/PlayerHand';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Image } from 'react-native';
import { useGameState } from '@/hooks/useGameState';
import React, { useEffect, useState, useRef } from 'react';
import { GameCard } from '@/components/GameCard';
import { Button } from '@/components/Button';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';

export default function GameScreen() {
  const router = useRouter();
  const { playerCount, playerNames } = useLocalSearchParams();
  const { theme } = useTheme();
  const colors = getColors(theme);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Privacy control states
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [showPassPhonePrompt, setShowPassPhonePrompt] = useState(false);
  const [nextPlayerName, setNextPlayerName] = useState('');
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showRoundCompleteModal, setShowRoundCompleteModal] = useState(false);
  
  // Game interaction states
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [showExchangeOptions, setShowExchangeOptions] = useState(false);
  
  // Opacity control for smooth transitions - prevents frame leaks
  const contentOpacity = useSharedValue(0);
  
  const {
    gameState,
    initializeGame,
    playCard,
    passCard,
    exchangeCard,
    awardPoint,
    nextRound,
    restartGameWithSamePlayers,
    updateCustomText,
    changeScenarioAndContinue,
  } = useGameState();

  // Initialize game on mount
  useEffect(() => {
    if (playerCount) {
      const names = playerNames ? JSON.parse(playerNames as string) : [];
      initializeGame(parseInt(playerCount as string), names);
      
      // Set first player name and show pass phone prompt
      const firstPlayerName = names[0] || 'Player 1';
      setNextPlayerName(firstPlayerName);
      setShowPassPhonePrompt(true);
    }
  }, [playerCount, playerNames]);

  // Animate content opacity when player is ready - smooth fade prevents leaks
  useEffect(() => {
    contentOpacity.value = withTiming(isPlayerReady ? 1 : 0, { duration: 300 });
  }, [isPlayerReady]);

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  // Get current player
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const currentPlayerId = currentPlayer?.id;

  // Handle ready button press - show content after modal closes
  const handleReadyPress = () => {
    setShowPassPhonePrompt(false);
    // Small delay to ensure modal is fully closed before showing content
    setTimeout(() => {
      setIsPlayerReady(true);
    }, 100);
  };

  // Handle card selection
  const handleCardSelect = (cardId: string) => {
    if (selectedCardId === cardId) {
      setSelectedCardId(null);
    } else {
      setSelectedCardId(cardId);
    }
  };

  // Handle custom text change
  const handleCustomTextChange = (cardId: string, text: string) => {
    if (currentPlayerId) {
      updateCustomText(currentPlayerId, cardId, text);
    }
  };

  // Scroll to top when new content loads
  const scrollToTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  // Handle play card action
  const handlePlayCard = () => {
    if (!selectedCardId || !currentPlayerId) {
      Alert.alert('No Card Selected', 'Please select a card to play.');
      return;
    }

    // CRITICAL: Immediately hide content before state change
    setIsPlayerReady(false);
    contentOpacity.value = 0;
    
    // Small delay to ensure UI is hidden before state updates
    setTimeout(() => {
      playCard(currentPlayerId, selectedCardId);
      setSelectedCardId(null);
      scrollToTop();
      checkIfAllPlayersPassed();
    }, 150);
  };

  // Handle pass action
  const handlePass = () => {
    if (!currentPlayerId) return;

    // CRITICAL: Immediately hide content before state change
    setIsPlayerReady(false);
    contentOpacity.value = 0;
    
    // Small delay to ensure UI is hidden before state updates
    setTimeout(() => {
      passCard(currentPlayerId);
      scrollToTop();
      checkIfAllPlayersPassed();
    }, 150);
  };

  // Handle exchange card action
  const handleExchange = () => {
    if (!selectedCardId) {
      Alert.alert('No Card Selected', 'Please select a card to exchange.');
      return;
    }
    setShowExchangeOptions(true);
  };

  // Handle exchange with direction
  const handleExchangeWithDirection = (direction: 'previous' | 'next') => {
    if (!selectedCardId || !currentPlayerId) return;

    // CRITICAL: Immediately hide content before state change
    setIsPlayerReady(false);
    contentOpacity.value = 0;
    
    setShowExchangeOptions(false);
    
    // Small delay to ensure UI is hidden before state updates
    setTimeout(() => {
      exchangeCard(currentPlayerId, selectedCardId, direction);
      setSelectedCardId(null);
      
      // Show content again after exchange
      setTimeout(() => {
        setIsPlayerReady(true);
      }, 300);
    }, 150);
  };

  // Check if all players have played or passed
  const checkIfAllPlayersPassed = () => {
    // Wait for state to update
    setTimeout(() => {
      if (gameState.roundComplete) {
        setShowRoundCompleteModal(true);
      } else if (gameState.gameComplete) {
        setShowGameOverModal(true);
      } else {
        // Move to next player
        const nextPlayer = getNextPlayer();
        setNextPlayerName(nextPlayer.name);
        
        // Show pass phone prompt after a delay
        setTimeout(() => {
          setShowPassPhonePrompt(true);
        }, 300);
      }
    }, 200);
  };

  // Get next player
  const getNextPlayer = () => {
    const nextIndex = gameState.currentPlayerIndex;
    return gameState.players[nextIndex];
  };

  // Get previous player
  const getPreviousPlayer = () => {
    const currentIndex = gameState.currentPlayerIndex;
    const prevIndex = (currentIndex + 1) % gameState.players.length;
    return gameState.players[prevIndex];
  };

  // Get winner of the round
  const getWinner = () => {
    if (gameState.playedCards.length === 0) return null;
    
    // Filter out passes
    const actualPlays = gameState.playedCards.filter(pc => pc.card.text !== 'PASSED');
    
    if (actualPlays.length === 0) return null;
    
    // For now, just return the first player who played (you can implement voting logic here)
    return gameState.players.find(p => p.id === actualPlays[0].playerId);
  };

  // Handle awarding point
  const handleAwardPoint = (playerId: string) => {
    // CRITICAL: Hide content before state change
    setIsPlayerReady(false);
    contentOpacity.value = 0;
    
    setTimeout(() => {
      awardPoint(playerId);
      setShowRoundCompleteModal(false);
      
      // Check if game is complete
      if (gameState.gameComplete) {
        setShowGameOverModal(true);
      } else {
        // Start next round with winner as first player
        nextRound(playerId);
        
        // Show pass phone prompt for winner
        const winner = gameState.players.find(p => p.id === playerId);
        if (winner) {
          setNextPlayerName(winner.name);
          setTimeout(() => {
            setShowPassPhonePrompt(true);
          }, 500);
        }
      }
    }, 150);
  };

  // Handle play again
  const handlePlayAgain = () => {
    // CRITICAL: Reset all states and hide content
    setShowGameOverModal(false);
    setIsPlayerReady(false);
    contentOpacity.value = 0;
    setSelectedCardId(null);
    
    setTimeout(() => {
      restartGameWithSamePlayers();
      
      // Show pass phone prompt for first player
      setTimeout(() => {
        const firstPlayer = gameState.players[0];
        setNextPlayerName(firstPlayer.name);
        setShowPassPhonePrompt(true);
      }, 500);
    }, 150);
  };

  // Handle continue after all passed
  const handleContinueAfterPass = () => {
    setShowRoundCompleteModal(false);
    setIsPlayerReady(false);
    contentOpacity.value = 0;
    
    setTimeout(() => {
      changeScenarioAndContinue();
      
      // Show pass phone prompt for current player
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      setNextPlayerName(currentPlayer.name);
      setTimeout(() => {
        setShowPassPhonePrompt(true);
      }, 500);
    }, 150);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Full-screen Ready/Pass Device Modal - Blocks all content */}
      <Modal
        visible={showPassPhonePrompt}
        animationType="fade"
        transparent={false}
        onRequestClose={() => {}}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalContent}>
            <IconSymbol 
              ios_icon_name="hand.raised.fill" 
              android_material_icon_name="front-hand" 
              size={80} 
              color={colors.primary} 
            />
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Pass Device
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Hand the device to:
            </Text>
            <Text style={[styles.playerNameText, { color: colors.primary }]}>
              {nextPlayerName}
            </Text>
            <Text style={[styles.warningText, { color: colors.textSecondary }]}>
              ⚠️ Make sure they can&apos;t see the screen!
            </Text>
            <Button
              title="I'm Ready"
              onPress={handleReadyPress}
              style={styles.readyButton}
            />
          </View>
        </View>
      </Modal>

      {/* Round Complete Modal */}
      <Modal
        visible={showRoundCompleteModal}
        animationType="fade"
        transparent={false}
        onRequestClose={() => {}}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Round Complete!
            </Text>
            
            {gameState.playedCards.filter(pc => pc.card.text !== 'PASSED').length > 0 ? (
              <>
                <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                  Who had the most toxic response?
                </Text>
                
                <View style={styles.playedCardsContainer}>
                  {gameState.playedCards.map((playedCard, index) => {
                    if (playedCard.card.text === 'PASSED') return null;
                    
                    const player = gameState.players.find(p => p.id === playedCard.playerId);
                    return (
                      <View key={index} style={styles.playedCardItem}>
                        <Text style={[styles.playerLabel, { color: colors.primary }]}>
                          {player?.name}
                        </Text>
                        <GameCard
                          text={playedCard.card.customText || playedCard.card.text}
                          type="response"
                        />
                        <Button
                          title="Award Point"
                          onPress={() => handleAwardPoint(playedCard.playerId)}
                          variant="accent"
                          style={styles.awardButton}
                        />
                      </View>
                    );
                  })}
                </View>
              </>
            ) : (
              <>
                <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                  All players passed! Moving to next scenario...
                </Text>
                <Button
                  title="Continue"
                  onPress={handleContinueAfterPass}
                  style={styles.continueButton}
                />
              </>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Game Over Modal */}
      <Modal
        visible={showGameOverModal}
        animationType="fade"
        transparent={false}
        onRequestClose={() => {}}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalContent}>
            <IconSymbol 
              ios_icon_name="trophy.fill" 
              android_material_icon_name="emoji-events" 
              size={80} 
              color={colors.primary} 
            />
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Game Over!
            </Text>
            
            <View style={styles.scoresContainer}>
              <Text style={[styles.scoresTitle, { color: colors.textSecondary }]}>
                Final Scores:
              </Text>
              {gameState.players
                .sort((a, b) => b.score - a.score)
                .map((player, index) => (
                  <View key={player.id} style={styles.scoreRow}>
                    <Text style={[styles.scoreRank, { color: colors.primary }]}>
                      {index + 1}.
                    </Text>
                    <Text style={[styles.scoreName, { color: colors.text }]}>
                      {player.name}
                    </Text>
                    <Text style={[styles.scorePoints, { color: colors.accent }]}>
                      {player.score} pts
                    </Text>
                  </View>
                ))}
            </View>
            
            <Button 
              title="Play Again" 
              onPress={handlePlayAgain}
              style={styles.playAgainButton}
            />
            <Button 
              title="Exit" 
              onPress={() => router.back()}
              variant="secondary"
              style={styles.exitButton}
            />
          </View>
        </View>
      </Modal>

      {/* Exchange Options Modal */}
      <Modal
        visible={showExchangeOptions}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowExchangeOptions(false)}
      >
        <View style={styles.exchangeModalOverlay}>
          <View style={[styles.exchangeModalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.exchangeTitle, { color: colors.text }]}>
              Exchange with which player?
            </Text>
            <Button
              title={`Previous Player (${getPreviousPlayer()?.name})`}
              onPress={() => handleExchangeWithDirection('previous')}
              style={styles.exchangeButton}
            />
            <Button
              title={`Next Player (${getNextPlayer()?.name})`}
              onPress={() => handleExchangeWithDirection('next')}
              style={styles.exchangeButton}
            />
            <Button
              title="Cancel"
              onPress={() => setShowExchangeOptions(false)}
              variant="secondary"
              style={styles.exchangeButton}
            />
          </View>
        </View>
      </Modal>

      {/* Game Content - Only visible when isPlayerReady is true */}
      {!showPassPhonePrompt && !showGameOverModal && !showRoundCompleteModal && (
        <Animated.View 
          style={[styles.gameContent, animatedContentStyle]}
          pointerEvents={isPlayerReady ? 'auto' : 'none'}
        >
          <ScrollView ref={scrollViewRef} style={styles.scrollView}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity 
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <IconSymbol 
                  ios_icon_name="chevron.left" 
                  android_material_icon_name="arrow-back" 
                  size={24} 
                  color={colors.text} 
                />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Round {gameState.round}
              </Text>
              <View style={styles.headerSpacer} />
            </View>

            {/* Current Player Info */}
            <View style={styles.playerInfo}>
              <Text style={[styles.currentPlayerLabel, { color: colors.textSecondary }]}>
                Current Player:
              </Text>
              <Text style={[styles.currentPlayerName, { color: colors.primary }]}>
                {currentPlayer?.name}
              </Text>
            </View>

            {/* Scenario Card */}
            {gameState.currentScenario && (
              <View style={styles.scenarioContainer}>
                <GameCard
                  text={gameState.currentScenario.text}
                  type="scenario"
                />
              </View>
            )}

            {/* Player Hand */}
            {currentPlayer && (
              <PlayerHand
                cards={currentPlayer.hand}
                onCardPress={handleCardSelect}
                selectedCardId={selectedCardId || undefined}
                onCustomTextChange={handleCustomTextChange}
              />
            )}

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <Button
                title="Play Card"
                onPress={handlePlayCard}
                disabled={!selectedCardId}
                style={styles.actionButton}
              />
              
              {currentPlayer && !currentPlayer.hasExchanged && (
                <Button
                  title="Exchange Card"
                  onPress={handleExchange}
                  disabled={!selectedCardId}
                  variant="secondary"
                  style={styles.actionButton}
                />
              )}
              
              <Button
                title="Pass"
                onPress={handlePass}
                variant="secondary"
                style={styles.actionButton}
              />
            </View>

            {/* Scores */}
            <View style={styles.scoresSection}>
              <Text style={[styles.scoresSectionTitle, { color: colors.text }]}>
                Scores
              </Text>
              {gameState.players.map((player) => (
                <View key={player.id} style={styles.scoreItem}>
                  <Text style={[styles.scorePlayerName, { color: colors.text }]}>
                    {player.name}
                  </Text>
                  <Text style={[styles.scorePlayerPoints, { color: colors.primary }]}>
                    {player.score} pts
                  </Text>
                </View>
              ))}
            </View>

            {/* Bottom Padding */}
            <View style={styles.bottomPadding} />
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameContent: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 40,
  },
  playerInfo: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  currentPlayerLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  currentPlayerName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scenarioContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  actionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  actionButton: {
    width: '100%',
  },
  scoresSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  scoresSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  scorePlayerName: {
    fontSize: 16,
  },
  scorePlayerPoints: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    alignItems: 'center',
    gap: 20,
    maxWidth: 400,
  },
  modalScrollContent: {
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  playerNameText: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  warningText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  readyButton: {
    marginTop: 20,
  },
  playedCardsContainer: {
    gap: 24,
    marginTop: 20,
    width: '100%',
  },
  playedCardItem: {
    alignItems: 'center',
    gap: 12,
  },
  playerLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  awardButton: {
    minWidth: 150,
  },
  continueButton: {
    marginTop: 20,
  },
  scoresContainer: {
    width: '100%',
    gap: 12,
    marginTop: 20,
  },
  scoresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreRank: {
    fontSize: 20,
    fontWeight: 'bold',
    width: 30,
  },
  scoreName: {
    fontSize: 18,
    flex: 1,
  },
  scorePoints: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  playAgainButton: {
    marginTop: 20,
  },
  exitButton: {
    marginTop: 12,
  },
  exchangeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  exchangeModalContent: {
    borderRadius: 12,
    padding: 24,
    gap: 16,
    minWidth: 300,
  },
  exchangeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  exchangeButton: {
    width: '100%',
  },
});
