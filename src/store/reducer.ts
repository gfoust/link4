import { config } from 'src/config';
import { Board, Game, State } from 'src/model/state';
import { Tile } from 'src/model/tile';
import { Maybe } from 'src/util';
import { Action } from './action';

function board(state: Maybe<Board>, action: Action): Board {
  if (! state) {
    state = [ ];
    for (let i = 0; i < config.boardHeight; ++i) {
      const row: Tile[] = [ ];
      for (let j = 0; j < config.boardWidth; ++j) {
        row.push(Tile.empty);
      }
      state.push(row);
    }
  }
  return state;
}

function potential(state: Maybe<number>, action: Action): Maybe<number> {
  if (action.type === 'RegisterPotentialMove') {
    return action.column;
  }
  else {
    return state;
  }
}

function game(state: Game = { } as Game, action: Action): Game {
  return {
    board: board(state.board, action),
    potential: potential(state.potential, action),
    turn: state.turn === undefined ? Tile.playerA : state.turn,
  };
}

export function reducer(state: State = { } as State, action: Action): State {
  return {
    game: game(state.game, action),
  };
}
