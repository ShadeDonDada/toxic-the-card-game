
export interface ScenarioCard {
  id: string;
  text: string;
}

export interface ResponseCard {
  id: string;
  text: string;
  isCustom?: boolean;
  customText?: string;
}

export interface Player {
  id: string;
  name: string;
  hand: ResponseCard[];
  score: number;
  selectedCard: ResponseCard | null;
  hasExchanged: boolean;
  hasPassed: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  currentScenario: ScenarioCard | null;
  scenarioDeck: ScenarioCard[];
  responseDeck: ResponseCard[];
  roundNumber: number;
  gamePhase: 'playing' | 'awarding' | 'roundEnd';
}
