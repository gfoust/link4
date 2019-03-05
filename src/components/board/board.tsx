import * as React from 'react';
import { connect } from 'react-redux';
import { config } from 'src/config';

import { Game, Piece, State } from 'src/model/state';
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

interface PlayedPiece extends Piece {
  r: number;
  c: number;
  disabled: boolean;
}

export function StatelessBoardComponent({ x, y, width, height, game }: BoardComponentParams) {
  const tileWidth = width / config.boardWidth;
  const tileHeight = height / (config.boardHeight + 1);

  const pieces: PlayedPiece[] = [ ];

  map2d(game.board, (tile, r, c) => {
    if (tile !== null) {
      pieces[tile.id] = { ...tile, r: r + 1, c, disabled: false };
    }
  });
  if (game.nextMove !== null) {
    pieces[game.count] = { id: game.count, player: game.turn, r: 0, c: game.nextMove, disabled: !canMove(game) };
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
            player={piece.player}
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
