
export interface SetNextMove {
  type: 'SetNextMove';
  column: number;
}

export function setNextMove(column: number): SetNextMove {
  return { type: 'SetNextMove', column };
}

export interface TakeTurn {
  type: 'TakeTurn';
}

export function takeTurn(): TakeTurn {
  return { type: 'TakeTurn' };
}

export interface SetCurrentGame {
  type: 'SetCurrentGame';
  value: number;
}

export function setCurrentGame(value: number) {
  return { type: 'SetCurrentGame', value };
}

export type Action = SetNextMove | TakeTurn | SetCurrentGame;
