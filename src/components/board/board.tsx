import * as React from 'react';
import { connect } from 'react-redux';
import { config } from 'src/config';

import { Game, State } from 'src/model/state';
import { count, map2d } from 'src/util';
import { UI } from '../ui';

export interface BoardComponentParams {
  x: number;
  y: number;
  width: number;
  height: number;
  game: Game;
}

export function StatelessBoardComponent({ x, y, width, height, game }: BoardComponentParams) {
  const tileWidth = width / config.boardWidth;
  const tileHeight = height / (config.boardHeight + 1);

  return (
    <g>
    { count(config.boardWidth, i =>
        i === game.potential &&
          <UI.Tile
            row={0}
            col={i}
            x={x}
            y={y}
            width={tileWidth}
            height={tileHeight}
            tile={game.turn}
        />
      )
    }
    { map2d(game.board, (tile, i, j) =>
          <UI.Tile
            row={j + 1}
            col={i}
            x={x}
            y={y}
            width={tileWidth}
            height={tileHeight}
            tile={tile}
          />
        )
    }
    </g>
  );
}

export const BoardComponent = connect((state: State) => ({
  game: state.game,
}))(StatelessBoardComponent);
