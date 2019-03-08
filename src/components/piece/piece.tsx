
import React from 'react';

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
  disabled?: boolean;
}

export function PieceComponent({ id, row, col, x, y, width, height, player, disabled }: PieceComponentParams) {
  const piece =
    <ellipse
      id={id}
      data-tag='tile'
      cx={x}
      cy={y}
      style={{ transform: `translate(${(col + 0.5) * width}px, ${(row + 0.5) * height}px)`}}
      rx={width * 0.45}
      ry={height * 0.45}
      className={`tile ${player} row-${row} ${disabled ? 'disabled' : ''}`}
    />;

  if (disabled) {
    return (
      <g>
        {piece}
        <line
          data-tag='tile'
          className='x'
          x1={x + (col + 0.1) * width}
          y1={y + (row + 0.1) * height}
          x2={x + (col + 0.9) * width}
          y2={y + (row + 0.9) * height}
        />
        <line
          data-tag='tile'
          className='x'
          x1={x + (col + 0.9) * width}
          y1={y + (row + 0.1) * height}
          x2={x + (col + 0.1) * width}
          y2={y + (row + 0.9) * height}
        />
      </g>
    );
  }
  else {
    return piece;
  }
}
