
import { useMemo } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { scenarioCards, responseCards } from '@/data/cards';

const MAX_DEMO_ROUNDS = 3;
const MAX_DEMO_SCENARIOS = 3;
const MAX_DEMO_CARDS_PER_PLAYER = 3;

export function useDemoMode() {
  const { isSubscribed } = useSubscription();

  const isFullVersion = isSubscribed;
  const isDemoMode = !isSubscribed;

  const limitedScenarioCards = useMemo(() => {
    if (isFullVersion) {
      console.log('Full version - using all scenario cards:', scenarioCards.length);
      return scenarioCards;
    }
    console.log('Demo mode - limiting scenario cards to:', MAX_DEMO_SCENARIOS);
    return scenarioCards.slice(0, MAX_DEMO_SCENARIOS);
  }, [isFullVersion]);

  const limitedResponseCards = useMemo(() => {
    if (isFullVersion) {
      console.log('Full version - using all response cards:', responseCards.length);
      return responseCards;
    }
    // In demo mode, we don't limit the response cards pool itself
    // Instead, we limit how many cards each player gets (handled in useGameState)
    console.log('Demo mode - using all response cards for dealing');
    return responseCards;
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
  };
}
