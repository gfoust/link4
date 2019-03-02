import { Maybe } from 'src/util';

export enum Tile {
  empty,
  playerA,
  playerB,
}

export type Board = Tile[][];

export interface Game {
  board: Tile[][];
  potential: Maybe<number>;
  turn: Tile;
}

export interface State {
  game: Game;
}
