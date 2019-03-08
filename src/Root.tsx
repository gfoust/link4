import * as React from 'react';
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
