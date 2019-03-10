import React from 'react';
import { connect } from 'react-redux';

import { Screen, State } from 'src/models/state';
import { ui } from '../ui';
import './page.scss';

export interface PageComponentParams {
  screen: Screen;
}

export function StatelessPageComponent({ screen }: PageComponentParams) {

  if (screen === 'start') {
    return <ui.StartScreen/>;
  }
  else {
    return <ui.GameScreen/>;
  }
}

export const PageComponent = connect((state: State) => ({
  screen: state.screen,
}))(StatelessPageComponent);
