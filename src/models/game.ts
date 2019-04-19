import { Score } from 'src/services/ai';
import { Maybe } from './util';

export type Player = 'player1' | 'player2';

export type PlayerType = 'human' | 'computer';

export interface EmptyTile {
  type: 'empty';
}

export interface PlayerTile {
  type: Player;
  id: number;
}

export type Tile = EmptyTile | PlayerTile;

export type TileType = Player | 'empty';

export type Board = Tile[][];

export type Status = 'playing' | 'gameover';

export type PieceLocation = [number, number];

export type WinLocation = [PieceLocation, PieceLocation, PieceLocation, PieceLocation];

export interface Game {
  status: Status;
  board: Board;
  turn: Player;
  lastMove: Maybe<number>;
  explain: Maybe<Score[]>;
  winner: Maybe<WinLocation>;
}
