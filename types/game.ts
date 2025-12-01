
export interface Player {
  id: string;
  name: string;
  hand: ResponseCard[];
  score: number;
  hasExchanged: boolean;
}

export interface ScenarioCard {
  id: string;
  text: string;
}

export interface ResponseCard {
  id: string;
  text: string;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  currentScenario: ScenarioCard | null;
  scenarioDeck: ScenarioCard[];
  responseDeck: ResponseCard[];
  playedCards: { playerId: string; card: ResponseCard }[];
  round: number;
  gameStarted: boolean;
  roundComplete: boolean;
}
