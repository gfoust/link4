
import * as React from 'react';
import './frame-tile.scss';

import { App } from 'src/App';
import { setNextMove, takeTurn } from 'src/store/action';

export interface FrameTileComponentParams {
  x: number;
  y: number;
  width: number;
  height: number;
  column: number;
  maskId: string;
}

export function FrameTileComponent({ x, y, width, height, column, maskId }: FrameTileComponentParams) {
  return (
    <g
      onMouseMove={() => App.store.dispatch(setNextMove(column))}
      onClick={() => App.store.dispatch(takeTurn())}
      mask={`url(#${maskId})`}
    >
      <rect
        data-tag='frame-tile'
        x={x}
        y={y}
        width={width}
        height={height}
      />
      <ellipse
        data-tag='frame-hole'
        cx={x + width / 2}
        cy={y + height / 2}
        rx={width * .435}
        ry={width * .435}
      />
    </g>
  );
}
