import { boardCols, boardRows } from 'src/config';
import { Board, Game, otherPlayer, Player, Status, TileType } from 'src/model/game';
import { Pattern, PatternMatch, winningPatterns } from 'src/model/pattern';
import { Dictionary, Maybe } from 'src/util';

function findTop(board: Board, column: number): number {
  let top = 0;
  while (top < boardRows &&  board[top][column].type === 'empty') {
    ++top;
  }
  return top - 1;
}

export function canMove(game: Game): boolean {
  return game.nextMove !== null && findTop(game.board, game.nextMove) !== -1;
}

function gameWon(board: Board, player: Player): boolean {
  for (const pattern of winningPatterns) {
    if (matchPattern(pattern, board, player).length > 0) {
      return true;
    }
  }
  return false;
}

export function takeTurn(game: Game): Game {
  if (game.status !== 'playing' || game.nextMove === null) {
    return game;
  }

  const top = findTop(game.board, game.nextMove);
  if (top === -1) {
    return game;
  }

  const topRow  = [ ...game.board[top] ];
  topRow[game.nextMove] = { id: game.count, type: game.turn };

  const board = [ ...game.board ];
  board[top] = topRow;

  let status: Status = 'playing';
  let winner: Maybe<Player> = null;
  if (gameWon(board, game.turn)) {
    status = 'gameover';
    winner = game.turn;
  }

  return {
    status,
    board,
    count: game.count + 1,
    nextMove: game.nextMove,
    turn: otherPlayer(game.turn),
    winner,
  };
}

function tileMatches(pattern: string, board: Board, row: number, col: number, context: Dictionary<TileType>) {
  const tile = board[row][col];
  switch (pattern) {
    case '+':
      return tile.type !== 'empty';
    case '-':
      return tile.type === 'empty';
    case '*':
      return tile.type === 'empty' && (row === boardRows - 1 || board[row + 1][col].type !== 'empty');
    case '?':
    case ' ':
      return true;
    default:
      if (pattern in context) {
        return tile.type === context[pattern];
      }
      else {
        context[pattern] = tile.type;
        return true;
      }
  }
}

function matchPatternAt(
  pattern: Pattern,
  board: Board,
  player: Player,
  row: number,
  col: number
): Maybe<Dictionary<TileType>> {

  const rows = pattern.length;
  const maxcols = Math.max(...pattern.map(s => s.length));
  if (row + rows > boardRows || col + maxcols > boardCols) {
    return null;
  }

  const context = {
    X: player,
    O: otherPlayer(player),
  } as Dictionary<TileType>;

  for (let r = 0; r < rows; ++r) {
    const cols = pattern[r].length;
    for (let c = 0; c < cols; ++c) {
      if (! tileMatches(pattern[r][c], board, row + r, col + c, context)) {
        return null;
      }
    }
  }

  return context;
}

export function matchPattern(pattern: Pattern, board: Board, player: Player): PatternMatch[] {
  const rows = pattern.length;
  const cols = Math.max(...pattern.map(s => s.length));

  const matches = [ ] as PatternMatch[];

  for (let r = 0; r + rows <= boardRows; ++r) {
    for (let c = 0; c + cols <= boardCols; ++c) {
      const context = matchPatternAt(pattern, board, player, r, c);
      if (context) {
        matches.push({
          row: r,
          col: c,
          variables: context,
        });
      }
    }
  }
  return matches;
}
