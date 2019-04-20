import { PieceLocation, TileType } from './game';
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

export interface Reason {
  pattern: Pattern;
  rule: Rule;
  location: PieceLocation;
}

export interface FullScore {
  priority: 'never';
  reason: 'full';
}

export interface AbsoluteScore {
  priority: 'always' | 'never';
  reason: Reason;
}

export interface RelativeScore {
  priority: number;
  reasons: Reason[];
}

export type Score = FullScore | AbsoluteScore | RelativeScore | undefined;
