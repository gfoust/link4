import React from 'react';

import { boardCols, boardRows } from 'src/config';
import { Game, PlayerTile } from 'src/models/game';
import { canMove } from 'src/services/game';
import { map2d } from 'src/util';
import { UI } from '../ui';

export interface BoardComponentParams {
  x: number;
  y: number;
  width: number;
  height: number;
  game: Game;
}

interface PlayedPiece extends PlayerTile {
  r: number;
  c: number;
  disabled?: boolean;
}

export function BoardComponent({ x, y, width, height, game }: BoardComponentParams) {
  const tileWidth = width / boardCols;
  const tileHeight = height / (boardRows + 1);

  const pieces: PlayedPiece[] = [ ];

  map2d(game.board, (tile, r, c) => {
    if (tile.type !== 'empty') {
      pieces[tile.id] = { ...tile, r: r + 1, c };
    }
  });
  if (game.status === 'playing' && game.nextMove !== null) {
    pieces[game.count] = { id: game.count, type: game.turn, r: 0, c: game.nextMove, disabled: !canMove(game) };
  }

  return (
    <g>
    { pieces.map(piece =>
          <UI.Piece
            key={`tile-${piece.id}`}
            id={`tile-${piece.id}`}
            row={piece.r}
            col={piece.c}
            x={x}
            y={y}
            width={tileWidth}
            height={tileHeight}
            player={piece.type}
            disabled={piece.disabled}
          />
        )
    }
    </g>
  );
}
