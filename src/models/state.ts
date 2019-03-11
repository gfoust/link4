import { Maybe } from 'src/util';
import { Game, PlayerType } from './game';

export type Screen = 'start' | 'game';

export interface PlayerInfo<T> {
  player1: T;
  player2: T;
}

export const defaultPlayerNames: PlayerInfo<string> = {
  player1: 'Player 1',
  player2: 'Player 2',
};

export const defaultPlayerTypes: PlayerInfo<PlayerType> = {
  player1: 'human',
  player2: 'human',
};

export interface State {
  screen: Screen;
  nextMove: Maybe<number>;
  games: Game[];
  current: number;
  count: number;
  playerNames: PlayerInfo<string>;
  playerTypes: PlayerInfo<PlayerType>;
}
