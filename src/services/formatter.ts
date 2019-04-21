import { Board } from 'src/models/game';
import { CodeSection } from 'src/models/parser';
import { Reason } from 'src/models/rules';
import { Pattern, Rule } from 'src/models/rules';

export function formatReason(reason: Reason) {
  return formatPattern(reason.pattern).concat(formatRule(reason.rule));
}

export function formatPattern(pattern: Pattern): CodeSection[] {
  const sections = [ ] as CodeSection[];

  for (const row of pattern) {
    const groups = row.match(/[a-z]+|[^a-z]+/g);
    if (groups) {
      for (const group of groups) {
        if (group.match(/[a-z]/)) {
          sections.push({ text: group, className: 'variable', description: null });
        }
        else {
          sections.push({ text: group, className: 'pattern', description: null });
        }
      }
    }
    sections.push({ text: '\n', className: 'whitespace', description: null });
  }

  return sections;
}

export function formatRule(rule: Rule): CodeSection[] {
  const sections = [ ] as CodeSection[];

  let first = true;
  for (const name in rule.definitions) {
    if (first) {
      first = false;
    }
    else {
      sections.push({ text: ', ', className: 'comma', description: null });
    }
    sections.push(
      { text: name, className: 'variable', description: null },
      { text: '=', className: 'equals', description: null },
      { text: rule.definitions[name], className: 'pattern', description: null }
    );
  }
  sections.push({ text: ' : ', className: 'colon', description: null });
  first = true;
  for (const name in rule.actions) {
    if (first) {
      first = false;
    }
    else {
      sections.push({ text: ', ', className: 'comma', description: null });
    }
    sections.push({ text: name, className: 'variable', description: null });
    const priority = rule.actions[name];
    if (priority === 'always') {
      sections.push({ text: '+!', className: 'pos-priority', description: null });
    }
    else if (priority === 'never') {
      sections.push({ text: '-!', className: 'neg-priority', description: null });
    }
    else if (priority >= 0) {
      sections.push({ text: '+' + priority, className: 'pos-priority', description: null });
    }
    else {
      sections.push({ text: String(priority), className: 'neg-priority', description: null });
    }
  }
  sections.push({ text: '\n', className: 'whitespace', description: null });

  return sections;
}

export function formatBoard(board: Board, { pattern, rule, location }: Reason): CodeSection[] {
  const sections = [ ] as CodeSection[];
  for (let r = 0; r < board.length; ++r) {
    for (let c = 0; c < board[r].length; ++c) {
      const tile = board[r][c];
      const patrow = pattern[r - location[0]];
      if (patrow && c >= location[1] && c < location[1] + patrow.length) {
        let letter = patrow[c - location[1]];
        if (letter === ' ') {
          letter = '?';
        }
        if (letter === '*' || rule.definitions[letter] === '*') {
          sections.push({ text: letter, className: 'playable', description: null });
        }
        else {
          sections.push({ text: letter, className: tile.type, description: null });
        }
      }
      else {
        // sections.push({ text: '\u25cf', className: tile.type, description: null });
        if (tile.type === 'empty' && (r === board.length - 1 || board[r + 1][c].type !== 'empty')) {
          sections.push({ text: '\u2022', className: 'playable', description: null });
        }
        else {
          sections.push({ text: '\u2022', className: tile.type, description: null });
        }
      }
    }
    sections.push({ text: '\n', className: 'whitespace', description: null });
  }

  return sections;
}
