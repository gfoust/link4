import * as Redux from 'redux';

import { App } from 'src/App';
import { State } from 'src/model/state';
import { reducer } from './reducer';

function loadState(): Partial<State> {
  try {
    const mouseState = localStorage.getItem('mouseState');
    if (mouseState) {
      const state = JSON.parse(mouseState);
      return state;
    }
  }
  catch (err) {
    App.logger.error(err);
  }

  return { };
}

function storeState(state: State) {
  try {
    localStorage.setItem('mouseState', JSON.stringify(state));
  }
  catch (err) {
    App.logger.error(err);
  }
}

export function createStore(): Redux.Store {
  return Redux.createStore(reducer);
  // const store = Redux.createStore(reducer, loadState());
  // store.subscribe(() => {
  //   storeState(store.getState());
  // });
  // return store;
}