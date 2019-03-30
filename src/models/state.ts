import { Game, Player } from './game';
import { Code } from './parser';
import { Dictionary, Maybe } from './util';

export type Screen = 'start' | 'game';

export interface HumanPlayerSetup {
  name: string;
  type: 'human';
}

export interface ComputerPlayerSetup {
  name: string;
  type: 'computer';
  file: Maybe<File>;
  code: Code;
}

export type PlayerSetup = HumanPlayerSetup | ComputerPlayerSetup;

export type FullSetup = Dictionary<PlayerSetup, Player>;

export interface State {
  screen: Screen;
  dialog: Maybe<JSX.Element>;
  playerMove: Maybe<number>;
  computerMove: Maybe<number>;
  games: Game[];
  current: number;
  count: number;
  setup: FullSetup;
}
