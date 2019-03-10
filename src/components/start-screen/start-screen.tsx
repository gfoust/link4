import React from 'react';

import { App } from 'src/App';
import { setScreen } from 'src/store/action';
import './start-screen.scss';

export function StartScreenComponent() {
  return (
    <section className="start-screen">
      <h1>Link 4</h1>
      <div>
        <form>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text material-icons">person</span>
            </div>
            <input type="text" placeholder="Player 1" />
          </div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text material-icons">person</span>
            </div>
            <input type="text" placeholder="Player 2" />
          </div>
          <button className="btn btn-primary" onClick={() => App.store.dispatch(setScreen('game'))}>
            New Game
          </button>
        </form>
      </div>
    </section>
  );
}
