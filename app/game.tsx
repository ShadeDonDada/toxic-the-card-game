
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/styles/commonStyles';
import { Button } from '@/components/Button';
import { IconSymbol } from '@/components/IconSymbol';
import { useGameState } from '@/hooks/useGameState';
import { ResponseCard } from '@/types/game';
import { GameCard } from '@/components/GameCard';
import { PlayerHand } from '@/components/PlayerHand';

const { width: screenWidth } = Dimensions.get('window');

export default function GameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { effectiveColorScheme } = useTheme();
  const colors = getColors(effectiveColorScheme);

  const playerCount = parseInt(params.playerCount as string) || 4;
  const playerNames = params.playerNames
    ? JSON.parse(params.playerNames as string)
    : Array.from({ length: playerCount }, (_, i) => `Player ${i + 1}`);

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

  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [selectedCardForExchange, setSelectedCardForExchange] = useState<string | null>(null);
  const [showCustomTextModal, setShowCustomTextModal] = useState(false);
  const [selectedCustomCard, setSelectedCustomCard] = useState<ResponseCard | null>(null);
  const [customText, setCustomText] = useState('');
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [selectedWinnerId, setSelectedWinnerId] = useState<string | null>(null);

  useEffect(() => {
    console.log('Game screen mounted with params:', { playerCount, playerNames });
    if (!gameState.gameStarted) {
      console.log('Initializing game...');
      initializeGame(playerCount, playerNames);
    }
  }, []);

  useEffect(() => {
    console.log('Game state updated:', {
      currentPlayerIndex: gameState.currentPlayerIndex,
      playedCards: gameState.playedCards.length,
      roundComplete: gameState.roundComplete,
      gameComplete: gameState.gameComplete,
    });
  }, [gameState]);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const currentPlayerId = currentPlayer?.id;

  const handleReadyPress = () => {
    console.log('Player ready, showing cards');
    setIsPlayerReady(true);
  };

  const handlePassToNextPlayer = () => {
    console.log('Passing to next player');
    setIsPlayerReady(false);
  };

  const handleCardPress = (card: ResponseCard) => {
    console.log('Card pressed:', card.id, card.text);

    if (card.isCustom && (!card.customText || card.customText.trim() === '')) {
      console.log('Custom card needs text');
      setSelectedCustomCard(card);
      setCustomText('');
      setShowCustomTextModal(true);
      return;
    }

    playCard(currentPlayerId, card.id);
    setIsPlayerReady(false);
  };

  const handlePassTurn = () => {
    console.log('Player passing turn');
    Alert.alert(
      'Pass Turn',
      'Are you sure you want to pass this turn? You cannot make a sensible response.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pass',
          style: 'destructive',
          onPress: () => {
            passCard(currentPlayerId);
            setIsPlayerReady(false);
          },
        },
      ]
    );
  };

  const handleExchangeRequest = (card: ResponseCard) => {
    console.log('Exchange request for card:', card.id);

    if (currentPlayer.hasExchanged) {
      Alert.alert('Already Exchanged', 'You can only exchange one card per round.');
      return;
    }

    setSelectedCardForExchange(card.id);
    setShowExchangeModal(true);
  };

  const handleExchangeWithDirection = (direction: 'previous' | 'next') => {
    if (!selectedCardForExchange) return;

    const currentPlayerIndex = gameState.currentPlayerIndex;
    let targetPlayerIndex: number;

    if (direction === 'previous') {
      targetPlayerIndex = (currentPlayerIndex + 1) % gameState.players.length;
    } else {
      targetPlayerIndex = currentPlayerIndex - 1;
      if (targetPlayerIndex < 0) {
        targetPlayerIndex = gameState.players.length - 1;
      }
    }

    const targetPlayer = gameState.players[targetPlayerIndex];

    if (!targetPlayer || targetPlayer.hand.length === 0) {
      Alert.alert(
        'Cannot Exchange',
        `${targetPlayer?.name || 'This player'} has no more cards to exchange with.`,
        [{ text: 'OK' }]
      );
      setShowExchangeModal(false);
      setSelectedCardForExchange(null);
      return;
    }

    console.log('Exchanging with', direction, 'player:', targetPlayer.name);
    exchangeCard(currentPlayerId, selectedCardForExchange, direction);
    setShowExchangeModal(false);
    setSelectedCardForExchange(null);
  };

  const handleSaveCustomText = () => {
    if (!selectedCustomCard || !customText.trim()) {
      Alert.alert('Error', 'Please enter some text for your custom card.');
      return;
    }

    console.log('Saving custom text:', customText);
    updateCustomText(currentPlayerId, selectedCustomCard.id, customText);
    setShowCustomTextModal(false);
    setSelectedCustomCard(null);
    setCustomText('');
  };

  const handleSelectWinner = (playerId: string) => {
    console.log('Winner selected:', playerId);
    setSelectedWinnerId(playerId);
  };

  const handleConfirmWinner = () => {
    if (!selectedWinnerId) {
      Alert.alert('No Winner Selected', 'Please select a winner before continuing.');
      return;
    }

    console.log('Confirming winner:', selectedWinnerId);
    awardPoint(selectedWinnerId);
    setShowWinnerModal(false);
    setSelectedWinnerId(null);
    nextRound(selectedWinnerId);
  };

  const handleContinueAfterAllPass = () => {
    console.log('All players passed, changing scenario');
    changeScenarioAndContinue();
  };

  const handleEndGame = () => {
    Alert.alert(
      'End Game',
      'Are you sure you want to end the game?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Game',
          style: 'destructive',
          onPress: () => {
            resetGame();
            router.back();
          },
        },
      ]
    );
  };

  const handleRestartGame = () => {
    Alert.alert(
      'Restart Game',
      'Start a new game with the same players?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restart',
          onPress: () => {
            restartGameWithSamePlayers();
            setIsPlayerReady(false);
          },
        },
      ]
    );
  };

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

  const allPlayersPassedThisRound = () => {
    return gameState.playedCards.every(pc => pc.card.text === 'PASSED');
  };

  if (!gameState.gameStarted || !currentPlayer) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading game...</Text>
        </View>
      </View>
    );
  }

  if (gameState.gameComplete) {
    const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0];

    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.gameCompleteContainer}>
          <Text style={[styles.gameCompleteTitle, { color: colors.primary }]}>Game Over!</Text>
          <Text style={[styles.gameCompleteSubtitle, { color: colors.text }]}>
            {winner.name} wins with {winner.score} points!
          </Text>

          <View style={styles.finalScoresContainer}>
            <Text style={[styles.finalScoresTitle, { color: colors.text }]}>Final Scores:</Text>
            {sortedPlayers.map((player, index) => (
              <View
                key={player.id}
                style={[
                  styles.finalScoreRow,
                  { backgroundColor: colors.card, borderColor: colors.cardBorder },
                ]}
              >
                <Text style={[styles.finalScoreRank, { color: colors.textSecondary }]}>
                  #{index + 1}
                </Text>
                <Text style={[styles.finalScoreName, { color: colors.text }]}>{player.name}</Text>
                <Text style={[styles.finalScorePoints, { color: colors.primary }]}>
                  {player.score} pts
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.gameCompleteButtons}>
            <Button title="Play Again" onPress={handleRestartGame} variant="primary" />
            <Button title="Back to Home" onPress={() => router.push('/')} variant="secondary" />
          </View>
        </View>
      </ScrollView>
    );
  }

  if (gameState.roundComplete) {
    const allPassed = allPlayersPassedThisRound();

    if (allPassed) {
      return (
        <ScrollView
          style={[styles.container, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.contentContainer}
        >
          <Stack.Screen options={{ headerShown: false }} />
          <View style={styles.allPassedContainer}>
            <Text style={[styles.allPassedTitle, { color: colors.accent }]}>
              All Players Passed!
            </Text>
            <Text style={[styles.allPassedSubtitle, { color: colors.text }]}>
              No one could make a sensible response. Let&apos;s try a new scenario.
            </Text>
            <Button
              title="Continue with New Scenario"
              onPress={handleContinueAfterAllPass}
              variant="primary"
              style={styles.continueButton}
            />
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.roundCompleteContainer}>
          <Text style={[styles.roundCompleteTitle, { color: colors.primary }]}>
            Round {gameState.round} Complete!
          </Text>
          <Text style={[styles.roundCompleteSubtitle, { color: colors.text }]}>
            Select the most toxic response
          </Text>

          <View style={styles.playedCardsContainer}>
            {gameState.playedCards
              .filter(pc => pc.card.text !== 'PASSED')
              .map(({ playerId, card }) => {
                const player = gameState.players.find(p => p.id === playerId);
                const isSelected = selectedWinnerId === playerId;

                return (
                  <TouchableOpacity
                    key={`${playerId}-${card.id}`}
                    style={[
                      styles.playedCardContainer,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.card,
                        borderColor: isSelected ? colors.accent : colors.cardBorder,
                      },
                    ]}
                    onPress={() => handleSelectWinner(playerId)}
                  >
                    <Text
                      style={[
                        styles.playedCardPlayer,
                        { color: isSelected ? colors.background : colors.textSecondary },
                      ]}
                    >
                      {player?.name}
                    </Text>
                    <Text
                      style={[
                        styles.playedCardText,
                        { color: isSelected ? colors.background : colors.text },
                      ]}
                    >
                      {card.isCustom && card.customText ? card.customText : card.text}
                    </Text>
                    {isSelected && (
                      <View style={styles.selectedBadge}>
                        <IconSymbol
                          ios_icon_name="checkmark.circle.fill"
                          android_material_icon_name="check-circle"
                          size={24}
                          color={colors.background}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
          </View>

          <Button
            title="Confirm Winner & Continue"
            onPress={handleConfirmWinner}
            variant="primary"
            style={styles.confirmButton}
          />
        </View>
      </ScrollView>
    );
  }

  if (!isPlayerReady) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.readyScreenContainer}>
          <TouchableOpacity style={styles.endGameButton} onPress={handleEndGame}>
            <IconSymbol
              ios_icon_name="xmark.circle.fill"
              android_material_icon_name="close"
              size={28}
              color={colors.accent}
            />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Text style={[styles.logoText, { color: colors.primary }]}>TOXIC</Text>
            <Text style={[styles.logoSubtext, { color: colors.accent }]}>The Card Game</Text>
          </View>

          <View style={[styles.readyCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Text style={[styles.readyTitle, { color: colors.text }]}>
              Pass the phone to {currentPlayer.name}
            </Text>
            <Text style={[styles.readySubtitle, { color: colors.textSecondary }]}>
              Make sure they aren&apos;t looking!
            </Text>
          </View>

          <View style={styles.gameInfoContainer}>
            <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Round</Text>
              <Text style={[styles.infoValue, { color: colors.primary }]}>{gameState.round}</Text>
            </View>
            <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Cards Left</Text>
              <Text style={[styles.infoValue, { color: colors.primary }]}>
                {currentPlayer.hand.length}
              </Text>
            </View>
            <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Score</Text>
              <Text style={[styles.infoValue, { color: colors.primary }]}>
                {currentPlayer.score}
              </Text>
            </View>
          </View>

          <Button
            title="I'm Ready - Show My Cards"
            onPress={handleReadyPress}
            variant="primary"
            style={styles.readyButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.gameContentContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handlePassToNextPlayer}>
            <IconSymbol
              ios_icon_name="eye.slash.fill"
              android_material_icon_name="visibility-off"
              size={28}
              color={colors.accent}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{currentPlayer.name}</Text>
          <TouchableOpacity onPress={handleEndGame}>
            <IconSymbol
              ios_icon_name="xmark.circle.fill"
              android_material_icon_name="close"
              size={28}
              color={colors.accent}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Round</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>{gameState.round}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Cards</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {currentPlayer.hand.length}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Score</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>{currentPlayer.score}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Exchange</Text>
            <Text style={[styles.statValue, { color: currentPlayer.hasExchanged ? colors.accent : colors.primary }]}>
              {currentPlayer.hasExchanged ? 'Used' : 'Available'}
            </Text>
          </View>
        </View>

        {gameState.currentScenario && (
          <View style={[styles.scenarioCard, { backgroundColor: colors.card, borderColor: colors.primary }]}>
            <Text style={[styles.scenarioLabel, { color: colors.primary }]}>SCENARIO</Text>
            <Text style={[styles.scenarioText, { color: colors.text }]}>
              {gameState.currentScenario.text}
            </Text>
          </View>
        )}

        <View style={styles.handContainer}>
          <Text style={[styles.handTitle, { color: colors.text }]}>Your Response Cards</Text>
          <PlayerHand
            cards={currentPlayer.hand}
            onCardPress={handleCardPress}
            onExchangePress={handleExchangeRequest}
            canExchange={!currentPlayer.hasExchanged}
          />
        </View>

        <View style={styles.actionButtons}>
          <Button
            title="Pass Turn"
            onPress={handlePassTurn}
            variant="secondary"
            style={styles.passButton}
          />
        </View>
      </ScrollView>

      <Modal
        visible={showExchangeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExchangeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Exchange Card</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Choose which player to exchange with:
            </Text>

            <View style={styles.exchangeOptions}>
              <TouchableOpacity
                style={[styles.exchangeOption, { backgroundColor: colors.background, borderColor: colors.cardBorder }]}
                onPress={() => handleExchangeWithDirection('previous')}
              >
                <IconSymbol
                  ios_icon_name="arrow.left.circle.fill"
                  android_material_icon_name="arrow-back"
                  size={32}
                  color={colors.primary}
                />
                <Text style={[styles.exchangeOptionText, { color: colors.text }]}>
                  Previous Player
                </Text>
                <Text style={[styles.exchangePlayerName, { color: colors.textSecondary }]}>
                  {getPreviousPlayer()?.name}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.exchangeOption, { backgroundColor: colors.background, borderColor: colors.cardBorder }]}
                onPress={() => handleExchangeWithDirection('next')}
              >
                <IconSymbol
                  ios_icon_name="arrow.right.circle.fill"
                  android_material_icon_name="arrow-forward"
                  size={32}
                  color={colors.primary}
                />
                <Text style={[styles.exchangeOptionText, { color: colors.text }]}>Next Player</Text>
                <Text style={[styles.exchangePlayerName, { color: colors.textSecondary }]}>
                  {getNextPlayer()?.name}
                </Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Cancel"
              onPress={() => {
                setShowExchangeModal(false);
                setSelectedCardForExchange(null);
              }}
              variant="secondary"
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCustomTextModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCustomTextModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Custom Response</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Enter your toxic response:
            </Text>

            <TextInput
              style={[styles.customTextInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.cardBorder }]}
              value={customText}
              onChangeText={setCustomText}
              placeholder="Type your response here..."
              placeholderTextColor={colors.textSecondary}
              multiline
              maxLength={200}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowCustomTextModal(false);
                  setSelectedCustomCard(null);
                  setCustomText('');
                }}
                variant="secondary"
                style={styles.modalButtonHalf}
              />
              <Button
                title="Save & Play"
                onPress={handleSaveCustomText}
                variant="primary"
                style={styles.modalButtonHalf}
              />
            </View>
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
    fontWeight: '600',
  },
  contentContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  readyScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  endGameButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoText: {
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: 4,
  },
  logoSubtext: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  readyCard: {
    borderRadius: 16,
    padding: 32,
    borderWidth: 2,
    marginBottom: 40,
    alignItems: 'center',
    width: '100%',
  },
  readyTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  readySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  gameInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 40,
  },
  infoBox: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    alignItems: 'center',
    minWidth: 100,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: '900',
  },
  readyButton: {
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  gameContentContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  scenarioCard: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 3,
    marginBottom: 30,
  },
  scenarioLabel: {
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 12,
    letterSpacing: 2,
  },
  scenarioText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
  },
  handContainer: {
    marginBottom: 20,
  },
  handTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  actionButtons: {
    marginTop: 20,
  },
  passButton: {
    width: '100%',
  },
  roundCompleteContainer: {
    alignItems: 'center',
  },
  roundCompleteTitle: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center',
  },
  roundCompleteSubtitle: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
  },
  playedCardsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  playedCardContainer: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    marginBottom: 16,
  },
  playedCardPlayer: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  playedCardText: {
    fontSize: 16,
    lineHeight: 24,
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  confirmButton: {
    width: '100%',
  },
  allPassedContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  allPassedTitle: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 16,
    textAlign: 'center',
  },
  allPassedSubtitle: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 26,
  },
  continueButton: {
    width: '100%',
  },
  gameCompleteContainer: {
    alignItems: 'center',
  },
  gameCompleteTitle: {
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 16,
    textAlign: 'center',
  },
  gameCompleteSubtitle: {
    fontSize: 20,
    marginBottom: 40,
    textAlign: 'center',
  },
  finalScoresContainer: {
    width: '100%',
    marginBottom: 40,
  },
  finalScoresTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  finalScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  finalScoreRank: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 16,
    width: 40,
  },
  finalScoreName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  finalScorePoints: {
    fontSize: 20,
    fontWeight: '900',
  },
  gameCompleteButtons: {
    width: '100%',
    gap: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  exchangeOptions: {
    gap: 16,
    marginBottom: 24,
  },
  exchangeOption: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    alignItems: 'center',
  },
  exchangeOptionText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },
  exchangePlayerName: {
    fontSize: 14,
    marginTop: 4,
  },
  modalButton: {
    width: '100%',
  },
  customTextInput: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonHalf: {
    flex: 1,
  },
});
