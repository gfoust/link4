import React from 'react';
import { connect } from 'react-redux';

import { Game } from 'src/models/game';
import { State } from 'src/models/state';
import { UI } from '../ui';
import './page.scss';

export interface PageComponentParams {
  game: Game;
}

export function StatelessPageComponent({ game }: PageComponentParams) {
  return (
    <svg>
      <UI.Board x={0} y={0} width={700} height={700} game={game}/>
      <UI.Frame x={0} y={100} width={700} height={600} active={game.status === 'playing'}/>
    </svg>
  );
}

export const PageComponent = connect((state: State) => ({
  game: state.game,
}))(StatelessPageComponent);
