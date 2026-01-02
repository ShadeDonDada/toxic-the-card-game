
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
    if (isFullVersion) return scenarioCards;
    return scenarioCards.slice(0, MAX_DEMO_SCENARIOS);
  }, [isFullVersion]);

  const limitedResponseCards = useMemo(() => {
    if (isFullVersion) return responseCards;
    return responseCards.slice(0, MAX_DEMO_RESPONSES);
  }, [isFullVersion]);

  const canPlayRound = (currentRound: number) => {
    if (isFullVersion) return true;
    return currentRound <= MAX_DEMO_ROUNDS;
  };

  const isDemoLimitReached = (currentRound: number) => {
    if (isFullVersion) return false;
    return currentRound > MAX_DEMO_ROUNDS;
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
