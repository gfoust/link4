
import * as React from 'react';

import { Player } from 'src/model/state';
import './piece.scss';

export interface PieceComponentParams {
  id: string;
  row: number;
  col: number;
  x: number;
  y: number;
  width: number;
  height: number;
  player: Player;
}

export function PieceComponent({ id, row, col, x, y, width, height, player }: PieceComponentParams) {
  return (
    <ellipse
      id={id}
      data-tag='tile'
      cx={x}
      cy={y}
      style={{ transform: `translate(${(col + 0.5) * width}px, ${(row + 0.5) * height}px)`}}
      rx={width * 0.45}
      ry={height * 0.45}
      className={`tile ${Player[player]} row-${row}`}
    />
  );
}
