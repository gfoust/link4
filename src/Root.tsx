import * as React from 'react';
import { Provider } from 'react-redux';
import { App } from './App';
import { UI } from './components/ui';
import './Root.scss';

export class Root extends React.Component {
  public render() {
    return (
      <Provider store={App.store}>
        <UI.Page />
      </Provider>
    );
  }
}

export default Root;
