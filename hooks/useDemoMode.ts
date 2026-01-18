
import { usePurchase } from '@/contexts/PurchaseContext';

const DEMO_SCENARIO_LIMIT = 3;
const DEMO_RESPONSE_CARD_LIMIT = 3;

export const useDemoMode = () => {
  const { isPremium } = usePurchase();

  const isDemoMode = !isPremium;

  const getLimitedScenarios = <T,>(scenarios: T[]): T[] => {
    if (isPremium) {
      console.log('useDemoMode: Premium user, returning all scenarios:', scenarios.length);
      return scenarios;
    }
    console.log('useDemoMode: Demo mode, limiting scenarios to:', DEMO_SCENARIO_LIMIT);
    return scenarios.slice(0, DEMO_SCENARIO_LIMIT);
  };

  const getLimitedResponseCards = <T,>(cards: T[]): T[] => {
    if (isPremium) {
      console.log('useDemoMode: Premium user, returning all response cards:', cards.length);
      return cards;
    }
    console.log('useDemoMode: Demo mode, limiting response cards to:', DEMO_RESPONSE_CARD_LIMIT);
    return cards.slice(0, DEMO_RESPONSE_CARD_LIMIT);
  };

  return {
    isDemoMode,
    isPremium,
    getLimitedScenarios,
    getLimitedResponseCards,
    demoScenarioLimit: DEMO_SCENARIO_LIMIT,
    demoResponseCardLimit: DEMO_RESPONSE_CARD_LIMIT,
  };
};
