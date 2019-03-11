import { PlayerType } from 'src/models/game';
import { PlayerInfo } from 'src/models/state';

export const defaultPlayerNames: PlayerInfo<string> = {
  player1: 'Player 1',
  player2: 'Player 2',
};

export const defaultPlayerTypes: PlayerInfo<PlayerType> = {
  player1: 'human',
  player2: 'human',
};
