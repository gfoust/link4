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

function status(state: Status = 'playing', action: Action): Status {
  return state;
}

function winner(state: Maybe<WinLocation> = null, action: Action): Maybe<WinLocation> {
  return state;
}

const defaultGame = combineReducers({ status, turn, board, lastMove, winner });

// can't use state; need new data
function games(state = [ ] as Game[], cr: number, ct: number, nm: Maybe<number>, action: Action): Game[] {
  let nextGame = defaultGame(state[cr], action);
  if (nextGame !== state[cr]) {
    state = state.slice(0, cr + 1);
    state.push(nextGame);
  }
  switch (action.type) {
    case 'TakeTurn':
      nextGame = takeTurn(state[cr], ct, nm);
      if (nextGame !== state[cr]) {
        state = state.slice(0, cr + 1);
        state.push(nextGame);
      }
      setTimeout(() => (document.getElementById(`turn-${cr}`) as HTMLElement).scrollIntoView(), 10);
  }
  return state;
}

function current(state = 0, action: Action): number {
  switch (action.type) {
    case 'SetCurrentGame':
      return action.value;
    default:
      return state;
  }
}

function count(state = 0, action: Action): number {
  switch (action.type) {
    case 'TakeTurn':
      return state + 1;
    default:
      return state;
  }
}

export function reducer(state = { } as State, action: Action): State {
  const nm = nextMove(state.nextMove, action);
  let cr = current(state.current, action);
  const gs = games(state.games, cr, state.count, nm, action);
  const ct = count(state.count, action);
  if (gs !== state.games) {
    cr = gs.length - 1;
  }
  if (nm === state.nextMove && gs === state.games && cr === state.current && ct === state.count) {
    return state;
  }
  else {
    return (window as any).state = {
      nextMove: nm,
      games: gs,
      current: cr,
      count: ct,
    };
  }
}
