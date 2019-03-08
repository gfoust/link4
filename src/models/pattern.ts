import { Dictionary } from 'src/util';
import { TileType } from './game';

export type Pattern = string[];

export interface PatternMatch {
  row: number;
  col: number;
  variables: Dictionary<TileType>;
}

export const winningPatterns = [
  ['XXXX',
  ],
  ['X',
   'X',
   'X',
   'X',
  ],
  ['X',
   ' X',
   '  X',
   '   X',
  ],
  ['   X',
   '  X',
   ' X',
   'X',
  ],
];
