// tslint:disable ordered-imports
import 'popper.js/dist/popper.min.js';
import 'bootstrap/js/src/util.js';
import 'bootstrap/js/src/dropdown.js';
// tslint:enable ordered-imports

// import 'material-icons/iconfont/MaterialIcons-Regular.woff';
import React from 'react';

import { Provider } from 'react-redux';
import { App } from './App';
import { ui } from './components/ui';
import './Root.scss';

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
