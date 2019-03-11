import { Game, Player, PlayerType } from './game';
import { Code } from './parser';
import { Dictionary, Maybe } from './util';

export type Screen = 'start' | 'game';

export interface PlayerSetup {
  name: string;
  type: PlayerType;
  file: Maybe<File>;
  code: Maybe<Code>;
}

export type FullSetup = Dictionary<PlayerSetup, Player>;

export interface State {
  screen: Screen;
  nextMove: Maybe<number>;
  computerMove: Maybe<number>;
  games: Game[];
  current: number;
  count: number;
  setup: FullSetup;
}
