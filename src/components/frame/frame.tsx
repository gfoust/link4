import React from 'react';

import { boardCols, boardRows } from 'src/config';
import { count2d } from 'src/util';
import { UI } from '../ui';

export interface FrameComponentParams {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function FrameComponent({ x, y, width, height }: FrameComponentParams) {
  const tileWidth = width / boardCols;
  const tileHeight = height / boardRows;

  return (
    <g>
      <defs>
        <mask id='hole-mask' maskContentUnits='objectBoundingBox'>
          <rect cx={0} cy={0} width={1} height={1} fill='white'/>
          <ellipse cx={0.5} cy={0.5} rx={0.425} ry={0.425} fill='black' />
        </mask>
      </defs>
      { count2d(boardRows, boardCols, (i, j) =>
          <UI.FrameTile
            key={`frame-tile-${i}-${j}`}
            x={x + j * tileWidth}
            y={y + i * tileHeight}
            width={tileWidth}
            height={tileHeight}
            maskId='hole-mask'
            column={j}
          />
        )
      }
    </g>
  );
}
