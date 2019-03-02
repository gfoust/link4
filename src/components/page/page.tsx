import * as React from 'react';
import { connect } from 'react-redux';
import { State } from 'src/model/state';
import { Tile } from 'src/model/tile';
import { UI } from '../ui';
import './page.scss';

export interface PageComponentParams {
  board: Tile[][];
}

export function StatelessPageComponent({ board }: PageComponentParams) {
  return (
    <svg>
      <UI.Frame x={0} y={100} width={700} height={600}/>
      <UI.Board x={0} y={0} width={700} height={700}/>
    </svg>
  );
}

export const PageComponent = connect((state: State) => ({
  board: state.game.board,
}))(StatelessPageComponent);