import * as Redux from 'redux';

import { App } from 'src/App';
import { Action } from 'src/models/action';
import { State } from 'src/models/state';
import { reducer } from './reducer';

function loadState(): Partial<State> {
  try {
    const stateText = sessionStorage.getItem('link4-state');
    if (stateText) {
      const state = JSON.parse(stateText);
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
    sessionStorage.setItem('link4-state', JSON.stringify({
      setup: state.setup,
    }));
  }
  catch (err) {
    App.logger.error(err);
  }
}

export function createStore(): Redux.Store<State, Action> {
  const store = Redux.createStore(reducer, loadState());
  store.subscribe(() => {
    storeState(store.getState());
  });
  return store;
}
