
import * as React from 'react';
import './frame-tile.scss';

import { App } from 'src/App';
import { registerPotentialMove } from 'src/store/action';

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
    <rect
      data-tag='frame-tile'
      x={x}
      y={y}
      width={width}
      height={height}
      mask={`url(#${maskId})`}
      onMouseMove={() => App.store.dispatch(registerPotentialMove(column))}
    />
  );
}
