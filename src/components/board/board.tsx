import React from 'react';
import { connect } from 'react-redux';

import { boardCols, boardRows } from 'src/config';
import { Game, PlayerTile, State } from 'src/model/state';
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

export function StatelessBoardComponent({ x, y, width, height, game }: BoardComponentParams) {
  const tileWidth = width / boardCols;
  const tileHeight = height / (boardRows + 1);

  const pieces: PlayedPiece[] = [ ];

  map2d(game.board, (tile, r, c) => {
    if (tile.type !== 'empty') {
      pieces[tile.id] = { ...tile, r: r + 1, c };
    }
  });
  if (game.nextMove !== null) {
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

export const BoardComponent = connect((state: State) => ({
  game: state.game,
}))(StatelessBoardComponent);
