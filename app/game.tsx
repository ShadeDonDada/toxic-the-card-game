
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
import { useDemoMode } from '@/hooks/useDemoMode';
import { AdInterstitial } from '@/components/AdInterstitial';
import { DemoLimitModal } from '@/components/DemoLimitModal';

export default function GameScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();
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
  
  const { playerCount } = useLocalSearchParams<{ playerCount: string }>();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showPassPhoneModal, setShowPassPhoneModal] = useState(false);
  const [nextPlayerName, setNextPlayerName] = useState('');
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const { theme } = useTheme();
  const colors = getColors(theme);
  
  // Demo mode state
  const { isDemoMode, canPlayRound, isDemoLimitReached, maxDemoRounds } = useDemoMode();
  const [showAd, setShowAd] = useState(false);
  const [showDemoLimitModal, setShowDemoLimitModal] = useState(false);
  const [pendingNextRound, setPendingNextRound] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (playerCount) {
      initializeGame(parseInt(playerCount, 10));
    }
  }, [playerCount, initializeGame]);

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId);
  };

  const handleCustomTextChange = (cardId: string, text: string) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    updateCustomText(currentPlayer.id, cardId, text);
  };

  const showPassPhonePrompt = (nextPlayer: string) => {
    setNextPlayerName(nextPlayer);
    setShowPassPhoneModal(true);
  };

  const handleReadyPress = () => {
    setShowPassPhoneModal(false);
    scrollToTop();
  };

  const checkIfAllPlayersPassed = () => {
    return gameState.playedCards.every(
      (played) => played.card.text === 'PASSED'
    );
  };

  const getWinner = () => {
    if (gameState.playedCards.length === 0) return null;
    
    const nonPassedCards = gameState.playedCards.filter(
      (played) => played.card.text !== 'PASSED'
    );
    
    if (nonPassedCards.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * nonPassedCards.length);
    return nonPassedCards[randomIndex].playerId;
  };

  const handlePlayCard = () => {
    if (!selectedCard) {
      Alert.alert('No Card Selected', 'Please select a card to play.');
      return;
    }

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const card = currentPlayer.hand.find((c) => c.id === selectedCard);

    if (card?.isCustom && (!card.customText || card.customText.trim() === '')) {
      Alert.alert('Custom Card', 'Please enter text for your custom card.');
      return;
    }

    playCard(currentPlayer.id, selectedCard);
    setSelectedCard(null);

    const nextPlayerIndex =
      gameState.currentPlayerIndex - 1 < 0
        ? gameState.players.length - 1
        : gameState.currentPlayerIndex - 1;
    const nextPlayer = gameState.players[nextPlayerIndex];

    const willBeRoundComplete = gameState.playedCards.length + 1 === gameState.players.length;

    if (!willBeRoundComplete) {
      showPassPhonePrompt(nextPlayer.name);
    }
  };

  const handlePass = () => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    passCard(currentPlayer.id);
    setSelectedCard(null);

    const nextPlayerIndex =
      gameState.currentPlayerIndex - 1 < 0
        ? gameState.players.length - 1
        : gameState.currentPlayerIndex - 1;
    const nextPlayer = gameState.players[nextPlayerIndex];

    const willBeRoundComplete = gameState.playedCards.length + 1 === gameState.players.length;

    if (!willBeRoundComplete) {
      showPassPhonePrompt(nextPlayer.name);
    }
  };

  const handleExchange = () => {
    if (!selectedCard) {
      Alert.alert('No Card Selected', 'Please select a card to exchange.');
      return;
    }

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.hasExchanged) {
      Alert.alert('Already Exchanged', 'You have already exchanged a card this round.');
      return;
    }

    setShowExchangeModal(true);
  };

  const handleExchangeWithDirection = (direction: 'previous' | 'next') => {
    if (!selectedCard) return;

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    exchangeCard(currentPlayer.id, selectedCard, direction);
    setSelectedCard(null);
    setShowExchangeModal(false);
  };

  const handleAwardPoint = (playerId: string) => {
    awardPoint(playerId);
    
    // Check if we can continue to next round or if demo limit is reached
    const nextRoundNumber = gameState.round + 1;
    
    if (isDemoMode && !canPlayRound(nextRoundNumber)) {
      // Demo limit reached
      setShowDemoLimitModal(true);
    } else {
      // Show ad after round in demo mode, then continue
      if (isDemoMode) {
        setPendingNextRound(playerId);
        setShowAd(true);
      } else {
        nextRound(playerId);
      }
    }
  };

  const handleAdComplete = () => {
    setShowAd(false);
    if (pendingNextRound !== undefined) {
      nextRound(pendingNextRound);
      setPendingNextRound(undefined);
    }
  };

  const handlePlayAgain = () => {
    restartGameWithSamePlayers();
  };

  const getPreviousPlayer = () => {
    const prevIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    return gameState.players[prevIndex];
  };

  const getNextPlayer = () => {
    const nextIndex = gameState.currentPlayerIndex - 1 < 0
      ? gameState.players.length - 1
      : gameState.currentPlayerIndex - 1;
    return gameState.players[nextIndex];
  };

  if (!gameState.gameStarted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading game...</Text>
      </View>
    );
  }

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const allPlayersPassed = checkIfAllPlayersPassed();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView ref={scrollViewRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol ios_icon_name="chevron.left" android_material_icon_name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={[styles.roundText, { color: colors.text }]}>Round {gameState.round}</Text>
            {isDemoMode && (
              <View style={styles.demoBadge}>
                <Text style={styles.demoBadgeText}>DEMO ({gameState.round}/{maxDemoRounds})</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={() => router.push('/settings')} style={styles.settingsButton}>
            <IconSymbol ios_icon_name="gear" android_material_icon_name="settings" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Scenario Card */}
        {gameState.currentScenario && (
          <View style={styles.scenarioContainer}>
            <Text style={[styles.scenarioLabel, { color: colors.text }]}>Scenario</Text>
            <GameCard
              text={gameState.currentScenario.text}
              isScenario={true}
              category={gameState.currentScenario.category}
            />
          </View>
        )}

        {/* Round Complete Section */}
        {gameState.roundComplete && !gameState.gameComplete && (
          <View style={styles.roundCompleteContainer}>
            <Text style={[styles.roundCompleteTitle, { color: colors.text }]}>Round Complete!</Text>
            
            {allPlayersPassed ? (
              <View style={styles.allPassedContainer}>
                <Text style={[styles.allPassedText, { color: colors.text }]}>
                  All players passed. Moving to next scenario...
                </Text>
                <Button
                  title="Continue"
                  onPress={() => {
                    changeScenarioAndContinue();
                    const nextPlayer = gameState.players[gameState.currentPlayerIndex];
                    showPassPhonePrompt(nextPlayer.name);
                  }}
                />
              </View>
            ) : (
              <>
                <Text style={[styles.playedCardsTitle, { color: colors.text }]}>Played Cards:</Text>
                {gameState.playedCards.map((played, index) => {
                  const player = gameState.players.find((p) => p.id === played.playerId);
                  if (played.card.text === 'PASSED') {
                    return (
                      <View key={index} style={styles.playedCardItem}>
                        <Text style={[styles.playerName, { color: colors.text }]}>{player?.name}</Text>
                        <Text style={[styles.passedText, { color: colors.textSecondary }]}>Passed</Text>
                      </View>
                    );
                  }
                  return (
                    <View key={index} style={styles.playedCardItem}>
                      <Text style={[styles.playerName, { color: colors.text }]}>{player?.name}</Text>
                      <GameCard
                        text={played.card.isCustom && played.card.customText ? played.card.customText : played.card.text}
                        isScenario={false}
                      />
                      <Button
                        title="Award Point"
                        onPress={() => handleAwardPoint(played.playerId)}
                      />
                    </View>
                  );
                })}
              </>
            )}
          </View>
        )}

        {/* Game Complete Section */}
        {gameState.gameComplete && (
          <View style={styles.gameCompleteContainer}>
            <Text style={[styles.gameCompleteTitle, { color: colors.text }]}>Game Complete!</Text>
            <Text style={[styles.scoresTitle, { color: colors.text }]}>Final Scores:</Text>
            {gameState.players
              .sort((a, b) => b.score - a.score)
              .map((player, index) => (
                <View key={player.id} style={styles.scoreItem}>
                  <Text style={[styles.scoreName, { color: colors.text }]}>
                    {index + 1}. {player.name}
                  </Text>
                  <Text style={[styles.scoreValue, { color: colors.text }]}>{player.score} points</Text>
                </View>
              ))}
            <View style={styles.gameCompleteButtons}>
              <Button title="Play Again" onPress={handlePlayAgain} />
              <Button title="Main Menu" onPress={() => router.push('/(tabs)/(home)')} />
            </View>
          </View>
        )}

        {/* Current Player Section */}
        {!gameState.roundComplete && !gameState.gameComplete && (
          <View style={styles.currentPlayerContainer}>
            <Text style={[styles.currentPlayerText, { color: colors.text }]}>
              Current Player: {currentPlayer.name}
            </Text>
            <Text style={[styles.scoreText, { color: colors.textSecondary }]}>
              Score: {currentPlayer.score}
            </Text>

            {/* Player Hand */}
            <PlayerHand
              cards={currentPlayer.hand}
              selectedCard={selectedCard}
              onCardSelect={handleCardSelect}
              onCustomTextChange={handleCustomTextChange}
            />

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Button title="Play Card" onPress={handlePlayCard} disabled={!selectedCard} />
              <Button title="Pass" onPress={handlePass} />
              <Button
                title="Exchange"
                onPress={handleExchange}
                disabled={!selectedCard || currentPlayer.hasExchanged}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Pass Phone Modal */}
      <Modal visible={showPassPhoneModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Image
              source={require('@/assets/images/ade019df-679f-48c9-b84b-d610ac5b8fe0.png')}
              style={styles.modalImage}
              resizeMode="contain"
            />
            <Text style={[styles.modalTitle, { color: colors.text }]}>Pass the phone to</Text>
            <Text style={[styles.modalPlayerName, { color: colors.primary }]}>{nextPlayerName}</Text>
            <Button title="I'm Ready" onPress={handleReadyPress} />
          </View>
        </View>
      </Modal>

      {/* Exchange Direction Modal */}
      <Modal visible={showExchangeModal} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Exchange with which player?</Text>
            <View style={styles.exchangeButtons}>
              <Button
                title={`Previous Player (${getPreviousPlayer().name})`}
                onPress={() => handleExchangeWithDirection('previous')}
              />
              <Button
                title={`Next Player (${getNextPlayer().name})`}
                onPress={() => handleExchangeWithDirection('next')}
              />
            </View>
            <Button title="Cancel" onPress={() => setShowExchangeModal(false)} />
          </View>
        </View>
      </Modal>

      {/* Ad Interstitial */}
      <AdInterstitial visible={showAd} onAdComplete={handleAdComplete} />

      {/* Demo Limit Modal */}
      <DemoLimitModal visible={showDemoLimitModal} onClose={() => setShowDemoLimitModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  roundText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  demoBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  demoBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
  },
  scenarioContainer: {
    marginBottom: 24,
  },
  scenarioLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  roundCompleteContainer: {
    marginBottom: 24,
  },
  roundCompleteTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  allPassedContainer: {
    alignItems: 'center',
    gap: 16,
  },
  allPassedText: {
    fontSize: 16,
    textAlign: 'center',
  },
  playedCardsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  playedCardItem: {
    marginBottom: 16,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  passedText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  gameCompleteContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  gameCompleteTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  scoresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scoreItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  scoreName: {
    fontSize: 18,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gameCompleteButtons: {
    marginTop: 24,
    gap: 12,
    width: '100%',
  },
  currentPlayerContainer: {
    marginBottom: 24,
  },
  currentPlayerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 16,
    marginBottom: 16,
  },
  actionButtons: {
    marginTop: 16,
    gap: 12,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalPlayerName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  exchangeButtons: {
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
});
