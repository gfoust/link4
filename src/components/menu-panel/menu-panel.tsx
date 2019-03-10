import React from 'react';

import { App } from 'src/App';
import { setScreen } from 'src/store/action';
import './menu-panel.scss';

export function MenuPanelComponent() {
  return (
    <div className = "menu-panel">
      <button
        className="btn btn-outline-primary btn-block"
        onClick={() => App.store.dispatch(setScreen('start'))}
      >
        End Game
      </button>
    </div>
  );
}
