import { Game, PlayerType } from './game';
import { Maybe } from './util';

export type Screen = 'start' | 'game';

export interface PlayerInfo<T> {
  player1: T;
  player2: T;
}

export interface State {
  screen: Screen;
  nextMove: Maybe<number>;
  computerMove: Maybe<number>;
  games: Game[];
  current: number;
  count: number;
  playerNames: PlayerInfo<string>;
  playerTypes: PlayerInfo<PlayerType>;
}
