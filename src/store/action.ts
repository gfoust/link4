
export interface SetNextMove {
  type: 'SetNextMove';
  column: number;
}

export function setNextMove(column: number): SetNextMove {
  return {
    type: 'SetNextMove',
    column,
  };
}

export interface TakeTurn {
  type: 'TakeTurn';
}

export function takeTurn(): TakeTurn {
  return {
    type: 'TakeTurn',
  };
}

export type Action = SetNextMove | TakeTurn;
