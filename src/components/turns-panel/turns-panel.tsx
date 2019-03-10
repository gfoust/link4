import React from 'react';

import { App } from 'src/App';
import { Game } from 'src/models/game';
import { setCurrentGame } from 'src/store/action';
import './turns-panel.scss';

export interface TurnsPanelProps {
  games: Game[];
  current: number;
}

export function TurnsPanelComponent({ games, current }: TurnsPanelProps) {
  const turns = [ ] as JSX.Element[];
  for (let i = 0, end = games.length; i < end; ++i) {
    const currentClass = i === current ? 'current' : '';
    turns.push(
      <button
        key={`turn-${i}`}
        id={`turn-${i}`}
        className={`list-group-item list-group-item-action list-group-item-${games[i].turn} ${currentClass}`}
        onClick={() => App.store.dispatch(setCurrentGame(i))}
      >
        Turn {i + 1}
      </button>
    );
  }

  return (
    <div className="card turns-panel">
      <div className="card-header">
        Turn List
      </div>
      <div className="card-body list-group list-group-flush">
      { turns }
      </div>
    </div>
  );
}
