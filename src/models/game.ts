import { Score } from './rules';
import { Maybe } from './util';

export type Player = 'player1' | 'player2';

export type PlayerType = 'human' | 'rules' | 'ai';

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

export interface GameSummary {
  status: Status;
  board: Board;
  turn: Player;
}

export interface Game extends GameSummary {
  lastMove: Maybe<number>;
  explain: Maybe<Score[]>;
  winner: Maybe<WinLocation>;
}
