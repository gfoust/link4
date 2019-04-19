import React from 'react';
import { connect } from 'react-redux';

import { Screen, State } from 'src/models/state';
import { Maybe } from 'src/models/util';
import { ui } from '../ui';
import './page.scss';

export interface PageComponentProps {
  screen: Screen;
  dialog: Maybe<JSX.Element>;
}

export function DisconnectedPageComponent(props: PageComponentProps) {
  return (
    <div>
    { props.dialog }
    {
      props.screen === 'start' ?
        <ui.StartScreen/> :
        <ui.GameScreen/>
    }
    </div>
  );
}

export const PageComponent = connect((state: State) => ({
  screen: state.screen,
  dialog: state.dialog,
}))(DisconnectedPageComponent);
