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
  highlight?: boolean;
}

export function FrameTileComponent({
  x,
  y,
  width,
  height,
  column,
  maskId,
  active,
  highlight,
}: FrameTileComponentParams) {

  const activeClass = active ? 'active' : '';
  const highlightClass = highlight ? 'highlight' : '';
  return (
    <g
      onMouseMove={() => App.store.dispatch(setNextMove(column))}
      onClick={() => active && App.store.dispatch(takeTurn())}
      mask={`url(#${maskId})`}
    >
      <rect
        className={`frame-tile ${activeClass} ${highlightClass}`}
        x={x}
        y={y}
        width={width}
        height={height}
      />
      <ellipse
        className={`frame-hole ${activeClass} ${highlightClass}`}
        cx={x + width / 2}
        cy={y + height / 2}
        rx={width * .43}
        ry={width * .43}
      />
    </g>
  );
}
