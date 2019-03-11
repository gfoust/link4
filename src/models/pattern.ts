import { TileType } from './game';
import { Dictionary } from './util';

export type Pattern = string[];

export interface PatternMatch {
  row: number;
  col: number;
  variables: Dictionary<TileType>;
}
