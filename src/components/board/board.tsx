import React from 'react';
import { connect } from 'react-redux';

import { App } from 'src/App';
import { Game, PlayerTile } from 'src/models/game';
import { FullSetup, State } from 'src/models/state';
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
  setup: FullSetup;
}

interface PlayedPiece extends PlayerTile {
  r: number;
  c: number;
  disabled?: boolean;
}

export function DisconnectedBoardComponent({
  x,
  y,
  width,
  height,
  game,
  count,
  nextMove,
  computerMove,
  setup,
}: BoardProps) {
  const tileWidth = width / App.config.boardCols;
  const tileHeight = height / (App.config.boardRows + 1);

  const pieces: PlayedPiece[] = [ ];

  App.util.map2d(game.board, (tile, r, c) => {
    if (tile.type !== 'empty') {
      pieces[tile.id] = { ...tile, r: r + 1, c };
    }
  });
  if (game.status === 'playing') {
    if (setup[game.turn].type === 'human' && nextMove !== null) {
      pieces[count] = {
        id: count,
        type: game.turn,
        r: 0,
        c: nextMove,
        disabled: !App.game.canPlayInColumn(game.board, nextMove),
      };
    }
    else if (setup[game.turn].type === 'computer' && computerMove != null) {
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

export const BoardComponent = connect((state: State) => ({
  count: state.count,
  game: state.games[state.current],
  nextMove: state.playerMove,
  computerMove: state.computerMove,
  setup: state.setup,
}))(DisconnectedBoardComponent);
