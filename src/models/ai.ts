import { GameSummary } from './game';

export interface AiRequestMessage {
  id: number;
  gameId: number;
  depth: number;
  game: GameSummary;
}

export interface AiResponseMessage {
  id: number;
  gameId: number;
  move: number;
}

export interface Move {
  column: number;
  score: number;
}
