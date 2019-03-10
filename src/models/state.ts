import { Maybe } from 'src/util';
import { Game } from './game';

export type Screen = 'start' | 'game';

export interface State {
  screen: Screen;
  nextMove: Maybe<number>;
  games: Game[];
  current: number;
  count: number;
}
