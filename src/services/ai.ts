import { App } from 'src/App';
import { Board, Player } from 'src/models/game';

export function pickMove(player: Player, board: Board) {
  const moves = [ ] as number[];
  for (let c = 0; c < App.config.boardCols; ++c) {
    if (App.game.canMove(board, c)) {
      moves.push(c);
    }
  }
  return Promise.resolve(moves[Math.floor(Math.random() * moves.length)]);
}
