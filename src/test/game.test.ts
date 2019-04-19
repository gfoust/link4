import { Board, Tile } from 'src/models/game';
import { locationsInPattern, matchPattern, matchPatternAt, topOfColumn } from 'src/services/game';

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

describe('Game', () => {

  describe('topOfColumn', () => {

    it('should find the top of a column', () => {
      const board = makeBoard([
        '      1',
        '     11',
        '    111',
        '   1111',
        '  11111',
        ' 111111',
      ]);
      for (let i = 0; i < 7; ++i) {
        expect(topOfColumn(board, i)).toBe(5 - i);
      }
    });

  });

  describe('locationsInPattern', () => {

    it('should find a single location in the pattern', () => {
      const pattern = [
        '   X  ',
        '      ',
      ];
      expect(locationsInPattern(pattern, 'X', [0, 0])).toMatchObject([[0, 3]]);
    });

    it('should find all locations in the pattern', () => {
      const pattern = ['aaaa'];
      expect(locationsInPattern(pattern, 'a', [0, 0])).toMatchObject([
        [0, 0], [0, 1], [0, 2], [0, 3],
      ]);
    });

    it('should find multiple locations in the pattern', () => {
      const pattern = [
        '      X',
        '    X  ',
        'X    X ',
        '   XXX ',
      ];
      expect(locationsInPattern(pattern, 'X', [0, 0])).toMatchObject([
        [0, 6], [1, 4], [2, 0], [2, 5], [3, 3], [3, 4], [3, 5],
      ]);
    });

    it('should offset locations by given point', () => {
      const pattern = [
        '      X',
        '    X  ',
        'X    X ',
        '   XXX ',
      ];
      expect(locationsInPattern(pattern, 'X', [2, 3])).toMatchObject([
        [2, 9], [3, 7], [4, 3], [4, 8], [5, 6], [5, 7], [5, 8],
      ]);
    });

  });

  describe('matchPatternAt', () => {

    it('should match a horizontal pattern of Xs', () => {
      const pattern = ['XX'];
      const board = makeBoard(['1122']);

      expect(matchPatternAt(pattern, board, 'player1', 0, 0, { })).toBe(true);
      expect(matchPatternAt(pattern, board, 'player1', 0, 2, { })).toBe(false);
      expect(matchPatternAt(pattern, board, 'player2', 0, 0, { })).toBe(false);
      expect(matchPatternAt(pattern, board, 'player2', 0, 2, { })).toBe(true);
    });

    it('should match a horizontal pattern of Os', () => {
      const pattern = ['OO'];
      const board = makeBoard(['1122']);

      expect(matchPatternAt(pattern, board, 'player1', 0, 0, { })).toBe(false);
      expect(matchPatternAt(pattern, board, 'player1', 0, 2, { })).toBe(true);
      expect(matchPatternAt(pattern, board, 'player2', 0, 0, { })).toBe(true);
      expect(matchPatternAt(pattern, board, 'player2', 0, 2, { })).toBe(false);
    });

    it('should match a vertical pattern of Xs', () => {
      const pattern = ['X', 'X'];
      const board = makeBoard(['1', '1', '2', '2']);

      expect(matchPatternAt(pattern, board, 'player1', 0, 0, { })).toBe(true);
      expect(matchPatternAt(pattern, board, 'player1', 2, 0, { })).toBe(false);
      expect(matchPatternAt(pattern, board, 'player2', 0, 0, { })).toBe(false);
      expect(matchPatternAt(pattern, board, 'player2', 2, 0, { })).toBe(true);
    });

    it('should match a vertical pattern of Os', () => {
      const pattern = ['O', 'O'];
      const board = makeBoard(['1', '1', '2', '2']);

      expect(matchPatternAt(pattern, board, 'player1', 0, 0, { })).toBe(false);
      expect(matchPatternAt(pattern, board, 'player1', 2, 0, { })).toBe(true);
      expect(matchPatternAt(pattern, board, 'player2', 0, 0, { })).toBe(true);
      expect(matchPatternAt(pattern, board, 'player2', 2, 0, { })).toBe(false);
    });

    it('should match a horizontal pattern of + and -', () => {
      const pattern = ['+-'];
      const board = makeBoard(['2  11 ']);

      expect(matchPatternAt(pattern, board, 'player1', 0, 0, { })).toBe(true);
      expect(matchPatternAt(pattern, board, 'player1', 0, 1, { })).toBe(false);
      expect(matchPatternAt(pattern, board, 'player1', 0, 2, { })).toBe(false);
      expect(matchPatternAt(pattern, board, 'player1', 0, 3, { })).toBe(false);
      expect(matchPatternAt(pattern, board, 'player1', 0, 4, { })).toBe(true);
    });

    it('should match a pattern of *', () => {
      const pattern = ['*'];
      const board = makeBoard([
        '  ',
        '1 ',
      ]);

      expect(matchPatternAt(pattern, board, 'player1', 0, 0, { })).toBe(true);
      expect(matchPatternAt(pattern, board, 'player1', 0, 1, { })).toBe(false);
      expect(matchPatternAt(pattern, board, 'player1', 1, 0, { })).toBe(false);
      expect(matchPatternAt(pattern, board, 'player1', 1, 1, { })).toBe(true);
    });

    it('should match a pattern of ?', () => {
      const pattern = ['?'];
      const board = makeBoard(['1  ', '21 ']);

      for (let r = 0; r < board.length; ++r) {
        for (let c = 0; c < board[r].length; ++c) {
          expect(matchPatternAt(pattern, board, 'player1', r, c, { })).toBe(true);
        }
      }
    });

    it('should match a complex 2-d pattern', () => {
      const pattern = [
        'X-*',
        '+?O',
      ];
      const board = makeBoard([
        '1  1  1  ',
        '1122111 2',
        '1 12     ',
        '122211   ',
        '1  1  1  ',
        '212 12122',
      ]);

      expect(matchPatternAt(pattern, board, 'player1', 0, 0, { })).toBe(true);
      expect(matchPatternAt(pattern, board, 'player1', 0, 3, { })).toBe(false);
      expect(matchPatternAt(pattern, board, 'player1', 0, 6, { })).toBe(true);
      expect(matchPatternAt(pattern, board, 'player2', 2, 0, { })).toBe(false);
      expect(matchPatternAt(pattern, board, 'player2', 2, 3, { })).toBe(true);
      expect(matchPatternAt(pattern, board, 'player2', 2, 6, { })).toBe(false);
      expect(matchPatternAt(pattern, board, 'player1', 4, 0, { })).toBe(true);
      expect(matchPatternAt(pattern, board, 'player1', 4, 2, { })).toBe(false);
      expect(matchPatternAt(pattern, board, 'player1', 4, 6, { })).toBe(true);
    });

    it('should use variable definitions when matching a pattern', () => {
      const pattern = ['a', 'b', 'c', 'd'];
      const board = makeBoard([' ', '1', '2', '1']);

      let defns = { a: '*', b: 'X', c: 'O', d: '+'};
      expect(matchPatternAt(pattern, board, 'player1', 0, 0, defns)).toBe(true);

      defns = { a: '*', b: 'X', c: 'O', d: 'O'};
      expect(matchPatternAt(pattern, board, 'player1', 0, 0, defns)).toBe(false);

      defns = { a: '-', b: '+', c: '?', d: 'X'};
      expect(matchPatternAt(pattern, board, 'player1', 0, 0, defns)).toBe(true);

    });

    it('should match a vertical win pattern', () => {
      const pattern = ['a', 'b', 'c', 'd'];
      const board = makeBoard(['    ', ' 1  ', ' 1  ', ' 1  ']);
      const defns = { a: '*', b: 'X', c: 'X', d: 'X'};

      expect(matchPatternAt(pattern, board, 'player1', 0, 1, defns)).toBe(true);
    });

  });

  describe('matchPattern', () => {

    it('should match a simple pattern', () => {
      const pattern = ['aXb'];
      const board = makeBoard([
        '       ',
        '       ',
        '       ',
        '       ',
        '       ',
        '    111',
      ]);

      const defns = {
        a: 'X',
        b: 'X',
      };

      expect(matchPattern(pattern, board, 'player1', defns)).toMatchObject([
        [5, 4],
      ]);
    });

    it('should report multiple matches', () => {
      let pattern = ['XO'];
      const board = makeBoard([
        ' 1  21 ',
        '  12  2',
        '12   12',
        '2  212  ',
        '  12  1',
        ' 21 12 ',
      ]);

      expect(matchPattern(pattern, board, 'player1', { })).toMatchObject([
        [1, 2],
        [2, 0],
        [2, 5],
        [3, 4],
        [4, 2],
        [5, 4],
      ]);

      pattern = ['OX'];
      expect(matchPattern(pattern, board, 'player1', { })).toMatchObject([
        [0, 4],
        [3, 3],
        [5, 1],
      ]);

    });

    it('should match a vertical win pattern', () => {
      const pattern = ['a', 'b', 'c', 'd'];
      const board = makeBoard(['    ', ' 1  ', ' 1  ', ' 1  ']);
      const defns = { a: '*', b: 'X', c: 'X', d: 'X'};

      expect(matchPattern(pattern, board, 'player1', defns)).toMatchObject([
        [0, 1],
      ]);
    });

  });

});
