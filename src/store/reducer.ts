import { combineReducers } from 'redux';

import { App } from 'src/App';
import { Board, EmptyTile, Game, Player, PlayerType, Status, Tile, WinLocation } from 'src/models/game';
import { PlayerInfo, Screen, State } from 'src/models/state';
import { Maybe } from 'src/models/util';
import { Action } from '../models/action';

const emptyTile: EmptyTile = {
  type: 'empty',
};

function board(state: Board | undefined, action: Action): Board {
  if (! state) {
    state = [ ];
    for (let i = 0; i < App.config.boardRows; ++i) {
      const row: Tile[] = [ ];
      for (let j = 0; j < App.config.boardCols; ++j) {
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
  if (state.length === 0) {
    state.push(nextGame);
  }
  switch (action.type) {
    case 'TakeTurn':
      nextGame = App.game.makeMove(nextGame, count, nextMove);
      state = state.slice(0, current + 1);
      state.push(nextGame);
      break;
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

function playerNames(state = App.state.defaultPlayerNames, action: Action): PlayerInfo<string> {
  switch (action.type) {
    case 'StartGame':
      return {
        player1: action.playerNames.player1 || App.state.defaultPlayerNames.player1,
        player2: action.playerNames.player2 || App.state.defaultPlayerNames.player2,
      };
    default:
      return state;
  }
}

function playerTypes(state = App.state.defaultPlayerTypes, action: Action): PlayerInfo<PlayerType> {
  switch (action.type) {
    case 'StartGame':
      return {
        player1: action.playerTypes.player1 || App.state.defaultPlayerTypes.player1,
        player2: action.playerTypes.player2 || App.state.defaultPlayerTypes.player2,
      };
    default:
      return state;
  }
}

export function reducer(state = { } as State, action: Action): State {
  const nextState: State = {
    nextMove: nextMove(state.nextMove, action),
    current: current(state.current, action),
    count: count(state.count, action),
    screen: screen(state.screen, action),
    games: games(state.games, state.current, state.count, state.nextMove, action),
    playerNames: playerNames(state.playerNames, action),
    playerTypes: playerTypes(state.playerTypes, action),
  };

  if (App.util.allPropertiesIdentical(state, nextState)) {
    return state;
  }
  else {
    (window as any).state = nextState;
    App.triggers.trigger(state, nextState, action);
    return nextState;
  }
}
