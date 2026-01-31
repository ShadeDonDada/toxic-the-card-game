
import { useMemo, useCallback } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { scenarioCards, responseCards } from '@/data/cards';

const MAX_DEMO_ROUNDS = 3;
const MAX_DEMO_SCENARIOS = 5; // Changed from 3 to 5 as requested
const MAX_DEMO_CARDS_PER_PLAYER = 3;

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate a consistent set of 5 random scenario cards for demo mode
// This is called once and cached, so the same 5 scenarios are used throughout the demo
let cachedDemoScenarios: typeof scenarioCards | null = null;

function getDemoScenarios() {
  if (!cachedDemoScenarios) {
    console.log('Demo mode - generating consistent set of 5 random scenario cards');
    const shuffled = shuffleArray([...scenarioCards]);
    cachedDemoScenarios = shuffled.slice(0, MAX_DEMO_SCENARIOS);
  }
  return cachedDemoScenarios;
}

export function useDemoMode() {
  const { isSubscribed } = useSubscription();

  const isFullVersion = isSubscribed;
  const isDemoMode = !isSubscribed;

  // Function to get scenario cards - returns consistent 5 scenarios for demo mode
  const getScenarioCards = useCallback(() => {
    if (isFullVersion) {
      console.log('Full version - using all scenario cards:', scenarioCards.length);
      return scenarioCards;
    }
    console.log('Demo mode - using consistent set of 5 random scenario cards');
    return getDemoScenarios();
  }, [isFullVersion]);

  // For initial render, provide a set of scenario cards
  const limitedScenarioCards = useMemo(() => getScenarioCards(), [getScenarioCards]);

  const limitedResponseCards = useMemo(() => {
    if (isFullVersion) {
      console.log('Full version - using all response cards:', responseCards.length);
      return responseCards;
    }
    // In demo mode, shuffle the response cards so players get random cards
    console.log('Demo mode - shuffling response cards for random dealing');
    return shuffleArray([...responseCards]);
  }, [isFullVersion]);

  const getCardsPerPlayer = () => {
    if (isFullVersion) {
      console.log('Full version - 6 cards per player');
      return 6;
    }
    console.log('Demo mode - 3 cards per player');
    return MAX_DEMO_CARDS_PER_PLAYER;
  };

  const canPlayRound = (currentRound: number) => {
    if (isFullVersion) {
      console.log('Full version - can play round:', currentRound);
      return true;
    }
    const canPlay = currentRound <= MAX_DEMO_ROUNDS;
    console.log('Demo mode - can play round', currentRound, '?', canPlay);
    return canPlay;
  };

  const isDemoLimitReached = (currentRound: number) => {
    if (isFullVersion) {
      console.log('Full version - demo limit never reached');
      return false;
    }
    const limitReached = currentRound > MAX_DEMO_ROUNDS;
    console.log('Demo mode - limit reached for round', currentRound, '?', limitReached);
    return limitReached;
  };

  return {
    isDemoMode,
    isFullVersion,
    limitedScenarioCards,
    limitedResponseCards,
    canPlayRound,
    isDemoLimitReached,
    maxDemoRounds: MAX_DEMO_ROUNDS,
    getCardsPerPlayer,
    getScenarioCards, // Export function to get consistent demo scenario cards
  };
}
