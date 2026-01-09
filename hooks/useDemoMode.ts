
import { usePurchase } from '@/contexts/PurchaseContext';
import { ScenarioCard, ResponseCard } from '@/types/game';

const DEMO_SCENARIO_LIMIT = 3;
const DEMO_RESPONSE_LIMIT = 3;

export function useDemoMode() {
  const { isPremium } = usePurchase();

  const limitScenarios = (scenarios: ScenarioCard[]): ScenarioCard[] => {
    if (isPremium) {
      return scenarios;
    }
    // In demo mode, only allow first 3 scenarios
    return scenarios.slice(0, DEMO_SCENARIO_LIMIT);
  };

  const limitResponseCards = (cards: ResponseCard[]): ResponseCard[] => {
    if (isPremium) {
      return cards;
    }
    // In demo mode, only allow first 3 response cards per player
    return cards.slice(0, DEMO_RESPONSE_LIMIT);
  };

  const isDemoMode = !isPremium;
  const remainingScenarios = isPremium ? Infinity : DEMO_SCENARIO_LIMIT;
  const remainingResponses = isPremium ? Infinity : DEMO_RESPONSE_LIMIT;

  return {
    isPremium,
    isDemoMode,
    limitScenarios,
    limitResponseCards,
    remainingScenarios,
    remainingResponses,
  };
}
