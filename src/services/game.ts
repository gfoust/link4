import { Board, Game, Tile } from 'src/model/state';

function findTop(board: Board, column: number): number {
  let top = 0;
  while (board[top][column] === Tile.empty) {
    ++top;
  }
  return top - 1;
}

export function takeTurn(game: Game): Game {
  if (game.potential === undefined) {
    return game;
  }

  const top = findTop(game.board, game.potential);
  if (top === -1) {
    return game;
  }

  const topRow  = [ ...game.board[top] ];
  topRow[game.potential] = game.turn;

  const board = [ ...game.board ];
  board[top] = topRow;

  return {
    board,
    potential: undefined,
    turn: game.turn === Tile.playerA ? Tile.playerB : Tile.playerA,
  };
}
