
import * as React from 'react';

import { Tile } from 'src/model/state';
import './tile.scss';

export interface TileComponentParams {
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
  tile: Tile;
}

export function TileComponent({ row, col, x, y, width, height, tile }: TileComponentParams) {
  if (tile !== Tile.empty) {
    return (
      <ellipse
        key={row + ':' + col}
        data-tag='tile'
        cx={x}
        cy={y}
        style={{ transform: `translate(${(col + 0.5) * width}px, ${(row + 0.5) * height}px)`}}
        rx={width * 0.45}
        ry={height * 0.45 }
        className={'tile ' + Tile[tile]}
      />
    );
  }
  else {
    return null;
  }
}
