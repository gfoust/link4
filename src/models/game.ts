import { Maybe } from 'src/util';

export type Player = 'player1' | 'player2';

export function otherPlayer(player: Player): Player {
  switch (player) {
    case 'player1':
      return 'player2';
    default:
      return 'player1';
  }
}

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

export type Status = 'init' | 'playing' | 'gameover';

export type PieceLocation = [number, number];

export type WinLocation = [PieceLocation, PieceLocation, PieceLocation, PieceLocation];

export interface Game {
  status: Status;
  board: Board;
  turn: Player;
  lastMove: Maybe<number>;
  winner: Maybe<WinLocation>;
}
