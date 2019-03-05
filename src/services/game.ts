import { config } from 'src/config';
import { Board, Game } from 'src/model/state';

function findTop(board: Board, column: number): number {
  let top = 0;
  while (top < config.boardHeight &&  board[top][column] === null) {
    ++top;
  }
  return top - 1;
}

export function takeTurn(game: Game): Board {
  if (game.nextMove === null) {
    return game.board;
  }

  const top = findTop(game.board, game.nextMove);
  if (top === -1) {
    return game.board;
  }

  const topRow  = [ ...game.board[top] ];
  topRow[game.nextMove] = { id: game.count, player: game.turn };

  const board = [ ...game.board ];
  board[top] = topRow;

  return board;
}

export function canMove(game: Game): boolean {
  return game.nextMove !== null && findTop(game.board, game.nextMove) !== -1;
}
