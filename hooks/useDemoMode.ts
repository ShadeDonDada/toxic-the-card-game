
import { usePurchase } from '@/contexts/PurchaseContext';

const DEMO_SCENARIO_LIMIT = 3;
const DEMO_RESPONSE_LIMIT = 3;

export const useDemoMode = () => {
  const { isPremium } = usePurchase();

  const limitScenarios = <T,>(scenarios: T[]): T[] => {
    return isPremium ? scenarios : scenarios.slice(0, DEMO_SCENARIO_LIMIT);
  };

  const limitResponseCards = <T,>(cards: T[]): T[] => {
    return isPremium ? cards : cards.slice(0, DEMO_RESPONSE_LIMIT);
  };

  return {
    isPremium,
    isDemoMode: !isPremium,
    limitScenarios,
    limitResponseCards,
    DEMO_SCENARIO_LIMIT,
    DEMO_RESPONSE_LIMIT,
  };
};
