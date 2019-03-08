import { Dictionary, Maybe } from 'src/util';

export type Player = 'playerA' | 'playerB';

export function otherPlayer(player: Player): Player {
  switch (player) {
    case 'playerA':
      return 'playerB';
    default:
      return 'playerA';
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

export interface Game {
  board: Board;
  turn: Player;
  count: number;
  nextMove: Maybe<number>;
}

export type Pattern = string[];

export interface PatternMatch {
  row: number;
  col: number;
  variables: Dictionary<TileType>;
}

export interface State {
  game: Game;
}
