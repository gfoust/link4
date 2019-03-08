import { combineReducers } from 'redux';

import { boardCols, boardRows } from 'src/config';
import { Board, EmptyTile, Game, Player, Tile } from 'src/model/state';
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

function turn(state: Player = 'playerA', action: Action): Player {
  return state;
}

function count(state = 0, action: Action): number {
  return state;
}

const defaultGame = combineReducers({ board, nextMove, turn, count });

function game(state = { } as Game, action: Action) {
  state = defaultGame(state, action);
  switch (action.type) {
    case 'TakeTurn':
      return takeTurn(state);
    default:
      return state;
  }
}

export const reducer = combineReducers({ game });
