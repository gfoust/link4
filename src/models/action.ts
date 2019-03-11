import { Player } from 'src/models/game';
import { PlayerSetup, Screen } from 'src/models/state';
import { Dictionary, Maybe } from './util';

// ---------------------------------------------------------

export interface SetNextMove {
  type: 'SetNextMove';
  column: Maybe<number>;
}

export function setNextMove(column: Maybe<number>): SetNextMove {
  return { type: 'SetNextMove', column };
}

// ---------------------------------------------------------

export interface SetComputerMove {
  type: 'SetComputerMove';
  column: Maybe<number>;
}

export function setComputerMove(column: Maybe<number>): SetComputerMove {
  return { type: 'SetComputerMove', column };
}

// ---------------------------------------------------------

export interface TakeTurn {
  type: 'TakeTurn';
  move: number;
}

export function takeTurn(move: number): TakeTurn {
  return { type: 'TakeTurn', move };
}

// ---------------------------------------------------------

export interface SetCurrentGame {
  type: 'SetCurrentGame';
  value: number;
}

export function setCurrentGame(value: number): SetCurrentGame {
  return { type: 'SetCurrentGame', value };
}

// ---------------------------------------------------------

export interface SetScreen {
  type: 'SetScreen';
  screen: Screen;
}

export function setScreen(screen: Screen): SetScreen {
  return { type: 'SetScreen', screen };
}

// ---------------------------------------------------------

export interface SetDialog {
  type: 'SetDialog';
  dialog: Maybe<JSX.Element>;
}

export function setDialog(dialog: Maybe<JSX.Element>): SetDialog {
  return { type: 'SetDialog', dialog };
}

// ---------------------------------------------------------

export interface StartGame {
  type: 'StartGame';
  setup: Dictionary<PlayerSetup, Player>;
}

export function startGame(
  player1Setup: PlayerSetup,
  player2Setup: PlayerSetup
): StartGame {
  return {
    type: 'StartGame',
    setup: {
      player1: player1Setup,
      player2: player2Setup,
    },
  };
}

// ---------------------------------------------------------

export type Action = SetNextMove  | SetComputerMove | TakeTurn | SetCurrentGame | SetScreen | SetDialog | StartGame;
