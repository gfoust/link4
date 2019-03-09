import { Maybe } from 'src/util';
import { Game } from './game';

export interface State {
  nextMove: Maybe<number>;
  games: Game[];
  current: number;
  count: number;
}
