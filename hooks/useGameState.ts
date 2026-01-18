
import { GameState, Player, ResponseCard } from '@/types/game';
import { scenarioCards, responseCards } from '@/data/cards';
import { useState, useCallback } from 'react';
import { useDemoMode } from './useDemoMode';

export const useGameState = () => {
  const { getLimitedScenarios, getLimitedResponseCards } = useDemoMode();
  
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    currentScenario: null,
    scenarioDeck: [],
    responseDeck: [],
    roundNumber: 1,
    gamePhase: 'playing',
  });

  const initializeGame = useCallback((playerCount: number, playerNames: string[]) => {
    console.log('useGameState: Initializing game with', playerCount, 'players');
    
    // Apply demo mode limits
    const limitedScenarios = getLimitedScenarios(scenarioCards);
    const limitedResponses = getLimitedResponseCards(responseCards);
    
    console.log('useGameState: Using', limitedScenarios.length, 'scenarios and', limitedResponses.length, 'response cards');
    
    // Shuffle decks
    const shuffledScenarios = [...limitedScenarios].sort(() => Math.random() - 0.5);
    const shuffledResponses = [...limitedResponses].sort(() => Math.random() - 0.5);

    // Create players
    const players: Player[] = playerNames.map((name, index) => ({
      id: `player-${index}`,
      name,
      hand: [],
      score: 0,
      selectedCard: null,
      hasExchanged: false,
      hasPassed: false,
    }));

    // Deal cards to players (6 cards each)
    let deckIndex = 0;
    players.forEach((player) => {
      const hand: ResponseCard[] = [];
      for (let i = 0; i < 6 && deckIndex < shuffledResponses.length; i++) {
        hand.push({ ...shuffledResponses[deckIndex] });
        deckIndex++;
      }
      player.hand = hand;
    });

    // Set first scenario
    const firstScenario = shuffledScenarios[0];

    setGameState({
      players,
      currentPlayerIndex: 0,
      currentScenario: firstScenario,
      scenarioDeck: shuffledScenarios.slice(1),
      responseDeck: shuffledResponses.slice(deckIndex),
      roundNumber: 1,
      gamePhase: 'playing',
    });

    console.log('useGameState: Game initialized');
  }, [getLimitedScenarios, getLimitedResponseCards]);

  const selectCard = useCallback((playerId: string, cardId: string) => {
    console.log('useGameState: Player', playerId, 'selected card', cardId);
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player) =>
        player.id === playerId
          ? {
              ...player,
              selectedCard: player.hand.find((card) => card.id === cardId) || null,
            }
          : player
      ),
    }));
  }, []);

  const nextPlayer = useCallback(() => {
    console.log('useGameState: Moving to next player');
    setGameState((prev) => ({
      ...prev,
      currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
    }));
  }, []);

  const awardPoint = useCallback((playerId: string) => {
    console.log('useGameState: Awarding point to player', playerId);
    setGameState((prev) => {
      // If playerId is empty, just transition to awarding phase
      if (!playerId) {
        return {
          ...prev,
          gamePhase: 'awarding',
        };
      }
      
      // Otherwise, award the point and end the round
      return {
        ...prev,
        players: prev.players.map((player) =>
          player.id === playerId ? { ...player, score: player.score + 1 } : player
        ),
        gamePhase: 'roundEnd',
      };
    });
  }, []);

  const nextRound = useCallback(() => {
    console.log('useGameState: Starting next round');
    setGameState((prev) => {
      const nextScenario = prev.scenarioDeck[0];
      
      // Reset player states
      const resetPlayers = prev.players.map((player) => ({
        ...player,
        selectedCard: null,
        hasExchanged: false,
        hasPassed: false,
      }));

      return {
        ...prev,
        players: resetPlayers,
        currentPlayerIndex: 0,
        currentScenario: nextScenario,
        scenarioDeck: prev.scenarioDeck.slice(1),
        roundNumber: prev.roundNumber + 1,
        gamePhase: 'playing',
      };
    });
  }, []);

  const passPlayer = useCallback((playerId: string) => {
    console.log('useGameState: Player', playerId, 'passed');
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player) =>
        player.id === playerId ? { ...player, hasPassed: true } : player
      ),
    }));
  }, []);

  const exchangeCard = useCallback((playerId: string, targetPlayerId: string) => {
    console.log('useGameState: Player', playerId, 'exchanging card with', targetPlayerId);
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player) => {
        if (player.id === playerId) {
          return { ...player, hasExchanged: true };
        }
        return player;
      }),
    }));
  }, []);

  return {
    gameState,
    initializeGame,
    selectCard,
    nextPlayer,
    awardPoint,
    nextRound,
    passPlayer,
    exchangeCard,
  };
};
