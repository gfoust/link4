import React from 'react';

import { boardCols, boardRows } from 'src/config';
import { PieceLocation } from 'src/models/game';
import { count2d, Maybe } from 'src/util';
import { ui } from '../ui';

export interface FrameComponentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  availableMoves: boolean[];
  highlight: PieceLocation[];
}

export function FrameComponent({ x, y, width, height, availableMoves, highlight }: FrameComponentProps) {
  const tileWidth = width / boardCols;
  const tileHeight = height / boardRows;

  function shouldHighlight(row: number, col: number) {
    for (const [r, c] of highlight) {
      if (r === row && c === col) {
        return true;
      }
    }
    return false;
  }

  return (
    <g>
      <defs>
        <mask id="hole-mask" maskContentUnits="objectBoundingBox">
          <rect cx={0} cy={0} width={1} height={1} fill="white"/>
          <ellipse cx={0.5} cy={0.5} rx={0.425} ry={0.425} fill="black" />
        </mask>
      </defs>
      { count2d(boardRows, boardCols, (r, c) =>
          <ui.FrameTile
            key={`frame-tile-${r}-${c}`}
            x={x + c * tileWidth}
            y={y + r * tileHeight}
            width={tileWidth}
            height={tileHeight}
            maskId="hole-mask"
            column={c}
            active={availableMoves[c]}
            highlight={shouldHighlight(r, c)}
          />
        )
      }
    </g>
  );
}
