import React from 'react';

import { App } from 'src/App';
import { setNextMove, takeTurn } from 'src/store/action';
import './frame-tile.scss';

export interface FrameTileComponentParams {
  x: number;
  y: number;
  width: number;
  height: number;
  column: number;
  maskId: string;
  active: boolean;
}

export function FrameTileComponent({ x, y, width, height, column, maskId, active }: FrameTileComponentParams) {
  return (
    <g
      onMouseMove={() => active && App.store.dispatch(setNextMove(column))}
      onClick={() => active && App.store.dispatch(takeTurn())}
      mask={`url(#${maskId})`}
    >
      <rect
        className='frame-tile'
        x={x}
        y={y}
        width={width}
        height={height}
      />
      <ellipse
        className='frame-hole'
        cx={x + width / 2}
        cy={y + height / 2}
        rx={width * .435}
        ry={width * .435}
      />
    </g>
  );
}
