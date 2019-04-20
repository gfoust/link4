import { Board, Tile } from 'src/models/game';
import { RuleSet } from 'src/models/rules';
import { pickMove, scoreColumns } from 'src/services/rules';

function makeBoard(pattern: string[]): Board {
  let id = 0;
  return pattern.map(row => {
    const tiles = [ ] as Tile[];
    for (const letter of row) {
      if (letter === '1') {
        tiles.push({ type: 'player1', id: ++id });
      }
      else if (letter === '2') {
        tiles.push({ type: 'player2', id: ++id });
      }
      else {
        tiles.push({ type: 'empty' });
      }
    }
    return tiles;
  });
}

describe('AI', () => {
  describe('scoreColumns', () => {
    it('should score a simple always match', async () => {
      const board = makeBoard([
        '    ',
        '    ',
        '    ',
        ' 111',
      ]);

      const rulesets: RuleSet[] = [
        { patterns: [
            ['abcd'],
          ],
          rules: [
            { definitions: {
                a: '*',
                b: 'X',
                c: 'X',
                d: 'X',
              },
              actions: {
                a: 'always',
              },
            },
          ],
        },
      ];

      expect(await scoreColumns('player1', board, rulesets)).toMatchObject([
        { priority: 'always',
          reason: { pattern: rulesets[0].patterns[0], rule: rulesets[0].rules[0] },
        },
      ]);
    });

    it('should match one pattern/rule out of a list', async () => {
      const rulesets: RuleSet[] = [
        { patterns: [
            ['abcd'],
            ['a', 'b', 'c', 'd'],
            ['a', ' b', '  c', '   d'],
          ],
          rules: [
            { definitions: { a: '*', b: 'X', c: 'X', d: 'X' },
              actions: { a: 'always' },
            },
            { definitions: { a: 'X', b: '*', c: 'X', d: 'X' },
              actions: { b: 'always' },
            },
            { definitions: { a: 'X', b: 'X', c: '*', d: 'X' },
              actions: { c: 'always' },
            },
            { definitions: { a: 'X', b: 'X', c: 'X', d: '*' },
              actions: { d: 'always' },
            },
          ],
        },
      ];

      let board = makeBoard([
        '    ',
        ' 1  ',
        ' 1  ',
        ' 1  ',
      ]);
      expect(await scoreColumns('player1', board, rulesets)).toMatchObject([
        undefined,
        { priority: 'always',
          reason: { pattern: rulesets[0].patterns[1], rule: rulesets[0].rules[0] },
        },
      ]);

      board = makeBoard([
        '    ',
        '    ',
        '    ',
        '11 1',
      ]);
      expect(await scoreColumns('player1', board, rulesets)).toMatchObject([
        undefined,
        undefined,
        { priority: 'always',
          reason: { pattern: rulesets[0].patterns[0], rule: rulesets[0].rules[2] },
        },
      ]);

      board = makeBoard([
        '1   ',
        '11  ',
        '121 ',
        '222 ',
      ]);
      expect(await scoreColumns('player1', board, rulesets)).toMatchObject([
        undefined,
        undefined,
        undefined,
        { priority: 'always',
          reason: { pattern: rulesets[0].patterns[2], rule: rulesets[0].rules[3] },
        },
      ]);
    });
  });

  describe('pickMove', () => {

    it('should pick a column with always', () => {
      const scores: any[] = [
        undefined,
        undefined,
        { priority: 'always' },
      ];

      expect(pickMove(scores)).toBe(2);
    });

  });
});
