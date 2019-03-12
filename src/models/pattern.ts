import { TileType } from './game';
import { Dictionary } from './util';

export type Pattern = string[];

export interface PatternMatch {
  row: number;
  col: number;
  variables: Dictionary<TileType>;
}

export type Definitions = Dictionary<string>;

export type Priority = 'always' | 'never' | number;

export type Actions = Dictionary<Priority>;

export interface Rule {
  definitions: Definitions;
  actions: Actions;
}

export interface RuleSet {
  patterns: Pattern[];
  rules: Rule[];
}
