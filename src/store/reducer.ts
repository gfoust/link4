import { combineReducers } from 'redux';

import { boardCols, boardRows } from 'src/config';
import { Board, EmptyTile, Game, Player, PlayerType, Status, Tile, WinLocation } from 'src/models/game';
import { PlayerInfo, Screen, State } from 'src/models/state';
import { takeTurn } from 'src/services/game';
import { allPropertiesIdentical, Maybe } from 'src/util';
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
  if (action.type === 'StartGame') {
    state = [ ];
  }
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
    case 'StartGame':
      return 0;
    default:
      return state;
  }
}

function count(state = 0, action: Action): number {
  switch (action.type) {
    case 'TakeTurn':
      return state + 1;
    case 'StartGame':
      return 0;
    default:
      return state;
  }
}

function screen(state: Screen = 'start', action: Action): Screen {
  switch (action.type) {
    case 'SetScreen':
      return action.screen;
    case 'StartGame':
      return 'game';
    default:
      return state;
  }
}

const defaultPlayerNames: PlayerInfo<string> = {
  player1: 'Player 1',
  player2: 'Player 2',
};

function playerNames(state = defaultPlayerNames, action: Action): PlayerInfo<string> {
  switch (action.type) {
    case 'StartGame':
      return {
        player1: action.playerNames.player1 || defaultPlayerNames.player1,
        player2: action.playerNames.player2 || defaultPlayerNames.player2,
      };
    default:
      return state;
  }
}

const playerTypes: PlayerInfo<PlayerType> = {
  player1: 'human',
  player2: 'human',
};

export function reducer(state = { } as State, action: Action): State {
  const nextState: State = {
    nextMove: nextMove(state.nextMove, action),
    current: current(state.current, action),
    count: count(state.count, action),
    screen: screen(state.screen, action),
    games: games(state.games, state.current, state.count, state.nextMove, action),
    playerNames: playerNames(state.playerNames, action),
    playerTypes,
  };

  if (allPropertiesIdentical(state, nextState)) {
    return state;
  }
  else {
    return (window as any).state = nextState;
  }
}
