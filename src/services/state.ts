import { Player } from 'src/models/game';
import { FullSetup } from 'src/models/state';
import { Dictionary } from 'src/models/util';

export const defaultSetup: FullSetup = {
  player1: {
    name: '',
    type: 'human',
    file: null,
    code: null,
  },
  player2: {
    name: '',
    type: 'computer',
    file: null,
    code: null,
  },
};

export const defaultPlayerNames: Dictionary<string, Player> = {
  player1: 'Player 1',
  player2: 'Player 2',
};
