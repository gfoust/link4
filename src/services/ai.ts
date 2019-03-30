import { App } from 'src/App';
import { Board, Player } from 'src/models/game';
import { Priority, RuleSet } from 'src/models/pattern';

export function pickMove(player: Player, board: Board, ruleset: RuleSet[]) {
  const priorities = [ ] as Priority[];
  for (let c = 0; c < App.config.boardCols; ++c) {
    if (App.game.canMove(board, c)) {
      priorities[c] = 0;
    }
    else {
      priorities[c] = 'never';
    }
  }

  const possibilities = [ ] as number[];
  for (let c = 0; c < App.config.boardCols; ++c) {
    if (priorities[c] !== 'never') {
      possibilities.push(c);
    }
  }

  return Promise.resolve(possibilities[Math.floor(Math.random() * possibilities.length)]);
}
