import { Maybe } from 'src/util';

export enum Player {
  playerA,
  playerB,
}

export interface Piece {
  id: number;
  player: Player;
}

export type Tile = Maybe<Piece>;

export type Board = Tile[][];

export interface Game {
  board: Board;
  nextMove: Maybe<number>;
  turn: Player;
  count: number;
}

export interface State {
  game: Game;
}
