import { App } from 'src/App';
import { Board, Player } from 'src/models/game';
import { Pattern, Rule, RuleSet } from 'src/models/pattern';
import { locationsInPattern } from './game';

export interface Reason {
  pattern: Pattern;
  rule: Rule;
}

export interface FullScore {
  priority: 'never';
  reason: 'full';
}

export interface AbsoluteScore {
  priority: 'always' | 'never';
  reason: Reason;
}

export interface RelativeScore {
  priority: number;
  reasons: Reason[];
}

export type Score = FullScore | AbsoluteScore | RelativeScore | undefined;

export async function scoreColumns(player: Player, board: Board, rulesets: RuleSet[]): Promise<Score[]> {
  let scores = [ ] as Score[];
  for (let c = 0; c < board[0].length; ++c) {
    if (App.game.canPlayInColumn(board, c)) {
      scores[c] = { priority: 0, reasons: [] };
    }
    else {
      scores[c] = { priority: 'never', reason: 'full' };
    }
  }

  for (const ruleset of rulesets) {
    for (const pattern of ruleset.patterns) {
      for (const rule of ruleset.rules) {
        for (const match of App.game.matchPattern(pattern, board, player, rule.definitions)) {
          for (const name in rule.actions) {
            for (const location of locationsInPattern(pattern, name, match)) {
              const c = location[1];
              const p = rule.actions[name];
              const reason = { pattern, rule };
              if (p === 'always') {
                if (scores[c]!.priority !== 'never') {
                  scores = [];
                  scores[c] = { priority: 'always', reason };
                  return scores;
                }
              }
              else if (p === 'never') {
                if (scores[c]!.priority !== 'never') {
                  scores[c] = { priority: 'never', reason };
                }
              }
              else {
                if (typeof scores[c]!.priority === 'number') {
                  const score = scores[c] as RelativeScore;
                  score.priority += p;
                  score.reasons.push(reason);
                }
              }
            }
          }
        }
      }
    }
  }

  return scores;
}

export function pickMove(scores: Score[]): number {
  let possibilities = [ ] as number[];
  let maxScore = -Infinity;
  for (let c = 0; c < scores.length; ++c) {
    const s = scores[c];
    if (!s) { continue; }

    const p = s.priority;
    if (p === 'always') {
      return c;
    }
    else if (p !== 'never') {
      if (p > maxScore) {
        possibilities = [c];
        maxScore = p;
      }
      if (p === maxScore) {
        possibilities.push(c);
      }
    }
  }

  return possibilities[Math.floor(Math.random() * possibilities.length)];
}
