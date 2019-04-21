import { Game, Player } from './game';
import { Code } from './parser';
import { Dictionary, Maybe } from './util';

export type Screen = 'start' | 'game';

export interface HumanPlayerSetup {
  name: string;
  type: 'human';
}

export interface RulesPlayerSetup {
  name: string;
  type: 'rules';
  file: Maybe<File>;
  code: Code;
}

export interface AiPlayerSetup {
  name: string;
  type: 'ai';
  depth: number;
}

export type PlayerSetup = HumanPlayerSetup | RulesPlayerSetup | AiPlayerSetup;

export type FullSetup = Dictionary<PlayerSetup, Player>;

export interface State {
  screen: Screen;
  dialog: Maybe<JSX.Element>;
  playerMove: Maybe<number>;
  computerMove: Maybe<number>;
  games: Game[];
  gameId: number;
  current: number;
  count: number;
  setup: FullSetup;
}
