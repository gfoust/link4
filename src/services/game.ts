import { App } from 'src/App';
import { Board, Game, PieceLocation, Player, Status, TileType, WinLocation } from 'src/models/game';
import { Pattern, PatternMatch } from 'src/models/pattern';
import { Dictionary, Maybe } from 'src/models/util';
import { winningPatterns } from './pattern';

export function otherPlayer(player: Player): Player {
  switch (player) {
    case 'player1':
      return 'player2';
    default:
      return 'player1';
  }
}

export function findTop(board: Board, column: number): number {
  let top = 0;
  while (top < App.config.boardRows &&  board[top][column].type === 'empty') {
    ++top;
  }
  return top - 1;
}

export function canMove(board: Board, nextMove: Maybe<number>): boolean {
  return nextMove !== null && findTop(board, nextMove) !== -1;
}

function findAll(pattern: Pattern, letter: string, offset: PieceLocation = [0, 0]): PieceLocation[] {
  const locs = [ ] as PieceLocation[];
  for (let r = 0; r < pattern.length; ++r) {
    const cols = pattern[r].length;
    for (let c = 0; c < cols; ++c) {
      if (pattern[r][c] === 'X') {
        locs.push([r + offset[0], c + offset[1]]);
      }
    }
  }
  return locs;
}

function gameWon(board: Board, player: Player): Maybe<WinLocation> {
  for (const pattern of winningPatterns) {
    const matches = matchPattern(pattern, board, player);
    if (matches.length > 0) {
      return findAll(pattern, 'X', [ matches[0].row, matches[0].col ]) as WinLocation;
    }
  }
  return null;
}

function boardFull(board: Board): boolean {
  return board[0].every(tile => tile.type !== 'empty');
}

export function makeMove(game: Game, count: number, nextMove: Maybe<number>): Game {
  if (game.status !== 'playing' || nextMove === null) {
    return game;
  }

  const top = findTop(game.board, nextMove);
  if (top === -1) {
    return game;
  }

  const topRow  = [ ...game.board[top] ];
  topRow[nextMove] = { id: count, type: game.turn };

  const board = [ ...game.board ];
  board[top] = topRow;

  let status: Status = 'playing';
  const winner: Maybe<WinLocation> = gameWon(board, game.turn);
  if (winner) {
    status = 'gameover';
  }
  if (boardFull(board)) {
    status = 'gameover';
  }

  return {
    status,
    turn: otherPlayer(game.turn),
    board,
    lastMove: nextMove,
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
      return tile.type === 'empty' && (row === App.config.boardRows - 1 || board[row + 1][col].type !== 'empty');
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
  if (row + rows > App.config.boardRows || col + maxcols > App.config.boardCols) {
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

  for (let r = 0; r + rows <= App.config.boardRows; ++r) {
    for (let c = 0; c + cols <= App.config.boardCols; ++c) {
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
