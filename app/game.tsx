
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Image } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors } from '@/styles/commonStyles';
import { Button } from '@/components/Button';
import { PlayerHand } from '@/components/PlayerHand';
import { useGameState } from '@/hooks/useGameState';
import { IconSymbol } from '@/components/IconSymbol';
import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GameCard } from '@/components/GameCard';

export default function GameScreen() {
  const { theme } = useTheme();
  const colors = getColors(theme);
  const router = useRouter();
  const { playerCount } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const {
    players,
    currentPlayerIndex,
    currentScenario,
    playedCards,
    roundWinner,
    initializeGame,
    playCard,
    passRound,
    exchangeCard,
    awardPoint,
    nextRound,
  } = useGameState();

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showPassPhonePrompt, setShowPassPhonePrompt] = useState(false);
  const [nextPlayerName, setNextPlayerName] = useState('');
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    if (playerCount) {
      initializeGame(parseInt(playerCount as string, 10));
      setIsPlayerReady(false);
      setShowPassPhonePrompt(true);
      setNextPlayerName(players[0]?.name || 'Player 1');
    }
  }, [playerCount, initializeGame]);

  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId);
  };

  const handleCustomTextChange = (cardId: string, text: string) => {
    console.log('Custom text changed for card:', cardId, text);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const showPassPhonePrompt = (nextPlayer: string) => {
    setIsPlayerReady(false);
    setNextPlayerName(nextPlayer);
    setShowPassPhonePrompt(true);
  };

  const handleReadyPress = () => {
    setShowPassPhonePrompt(false);
    setIsPlayerReady(true);
    scrollToTop();
  };

  const checkIfAllPlayersPassed = () => {
    return players.every((player) => 
      playedCards.some((pc) => pc.playerId === player.id) || 
      player.hasPassed
    );
  };

  const getWinner = () => {
    const playersWithCards = players.filter((player) => 
      playedCards.some((pc) => pc.playerId === player.id)
    );
    
    if (playersWithCards.length === 0) {
      return null;
    }
    
    return playersWithCards[Math.floor(Math.random() * playersWithCards.length)];
  };

  const handlePlayCard = () => {
    if (!selectedCard) {
      Alert.alert('No Card Selected', 'Please select a card to play.');
      return;
    }

    // CRITICAL FIX: Immediately hide cards before any other action
    // This prevents the next player's cards from being visible
    setIsPlayerReady(false);

    playCard(selectedCard);
    setSelectedCard(null);
    
    const allPassed = checkIfAllPlayersPassed();
    
    if (allPassed) {
      const winner = getWinner();
      setRoundWinner(winner);
      setShowWinnerModal(true);
    } else {
      const nextPlayer = players[currentPlayerIndex]?.name || 'Next Player';
      showPassPhonePrompt(nextPlayer);
    }
  };

  const handlePass = () => {
    Alert.alert(
      'Pass Round',
      'Are you sure you want to pass this round?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pass',
          style: 'destructive',
          onPress: () => {
            // CRITICAL FIX: Immediately hide cards before passing
            setIsPlayerReady(false);
            
            passRound();
            setSelectedCard(null);
            
            const allPassed = checkIfAllPlayersPassed();
            
            if (allPassed) {
              const winner = getWinner();
              setRoundWinner(winner);
              setShowWinnerModal(true);
            } else {
              const nextPlayer = players[currentPlayerIndex]?.name || 'Next Player';
              showPassPhonePrompt(nextPlayer);
            }
          },
        },
      ]
    );
  };

  const handleExchange = () => {
    Alert.alert(
      'Exchange Card',
      'Choose a player to exchange a card with:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Previous Player',
          onPress: () => handleExchangeWithDirection('previous'),
        },
        {
          text: 'Next Player',
          onPress: () => handleExchangeWithDirection('next'),
        },
      ]
    );
  };

  const handleExchangeWithDirection = (direction: 'previous' | 'next') => {
    if (!selectedCard) {
      Alert.alert('No Card Selected', 'Please select a card to exchange.');
      return;
    }

    const targetPlayer = direction === 'previous' ? getPreviousPlayer() : getNextPlayer();
    
    if (targetPlayer) {
      exchangeCard(selectedCard, targetPlayer.id);
      setSelectedCard(null);
      Alert.alert('Card Exchanged', `You exchanged a card with ${targetPlayer.name}`);
    }
  };

  const handleAwardPoint = (playerId: string) => {
    awardPoint(playerId);
    setShowWinnerModal(false);
    nextRound();
    
    const nextPlayer = players[currentPlayerIndex]?.name || 'Next Player';
    showPassPhonePrompt(nextPlayer);
  };

  const handlePlayAgain = () => {
    setShowWinnerModal(false);
    nextRound();
    
    const nextPlayer = players[currentPlayerIndex]?.name || 'Next Player';
    showPassPhonePrompt(nextPlayer);
  };

  const getPreviousPlayer = () => {
    const prevIndex = currentPlayerIndex === 0 ? players.length - 1 : currentPlayerIndex - 1;
    return players[prevIndex];
  };

  const getNextPlayer = () => {
    const nextIndex = (currentPlayerIndex + 1) % players.length;
    return players[nextIndex];
  };

  const currentPlayer = players[currentPlayerIndex];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol 
              ios_icon_name="chevron.left" 
              android_material_icon_name="arrow-back" 
              size={24} 
              color={colors.text} 
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Toxic - The Card Game</Text>
          <View style={styles.backButton} />
        </View>

        {/* Current Player Info */}
        <View style={[styles.playerInfo, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.playerName, { color: colors.primary }]}>
            {currentPlayer?.name || 'Player'}
          </Text>
          <Text style={[styles.playerPoints, { color: colors.text }]}>
            Points: {currentPlayer?.points || 0}
          </Text>
        </View>

        {/* Scenario Card */}
        {currentScenario && (
          <View style={styles.scenarioContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Current Scenario</Text>
            <GameCard
              text={currentScenario.text}
              type="scenario"
            />
          </View>
        )}

        {/* Played Cards */}
        {playedCards.length > 0 && (
          <View style={styles.playedCardsContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Played Cards ({playedCards.length})
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.playedCardsScroll}
            >
              {playedCards.map((pc) => {
                const player = players.find((p) => p.id === pc.playerId);
                return (
                  <View key={pc.card.id} style={styles.playedCardWrapper}>
                    <Text style={[styles.playedCardPlayer, { color: colors.textSecondary }]}>
                      {player?.name || 'Unknown'}
                    </Text>
                    <GameCard
                      text={pc.card.text}
                      type="response"
                    />
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Player Hand */}
        {currentPlayer && (
          <PlayerHand
            cards={currentPlayer.hand}
            onCardPress={handleCardSelect}
            selectedCardId={selectedCard || undefined}
            disabled={!isPlayerReady}
            onCustomTextChange={handleCustomTextChange}
            showBlankCards={!isPlayerReady}
          />
        )}

        {/* Action Buttons */}
        {isPlayerReady && (
          <View style={styles.actionButtons}>
            <Button
              title="Play Card"
              onPress={handlePlayCard}
              variant="primary"
              disabled={!selectedCard}
            />
            <Button
              title="Pass"
              onPress={handlePass}
              variant="secondary"
            />
            <Button
              title="Exchange Card"
              onPress={handleExchange}
              variant="secondary"
              disabled={!selectedCard || currentPlayer?.hasExchanged}
            />
          </View>
        )}
      </ScrollView>

      {/* Pass Phone Prompt Modal */}
      <Modal
        visible={showPassPhonePrompt}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <IconSymbol 
              ios_icon_name="hand.raised.fill" 
              android_material_icon_name="front-hand" 
              size={64} 
              color={colors.primary} 
            />
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Pass Phone to
            </Text>
            <Text style={[styles.modalPlayerName, { color: colors.primary }]}>
              {nextPlayerName}
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Make sure they can&apos;t see the screen!
            </Text>
            <Button
              title="I'm Ready"
              onPress={handleReadyPress}
              variant="primary"
            />
          </View>
        </View>
      </Modal>

      {/* Winner Modal */}
      <Modal
        visible={showWinnerModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <IconSymbol 
              ios_icon_name="trophy.fill" 
              android_material_icon_name="emoji-events" 
              size={64} 
              color={colors.primary} 
            />
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Round Complete!
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Vote for the most toxic response
            </Text>
            
            <View style={styles.winnerVoteContainer}>
              {playedCards.map((pc) => {
                const player = players.find((p) => p.id === pc.playerId);
                return (
                  <TouchableOpacity
                    key={pc.card.id}
                    style={[styles.winnerVoteButton, { backgroundColor: colors.background, borderColor: colors.cardBorder }]}
                    onPress={() => handleAwardPoint(pc.playerId)}
                  >
                    <Text style={[styles.winnerVotePlayer, { color: colors.primary }]}>
                      {player?.name || 'Unknown'}
                    </Text>
                    <Text style={[styles.winnerVoteCard, { color: colors.text }]} numberOfLines={2}>
                      {pc.card.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Button
              title="Continue Without Voting"
              onPress={handlePlayAgain}
              variant="secondary"
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  playerInfo: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerName: {
    fontSize: 24,
    fontWeight: '700',
  },
  playerPoints: {
    fontSize: 18,
    fontWeight: '600',
  },
  scenarioContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  playedCardsContainer: {
    marginBottom: 24,
  },
  playedCardsScroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  playedCardWrapper: {
    width: 200,
    marginRight: 12,
  },
  playedCardPlayer: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  actionButtons: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 12,
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
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  modalPlayerName: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  winnerVoteContainer: {
    width: '100%',
    gap: 12,
    marginVertical: 16,
  },
  winnerVoteButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
  },
  winnerVotePlayer: {
    fontSize: 16,
    fontWeight: '700',
  },
  winnerVoteCard: {
    fontSize: 14,
  },
});
