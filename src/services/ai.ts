import { Move } from 'src/models/ai';
import { Board, Game, PieceLocation, Player } from 'src/models/game';
import { Maybe } from 'src/models/util';
import { canPlayInColumn, makeMove } from './game';

function evaluateStrip(board: Board, locs: PieceLocation[], player: Player) {
  let score = 0;
  let bonus = 4;
  for (const loc of locs) {
    const tile = board[loc[0]][loc[1]];
    if (tile.type === 'empty') {
      if (loc[0] === board.length - 1 || board[loc[0] + 1][loc[1]].type !== 'empty') {
        ++score;
      }
    }
    else if (tile.type === player) {
      score += bonus;
      bonus *= 2;
    }
    else {
      return 0;
    }
  }
  return score;
}

export function evaluateHorizStrips(board: Board, player: Player) {
  let score = 0;
  const maxr = board.length;
  const maxc = board[0].length - 3;
  for (let r = 0; r < maxr; ++r) {
    for (let c = 0; c < maxc; ++c) {
      score += evaluateStrip(board, [[r, c], [r, c + 1], [r, c + 2], [r, c + 3]], player);
    }
  }
  return score;
}

export function evaluateVertStrips(board: Board, player: Player) {
  let score = 0;
  const maxr = board.length - 3;
  const maxc = board[0].length;
  for (let r = 0; r < maxr; ++r) {
    for (let c = 0; c < maxc; ++c) {
      score += evaluateStrip(board, [[r, c], [r + 1, c], [r + 2, c], [r + 3, c]], player);
    }
  }
  return score;
}

export function evaluateDiagDownStrips(board: Board, player: Player) {
  let score = 0;
  const maxr = board.length - 3;
  const maxc = board[0].length - 3;
  for (let r = 0; r < maxr; ++r) {
    for (let c = 0; c < maxc; ++c) {
      score += evaluateStrip(board, [[r, c], [r + 1, c + 1], [r + 2, c + 2], [r + 3, c + 3]], player);
    }
  }
  return score;
}

export function evaluateDiagUpStrips(board: Board, player: Player) {
  let score = 0;
  const maxr = board.length;
  const maxc = board[0].length - 3;
  for (let r = 3; r < maxr; ++r) {
    for (let c = 0; c < maxc; ++c) {
      score += evaluateStrip(board, [[r, c], [r - 1, c + 1], [r - 2, c + 2], [r - 3, c + 3]], player);
    }
  }
  return score;
}

export function evaluateBoard(board: Board, player: Player) {
  return (
    evaluateHorizStrips(board, player) +
    evaluateVertStrips(board, player) +
    evaluateDiagDownStrips(board, player) +
    evaluateDiagUpStrips(board, player)
  );
}

export function planMove(game: Game, player: Player, depth: number, prune: Maybe<number> = null): Maybe<Move> {
  let moves = [] as Move[];
  let block = null as Maybe<Move>;

  if (depth < 1) {
    depth = 1;
  }

  const board = game.board;
  const playerTurn = game.turn === player;
  const otherTurn = ! playerTurn;

  const maxc = board[0].length;
  for (let c = 0; c < maxc; ++c) {
    if (! canPlayInColumn(board, c)) {
      continue;
    }

    // Play in this column
    const next = makeMove(game, 0, c, null);

    // Score the results of playing in this column
    let score: number;
    if (next.winner) {
      if (playerTurn) {
        score = Math.pow(10, 3 + depth);
        // return { column: c, score: Math.pow(10, 3 + depth) };
      }
      else {
        score = -Math.pow(10, 3 + depth);
        // return { column: c, score: Math.pow(10, 3 + depth) };
      }
    }
    else if (depth === 1) {
      score = evaluateBoard(board, player);
    }
    else {
      const move = planMove(next, player, depth - 1, moves.length > 0 ? moves[0].score : null);
      if (move === null) {
        block = null;
        continue;
      }
      score = move.score;

      if (score < 0 && (block === null || score <= block.score)) {
        block = move;
      }
    }

    // Update plan
    if (
      moves.length === 0 ||
      playerTurn && score > moves[0].score ||
      otherTurn && score < moves[0].score
    ) {
      moves = [ { column: c, score } ];

      // Check for prune
      if (
        prune !== null && (
          playerTurn && score > prune ||
          otherTurn && score < prune
        )
      ) {
        return null;
      }
    }
    else if (score === moves[0].score) {
      moves.push({ column: c, score });
    }
  }

  if (moves.length === 0) {
    const open = [] as Move[];
    for (let c = 0; c < maxc; ++c) {
      if (! canPlayInColumn(board, c)) {
        continue;
      }
      open.push({ column: c, score: -Infinity });
    }
    if (open.length === 0) {
      return null;
    }
    else {
      return open[Math.trunc(Math.random() * moveBy.length)];
    }
  }
  else if (moves[0].score >= 1e4 || moves[0].score <= -1e4) {
    let move: Move;
    if (block && moves[0].score === block.score) {
      move = block;
    }
    else if (moves.length === 1) {
      move = moves[0];
    }
    else {
      move = moves[Math.trunc(Math.random() * moves.length)];
    }
    return {
      column: move.column,
      score: move.score * moves.length,
    };
  }
  else if (moves.length === 1) {
    return moves[0];
  }
  else {
    return moves[Math.trunc(Math.random() * moves.length)];
  }
}
