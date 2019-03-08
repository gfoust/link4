import { combineReducers } from 'redux';

import { boardCols, boardRows } from 'src/config';
import { Board, EmptyTile, Game, Player, Status, Tile, WinLocation } from 'src/models/game';
import { State } from 'src/models/state';
import { takeTurn } from 'src/services/game';
import { Maybe } from 'src/util';
import { Action } from './action';

const emptyTile: EmptyTile = {
  type: 'empty',
};

function board(state: Board | undefined, action: Action): Board {
  if (! state) {
    state = [ ];
    for (let i = 0; i < boardRows; ++i) {
      const row: Tile[] = [ ];
      for (let j = 0; j < boardCols; ++j) {
        row.push(emptyTile);
      }
      state.push(row);
    }
  }
  return state;
}

function nextMove(state: Maybe<number> = null, action: Action): Maybe<number> {
  if (action.type === 'SetNextMove') {
    return action.column;
  }
  else {
    return state;
  }
}

function lastMove(state: Maybe<number> = null, action: Action): Maybe<number> {
  return state;
}

function turn(state: Player = 'player1', action: Action): Player {
  return state;
}

function count(state = 0, action: Action): number {
  return state;
}

function status(state: Status = 'playing', action: Action): Status {
  return state;
}

function winner(state: Maybe<WinLocation> = null, action: Action): Maybe<WinLocation> {
  return state;
}

const defaultGame = combineReducers({ status, turn, board, nextMove, lastMove, count, winner });

function game(state = { } as Game, action: Action) {
  state = defaultGame(state, action);
  switch (action.type) {
    case 'TakeTurn':
      return takeTurn(state);
    default:
      return state;
  }
}

export const realReducer = combineReducers({ game });

export function reducer(state: State | undefined, action: Action): State {
  state = realReducer(state, action);
  (window as any).state = state;
  return state;
}
