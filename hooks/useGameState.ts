
import { useState, useCallback } from 'react';
import { GameState, Player, ResponseCard, ScenarioCard } from '@/types/game';
import { scenarioCards, responseCards } from '@/data/cards';
import { useDemoMode } from './useDemoMode';

export function useGameState() {
  const { limitScenarios, limitResponseCards } = useDemoMode();
  
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    currentScenario: null,
    scenarioDeck: [],
    responseDeck: [],
    playedCards: [],
    round: 1,
    gameStarted: false,
    roundComplete: false,
    gameComplete: false,
  });

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const dealCardsToPlayers = useCallback((playerCount: number, playerNames: string[] = []) => {
    console.log('Dealing cards to', playerCount, 'players');
    
    // Apply demo mode limits to response cards
    const availableResponseCards = limitResponseCards(responseCards);
    console.log('Available response cards (after demo limit):', availableResponseCards.length);
    
    // Create a fresh shuffled deck
    const shuffledResponses = shuffleArray([...availableResponseCards]);
    
    console.log('Total cards in deck:', shuffledResponses.length);
    console.log('Cards needed:', playerCount * 6);
    
    // Verify we have enough cards
    if (shuffledResponses.length < playerCount * 6) {
      console.error('Not enough cards for all players!');
    }
    
    const players: Player[] = [];
    
    // Deal cards to each player from the shuffled deck
    for (let i = 0; i < playerCount; i++) {
      const hand: ResponseCard[] = [];
      
      // Each player gets 6 cards from sequential positions in the shuffled deck
      for (let j = 0; j < 6; j++) {
        const cardIndex = (i * 6) + j;
        
        if (cardIndex < shuffledResponses.length) {
          // Create a deep copy of the card to ensure no reference sharing
          const originalCard = shuffledResponses[cardIndex];
          const cardCopy: ResponseCard = {
            id: originalCard.id,
            text: originalCard.text,
            isCustom: originalCard.isCustom,
            customText: originalCard.customText,
          };
          
          hand.push(cardCopy);
          console.log(`Player ${i + 1} gets card ${cardIndex}: ${cardCopy.id}`);
        } else {
          console.error(`Not enough cards! Player ${i + 1} only got ${hand.length} cards`);
        }
      }
      
      players.push({
        id: `player-${i + 1}`,
        name: playerNames[i] || `Player ${i + 1}`,
        hand,
        score: 0,
        hasExchanged: false,
      });
      
      console.log(`Player ${i + 1} (${playerNames[i] || `Player ${i + 1}`}) hand:`, hand.map(c => c.id));
    }
    
    // Remaining cards go back to the deck
    const remainingDeck = shuffledResponses.slice(playerCount * 6).map(card => ({
      id: card.id,
      text: card.text,
      isCustom: card.isCustom,
      customText: card.customText,
    }));
    
    console.log('Remaining cards in deck:', remainingDeck.length);
    
    return { players, remainingDeck };
  }, [limitResponseCards]);

  const initializeGame = useCallback((playerCount: number, playerNames: string[] = []) => {
    console.log('Initializing game with', playerCount, 'players');
    
    // Apply demo mode limits to scenario cards
    const availableScenarioCards = limitScenarios(scenarioCards);
    console.log('Available scenario cards (after demo limit):', availableScenarioCards.length);
    
    const shuffledScenarios = shuffleArray([...availableScenarioCards]);
    const { players, remainingDeck } = dealCardsToPlayers(playerCount, playerNames);
    
    setGameState({
      players,
      currentPlayerIndex: 0,
      currentScenario: shuffledScenarios[0],
      scenarioDeck: shuffledScenarios.slice(1),
      responseDeck: remainingDeck,
      playedCards: [],
      round: 1,
      gameStarted: true,
      roundComplete: false,
      gameComplete: false,
    });
  }, [limitScenarios, dealCardsToPlayers]);

  const updateCustomText = useCallback((playerId: string, cardId: string, customText: string) => {
    console.log('Updating custom text for player', playerId, 'card', cardId);
    
    setGameState((prev) => {
      const updatedPlayers = prev.players.map((p) => {
        if (p.id === playerId) {
          return {
            ...p,
            hand: p.hand.map((c) => {
              if (c.id === cardId && c.isCustom) {
                return { ...c, customText };
              }
              return c;
            }),
          };
        }
        return p;
      });
      
      return {
        ...prev,
        players: updatedPlayers,
      };
    });
  }, []);

  const checkGameComplete = useCallback((players: Player[]) => {
    // Game is complete when at least one player has no cards left
    return players.some(player => player.hand.length === 0);
  }, []);

  const playCard = useCallback((playerId: string, cardId: string) => {
    console.log('Player', playerId, 'playing card', cardId);
    
    setGameState((prev) => {
      const player = prev.players.find((p) => p.id === playerId);
      if (!player) {
        console.log('Player not found');
        return prev;
      }
      
      const card = player.hand.find((c) => c.id === cardId);
      if (!card) {
        console.log('Card not found in player hand');
        return prev;
      }

      // Check if it's a custom card without text
      if (card.isCustom && (!card.customText || card.customText.trim() === '')) {
        console.log('Custom card needs text');
        return prev;
      }
      
      const updatedPlayers = prev.players.map((p) => {
        if (p.id === playerId) {
          return {
            ...p,
            hand: p.hand.filter((c) => c.id !== cardId),
          };
        }
        return p;
      });
      
      const updatedPlayedCards = [...prev.playedCards, { playerId, card }];
      
      let nextPlayerIndex = prev.currentPlayerIndex - 1;
      if (nextPlayerIndex < 0) {
        nextPlayerIndex = prev.players.length - 1;
      }
      
      const allPlayersPlayed = updatedPlayedCards.length === prev.players.length;
      
      // Check if game is complete (any player has no cards left)
      const isGameComplete = checkGameComplete(updatedPlayers);
      
      return {
        ...prev,
        players: updatedPlayers,
        playedCards: updatedPlayedCards,
        currentPlayerIndex: nextPlayerIndex,
        roundComplete: allPlayersPlayed,
        gameComplete: isGameComplete,
      };
    });
  }, [checkGameComplete]);

  const passCard = useCallback((playerId: string) => {
    console.log('Player', playerId, 'passing - continuing to next player');
    
    setGameState((prev) => {
      // Calculate next player index (counterclockwise)
      let nextPlayerIndex = prev.currentPlayerIndex - 1;
      if (nextPlayerIndex < 0) {
        nextPlayerIndex = prev.players.length - 1;
      }
      
      // Add a "pass" entry to played cards so we track that this player passed
      const updatedPlayedCards = [...prev.playedCards, { 
        playerId, 
        card: { 
          id: `pass-${playerId}-${Date.now()}`, 
          text: 'PASSED', 
          isCustom: false 
        } as ResponseCard 
      }];
      
      // Check if all players have now played or passed
      const allPlayersPlayed = updatedPlayedCards.length === prev.players.length;
      
      return {
        ...prev,
        playedCards: updatedPlayedCards,
        currentPlayerIndex: nextPlayerIndex,
        roundComplete: allPlayersPlayed,
      };
    });
  }, []);

  const changeScenarioAndContinue = useCallback(() => {
    console.log('All players passed - changing scenario and continuing play');
    
    setGameState((prev) => {
      if (prev.scenarioDeck.length === 0) {
        console.log('No more scenarios available');
        return prev;
      }
      
      const nextScenario = prev.scenarioDeck[0];
      const remainingScenarios = prev.scenarioDeck.slice(1);
      
      // Reset played cards and keep the same player order
      // The current player index is already set to the next player
      return {
        ...prev,
        currentScenario: nextScenario,
        scenarioDeck: remainingScenarios,
        playedCards: [],
        roundComplete: false,
      };
    });
  }, []);

  const exchangeCard = useCallback((fromPlayerId: string, cardId: string, direction: 'previous' | 'next') => {
    console.log('Exchanging card from', fromPlayerId, 'with', direction, 'player');
    
    setGameState((prev) => {
      const fromPlayerIndex = prev.players.findIndex((p) => p.id === fromPlayerId);
      const fromPlayer = prev.players[fromPlayerIndex];
      
      if (!fromPlayer || fromPlayer.hasExchanged) {
        console.log('Exchange not allowed - player has already exchanged');
        return prev;
      }
      
      const card = fromPlayer.hand.find((c) => c.id === cardId);
      if (!card) {
        console.log('Card not found in player hand');
        return prev;
      }
      
      // Calculate target player index based on direction
      let toPlayerIndex: number;
      if (direction === 'previous') {
        // Previous player (counterclockwise, so +1)
        toPlayerIndex = (fromPlayerIndex + 1) % prev.players.length;
      } else {
        // Next player (clockwise, so -1)
        toPlayerIndex = fromPlayerIndex - 1;
        if (toPlayerIndex < 0) {
          toPlayerIndex = prev.players.length - 1;
        }
      }
      
      const toPlayer = prev.players[toPlayerIndex];
      
      if (!toPlayer || toPlayer.hand.length === 0) {
        console.log('Target player not found or has no cards');
        return prev;
      }
      
      // Select a random card from the target player
      const randomToPlayerCard = toPlayer.hand[Math.floor(Math.random() * toPlayer.hand.length)];
      
      console.log(`Exchanging ${card.text} with ${randomToPlayerCard.text}`);
      
      const updatedPlayers = prev.players.map((p, index) => {
        if (index === fromPlayerIndex) {
          return {
            ...p,
            hand: [...p.hand.filter((c) => c.id !== cardId), randomToPlayerCard],
            hasExchanged: true,
          };
        }
        if (index === toPlayerIndex) {
          return {
            ...p,
            hand: [...p.hand.filter((c) => c.id !== randomToPlayerCard.id), card],
          };
        }
        return p;
      });
      
      return {
        ...prev,
        players: updatedPlayers,
      };
    });
  }, []);

  const nextRound = useCallback((winnerPlayerId?: string) => {
    console.log('Starting next round', winnerPlayerId ? `with winner ${winnerPlayerId}` : '');
    
    setGameState((prev) => {
      if (prev.scenarioDeck.length === 0) {
        console.log('No more scenarios');
        return prev;
      }
      
      const nextScenario = prev.scenarioDeck[0];
      const remainingScenarios = prev.scenarioDeck.slice(1);
      
      const updatedPlayers = prev.players.map((p) => ({
        ...p,
        hasExchanged: false,
      }));
      
      // If a winner is specified, set them as the current player for the next round
      let nextPlayerIndex = prev.currentPlayerIndex;
      if (winnerPlayerId) {
        const winnerIndex = prev.players.findIndex(p => p.id === winnerPlayerId);
        if (winnerIndex !== -1) {
          nextPlayerIndex = winnerIndex;
          console.log('Setting current player to winner at index', winnerIndex);
        }
      }
      
      return {
        ...prev,
        currentScenario: nextScenario,
        scenarioDeck: remainingScenarios,
        playedCards: [],
        round: prev.round + 1,
        roundComplete: false,
        players: updatedPlayers,
        currentPlayerIndex: nextPlayerIndex,
      };
    });
  }, []);

  const awardPoint = useCallback((playerId: string) => {
    console.log('Awarding point to', playerId);
    
    setGameState((prev) => {
      const updatedPlayers = prev.players.map((p) => {
        if (p.id === playerId) {
          return { ...p, score: p.score + 1 };
        }
        return p;
      });
      
      return {
        ...prev,
        players: updatedPlayers,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    console.log('Resetting game');
    
    setGameState({
      players: [],
      currentPlayerIndex: 0,
      currentScenario: null,
      scenarioDeck: [],
      responseDeck: [],
      playedCards: [],
      round: 1,
      gameStarted: false,
      roundComplete: false,
      gameComplete: false,
    });
  }, []);

  const restartGameWithSamePlayers = useCallback(() => {
    console.log('Restarting game with same players');
    
    setGameState((prev) => {
      // Extract player names from current players
      const playerNames = prev.players.map(p => p.name);
      const playerCount = prev.players.length;
      
      // Apply demo mode limits to scenario cards
      const availableScenarioCards = limitScenarios(scenarioCards);
      
      // Shuffle and deal new cards
      const shuffledScenarios = shuffleArray([...availableScenarioCards]);
      const { players, remainingDeck } = dealCardsToPlayers(playerCount, playerNames);
      
      return {
        players,
        currentPlayerIndex: 0,
        currentScenario: shuffledScenarios[0],
        scenarioDeck: shuffledScenarios.slice(1),
        responseDeck: remainingDeck,
        playedCards: [],
        round: 1,
        gameStarted: true,
        roundComplete: false,
        gameComplete: false,
      };
    });
  }, [limitScenarios, dealCardsToPlayers]);

  return {
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
  };
}
