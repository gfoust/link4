import React from 'react';

import { App } from 'src/App';
import { Game, PlayerTile, PlayerType } from 'src/models/game';
import { PlayerInfo } from 'src/models/state';
import { Maybe } from 'src/models/util';
import { ui } from '../ui';

export interface BoardProps {
  x: number;
  y: number;
  width: number;
  height: number;
  game: Game;
  count: number;
  nextMove: Maybe<number>;
  computerMove: Maybe<number>;
  playerTypes: PlayerInfo<PlayerType>;
}

interface PlayedPiece extends PlayerTile {
  r: number;
  c: number;
  disabled?: boolean;
}

export function BoardComponent({ x, y, width, height, game, count, nextMove, computerMove, playerTypes }: BoardProps) {
  const tileWidth = width / App.config.boardCols;
  const tileHeight = height / (App.config.boardRows + 1);

  const pieces: PlayedPiece[] = [ ];

  App.util.map2d(game.board, (tile, r, c) => {
    if (tile.type !== 'empty') {
      pieces[tile.id] = { ...tile, r: r + 1, c };
    }
  });
  if (game.status === 'playing') {
    if (playerTypes[game.turn] === 'human' && nextMove !== null) {
      pieces[count] = {
        id: count,
        type: game.turn,
        r: 0,
        c: nextMove,
        disabled: !App.game.canMove(game.board, nextMove),
      };
    }
    else if (playerTypes[game.turn] === 'computer' && computerMove != null) {
      pieces[count] = {
        id: count,
        type: game.turn,
        r: 0,
        c: computerMove,
      };
    }
  }

  return (
    <g>
    { pieces.map(piece =>
          <ui.Piece
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
