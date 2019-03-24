// tslint:disable ordered-imports
import 'popper.js/dist/popper.min.js';
import 'bootstrap/js/src/util.js';
import 'bootstrap/js/src/dropdown.js';
import 'bootstrap/js/src/tooltip.js';
// tslint:enable ordered-imports

import React from 'react';

import { Provider } from 'react-redux';
import { App } from './App';
import { ui } from './components/ui';
import './Root.scss';
import './services/ai';

export class Root extends React.Component {
  public render() {
    return (
      <Provider store={App.store}>
        <ui.Page />
      </Provider>
    );
  }
}

export default Root;
