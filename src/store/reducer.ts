import { combineReducers } from 'redux';

import { config } from 'src/config';
import { Board, Game, Player, Tile } from 'src/model/state';
import { takeTurn } from 'src/services/game';
import { Action } from './action';

function board(state: Board | undefined, action: Action): Board {
  if (! state) {
    state = [ ];
    for (let i = 0; i < config.boardHeight; ++i) {
      const row: Tile[] = [ ];
      for (let j = 0; j < config.boardWidth; ++j) {
        row.push(null);
      }
      state.push(row);
    }
  }
  return state;
}

function nextMove(state: number | null = null, action: Action): number | null {
  if (action.type === 'SetNextMove') {
    return action.column;
  }
  else {
    return state;
  }
}

function turn(state = Player.playerA, action: Action): Player {
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
      return {
        board: takeTurn(state),
        nextMove: state.nextMove,
        turn: state.turn === Player.playerA ? Player.playerB : Player.playerA,
        count: state.count + 1,
      };
    default:
      return state;
  }
}

export const reducer = combineReducers({ game });
