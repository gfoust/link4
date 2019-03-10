import { combineReducers } from 'redux';

import { boardCols, boardRows } from 'src/config';
import { Board, EmptyTile, Game, Player, Status, Tile, WinLocation } from 'src/models/game';
import { Screen, State } from 'src/models/state';
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

const game = combineReducers({ status, turn, board, lastMove, winner });

// tslint:disable-next-line no-shadowed-variable
function games(state = [ ] as Game[], current: number, count: number, nextMove: Maybe<number>, action: Action): Game[] {
  let nextGame = game(state[current], action);
  switch (action.type) {
    case 'TakeTurn':
      nextGame = takeTurn(nextGame, count, nextMove);
      setTimeout(() => (document.getElementById(`turn-${current}`) as HTMLElement).scrollIntoView(), 10);
  }
  if (nextGame !== state[current]) {
    state = state.slice(0, current + 1);
    state.push(nextGame);
  }
  return state;
}

function current(state = 0, action: Action): number {
  switch (action.type) {
    case 'SetCurrentGame':
      return action.value;
    case 'TakeTurn':
      return state + 1;
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

function screen(state: Screen = 'start', action: Action): Screen {
  switch (action.type) {
    case 'SetScreen':
      return action.screen;
    default:
      return state;
  }
}

export function reducer(state = { } as State, action: Action): State {
  const nextState = { } as State;

  nextState.nextMove = nextMove(state.nextMove, action);
  nextState.current = current(state.current, action);
  nextState.count = count(state.count, action);
  nextState.screen = screen(state.screen, action);
  nextState.games = games(state.games, state.current, state.count, state.nextMove, action);

  if (nextState.screen === state.screen &&
      nextState.nextMove === state.nextMove &&
      nextState.games === state.games &&
      nextState.current === state.current &&
      nextState.count === state.count
  ) {
    return state;
  }
  else {
    return (window as any).state = nextState;
  }
}
