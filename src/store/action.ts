import { PlayerType } from 'src/models/game';
import { PlayerInfo, Screen } from 'src/models/state';
import { Maybe } from 'src/util';

// ---------------------------------------------------------

export interface SetNextMove {
  type: 'SetNextMove';
  column: Maybe<number>;
}

export function setNextMove(column: Maybe<number>): SetNextMove {
  return { type: 'SetNextMove', column };
}

// ---------------------------------------------------------

export interface TakeTurn {
  type: 'TakeTurn';
}

export function takeTurn(): TakeTurn {
  return { type: 'TakeTurn' };
}

// ---------------------------------------------------------

export interface SetCurrentGame {
  type: 'SetCurrentGame';
  value: number;
}

export function setCurrentGame(value: number) {
  return { type: 'SetCurrentGame', value };
}

// ---------------------------------------------------------

export interface SetScreen {
  type: 'SetScreen';
  screen: Screen;
}

export function setScreen(screen: Screen) {
  return { type: 'SetScreen', screen };
}

// ---------------------------------------------------------

export interface StartGame {
  type: 'StartGame';
  playerNames: PlayerInfo<string>;
  playerTypes: PlayerInfo<PlayerType>;
}

export function startGame(player1Name: string, player2Name: string, player1Type: PlayerType, player2Type: PlayerType) {
  return {
    type: 'StartGame',
    playerNames: {
      player1: player1Name,
      player2: player2Name,
    },
    playerTypes: {
      player1: player1Type,
      player2: player2Type,
    },
  };
}

// ---------------------------------------------------------

export type Action = SetNextMove | TakeTurn | SetCurrentGame | SetScreen | StartGame;
