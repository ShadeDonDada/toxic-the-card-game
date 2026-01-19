
import { useMemo } from 'react';
import { usePurchase } from '@/contexts/PurchaseContext';
import { scenarioCards, responseCards } from '@/data/cards';

const MAX_DEMO_ROUNDS = 3;
const MAX_DEMO_SCENARIOS = 3;
const MAX_DEMO_RESPONSES = 3;

export function useDemoMode() {
  const { isFullVersion } = usePurchase();

  const isDemoMode = !isFullVersion;

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
    console.log('Demo mode - limiting response cards to:', MAX_DEMO_RESPONSES);
    return responseCards.slice(0, MAX_DEMO_RESPONSES);
  }, [isFullVersion]);

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
  };
}
