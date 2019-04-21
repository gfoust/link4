import { Board, Game, Tile } from 'src/models/game';
import { evaluateHorizStrips, evaluateVertStrips, planMove } from 'src/services/ai';

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

  describe('evaluateHorizStrips', () => {

    it('should score a blank board', () => {
      const board = makeBoard([
        '       ',
        '       ',
      ]);

      expect(evaluateHorizStrips(board, 'player1')).toBe(16);
      expect(evaluateHorizStrips(board, 'player2')).toBe(16);
    });

    it('should score a board with 1 piece', () => {
      const board = makeBoard([
        '       ',
        '   1   ',
      ]);

      expect(evaluateHorizStrips(board, 'player1')).toBe(32);
      expect(evaluateHorizStrips(board, 'player2')).toBe(4);
    });

    it('should score a board with 2 pieces flat', () => {
      const board = makeBoard([
        '       ',
        '  1  2 ',
      ]);

      expect(evaluateHorizStrips(board, 'player1')).toBe(19);
      expect(evaluateHorizStrips(board, 'player2')).toBe(12);
    });

    it('should score a board with 2 pieces stacked', () => {
      const board = makeBoard([
        '       ',
        '  2    ',
        '  1    ',
      ]);

      expect(evaluateHorizStrips(board, 'player1')).toBe(28);
      expect(evaluateHorizStrips(board, 'player2')).toBe(19);
    });

  });

  describe('evaluateVertStrips', () => {

    it('should score a blank board', () => {
      const board = makeBoard([
        '       ',
        '       ',
        '       ',
        '       ',
        '       ',
      ]);

      expect(evaluateVertStrips(board, 'player1')).toBe(7);
      expect(evaluateVertStrips(board, 'player2')).toBe(7);
    });

    it('should score a board with 1 piece', () => {
      const board = makeBoard([
        '       ',
        '       ',
        '       ',
        '       ',
        '   1   ',
      ]);

      expect(evaluateVertStrips(board, 'player1')).toBe(12);
      expect(evaluateVertStrips(board, 'player2')).toBe(7);
    });

    it('should score a board with 2 pieces flat', () => {
      const board = makeBoard([
        '       ',
        '       ',
        '       ',
        '       ',
        '  1  2 ',
      ]);

      expect(evaluateVertStrips(board, 'player1')).toBe(12);
      expect(evaluateVertStrips(board, 'player2')).toBe(12);
    });

    it('should score a board with 2 pieces flat', () => {
      const board = makeBoard([
        '       ',
        '       ',
        '       ',
        '       ',
        '  2    ',
        '  1    ',
      ]);

      expect(evaluateVertStrips(board, 'player1')).toBe(7);
      expect(evaluateVertStrips(board, 'player2')).toBe(12);
    });

  });

  describe('planMove', () => {

    it('should pick the right move', () => {
      const board = makeBoard([
        '       ',
        '  21   ',
        '  12 2 ',
        '  21 1 ',
        '  12 21',
        '  21112',
      ]);
      const game: Game = {
        status: 'playing',
        board,
        turn: 'player2',
        winner: null,
        lastMove: null,
        explain: null,
      };

      expect(planMove(game, 'player2', 2)).toMatchObject({column: 4});
    });

    it('should pick the right move', () => {
      const board = makeBoard([
        '       ',
        '  21   ',
        '  12 2 ',
        '  21 1 ',
        '  12 21',
        '  21112',
      ]);
      const game: Game = {
        status: 'playing',
        board,
        turn: 'player1',
        winner: null,
        lastMove: null,
        explain: null,
      };

      expect(planMove(game, 'player1', 6)).toMatchObject({column: 4});
    });

  });

});
