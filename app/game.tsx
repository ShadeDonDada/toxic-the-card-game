
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
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
  
  const {
    gameState,
    initializeGame,
    playCard,
    passCard,
    exchangeCard,
    nextRound,
    awardPoint,
    resetGame,
  } = useGameState();

  const [selectedCardId, setSelectedCardId] = useState<string | undefined>();
  const [showExchangeOptions, setShowExchangeOptions] = useState(false);

  useEffect(() => {
    initializeGame(playerCount);
  }, [playerCount, initializeGame]);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  const handleCardSelect = (cardId: string) => {
    setSelectedCardId(cardId);
  };

  const handlePlayCard = () => {
    if (!selectedCardId || !currentPlayer) {
      console.log('No card selected or no current player');
      return;
    }
    
    playCard(currentPlayer.id, selectedCardId);
    setSelectedCardId(undefined);
  };

  const handlePass = () => {
    if (!currentPlayer) {
      console.log('No current player');
      return;
    }
    
    Alert.alert(
      'Pass Turn',
      'Are you sure you want to pass? You won&apos;t play a card this turn.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pass',
          onPress: () => {
            passCard(currentPlayer.id);
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
    
    setShowExchangeOptions(true);
  };

  const handleExchangeWithPlayer = (targetPlayerId: string) => {
    if (!selectedCardId || !currentPlayer) {
      Alert.alert('Select a Card', 'Please select a card from your hand to exchange.');
      setShowExchangeOptions(false);
      return;
    }
    
    exchangeCard(currentPlayer.id, targetPlayerId, selectedCardId);
    setSelectedCardId(undefined);
    setShowExchangeOptions(false);
  };

  const handleAwardPoint = (playerId: string) => {
    awardPoint(playerId);
    Alert.alert('Point Awarded!', `${gameState.players.find(p => p.id === playerId)?.name} gets a point!`);
  };

  const handleNextRound = () => {
    if (gameState.scenarioDeck.length === 0) {
      Alert.alert(
        'Game Over!',
        'No more scenarios! Check the scores to see who won.',
        [
          {
            text: 'View Scores',
            onPress: () => {
              console.log('Viewing scores');
            },
          },
          {
            text: 'New Game',
            onPress: () => {
              resetGame();
              router.back();
            },
          },
        ]
      );
      return;
    }
    
    nextRound();
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
                    router.back();
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

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {gameState.currentScenario && (
          <View style={styles.scenarioContainer}>
            <Text style={styles.scenarioLabel}>Current Scenario</Text>
            <GameCard
              text={gameState.currentScenario.text}
              type="scenario"
            />
          </View>
        )}

        {gameState.roundComplete ? (
          <View style={styles.roundCompleteContainer}>
            <Text style={styles.roundCompleteTitle}>Round Complete! 🎉</Text>
            <Text style={styles.roundCompleteSubtitle}>Review the played cards and award a point</Text>
            
            <View style={styles.playedCardsContainer}>
              {gameState.playedCards.map((played, index) => {
                const player = gameState.players.find(p => p.id === played.playerId);
                return (
                  <View key={index} style={styles.playedCardItem}>
                    <Text style={styles.playedCardPlayer}>{player?.name}</Text>
                    <GameCard text={played.card.text} type="response" />
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

            <Button
              title="Next Round"
              onPress={handleNextRound}
              variant="primary"
              style={styles.nextRoundButton}
            />
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

            {showExchangeOptions ? (
              <View style={styles.exchangeContainer}>
                <Text style={styles.exchangeTitle}>Select a player to exchange with:</Text>
                {gameState.players
                  .filter(p => p.id !== currentPlayer.id)
                  .map((player, index) => (
                    <Button
                      key={index}
                      title={player.name}
                      onPress={() => handleExchangeWithPlayer(player.id)}
                      variant="secondary"
                      style={styles.exchangeButton}
                    />
                  ))}
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
                    title="Exchange Card"
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
    borderBottomColor: colors.secondary,
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
    borderColor: colors.secondary,
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
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  exchangeButton: {
    width: '100%',
  },
  roundCompleteContainer: {
    padding: 20,
  },
  roundCompleteTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  roundCompleteSubtitle: {
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
    borderColor: colors.secondary,
  },
  playedCardPlayer: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  awardButton: {
    marginTop: 12,
  },
  nextRoundButton: {
    width: '100%',
  },
});
