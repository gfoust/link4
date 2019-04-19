import { Board, Game, PieceLocation, Player, Status, WinLocation } from 'src/models/game';
import { Pattern } from 'src/models/pattern';
import { Dictionary, Maybe } from 'src/models/util';
import { Score } from './ai';
import { winningPatterns } from './pattern';

// =========================================================
export function otherPlayer(player: Player): Player {
  switch (player) {
    case 'player1':
      return 'player2';
    default:
      return 'player1';
  }
}

// =========================================================
export function canPlayInColumn(board: Board, column: Maybe<number>): boolean {
  return column !== null && topOfColumn(board, column) !== -1;
}

// =========================================================
export function topOfColumn(board: Board, column: number): number {
  let top = 0;
  while (top < board.length &&  board[top][column].type === 'empty') {
    ++top;
  }
  return top - 1;
}

// =========================================================
// Find absolute locations of a certain letter in the pattern
// given an offset for the pattern
export function locationsInPattern(pattern: Pattern, letter: string, offset: PieceLocation): PieceLocation[] {
  const locs = [ ] as PieceLocation[];
  for (let r = 0; r < pattern.length; ++r) {
    const cols = pattern[r].length;
    for (let c = 0; c < cols; ++c) {
      if (pattern[r][c] === letter) {
        locs.push([r + offset[0], c + offset[1]]);
      }
    }
  }
  return locs;
}

// =========================================================
// Advance to next game by making a move in the current game
export function makeMove(game: Game, count: number, nextMove: number, explain: Maybe<Score[]>): Game {

  const top = topOfColumn(game.board, nextMove);
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
    explain,
    winner,
  };
}

// ---------------------------------------------------------
function gameWon(board: Board, player: Player): Maybe<WinLocation> {
  for (const pattern of winningPatterns) {
    const matches = matchPattern(pattern, board, player);
    if (matches.length > 0) {
      return locationsInPattern(pattern, 'X', matches[0]) as WinLocation;
    }
  }
  return null;
}

// ---------------------------------------------------------
function boardFull(board: Board): boolean {
  return board[0].every(tile => tile.type !== 'empty');
}

// =========================================================
// Find all matches of a pttern within a board
export function matchPattern(
  pattern: Pattern,
  board: Board,
  player: Player,
  defns: Dictionary<string> = { }
): PieceLocation[] {
  const rows = pattern.length;
  const cols = Math.max(...pattern.map(s => s.length));

  const matches = [ ] as PieceLocation[];

  for (let r = 0; r + rows <= board.length; ++r) {
    for (let c = 0; c + cols <= board[r].length; ++c) {
      if (matchPatternAt(pattern, board, player, r, c, defns)) {
        matches.push([r, c]);
      }
    }
  }
  return matches;
}

// ---------------------------------------------------------
// Try to match a pattern at a specific location
export function matchPatternAt(
  pattern: Pattern,
  board: Board,
  player: Player,
  row: number,
  col: number,
  defns: Dictionary<string>
): boolean {

  const rows = pattern.length;
  const maxcols = Math.max(...pattern.map(s => s.length));
  if (row + rows > board.length || col + maxcols > board[row].length) {
    return false;
  }

  for (let r = 0; r < rows; ++r) {
    const cols = pattern[r].length;
    for (let c = 0; c < cols; ++c) {
      let letter = pattern[r][c];
      if (letter.match(/[a-z]/)) {
        letter = defns[letter] || '?';
      }
      if (! tileMatches(letter, board, row + r, col + c, player)) {
        return false;
      }
    }
  }
  return true;
}

// ---------------------------------------------------------
// Test whether specific tile matches a 1-tile pattern
function tileMatches(pattern: string, board: Board, row: number, col: number, player: Player): boolean {
  const tile = board[row][col];
  switch (pattern) {
    case '+':
      return tile.type !== 'empty';
    case '-':
      return tile.type === 'empty';
    case '*':
      return tile.type === 'empty' && (row === board.length - 1 || board[row + 1][col].type !== 'empty');
    case '?':
    case ' ':
      return true;
    case 'X':
      return tile.type === player;
    case 'O':
      return tile.type === otherPlayer(player);
    default:
      return false;
  }
}
