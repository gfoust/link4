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
      <div
        key={`turn-${i}`}
        id={`turn-${i}`}
        className={`turn ${games[i].turn} ${currentClass}`}
        onClick={() => App.store.dispatch(setCurrentGame(i))}
      >
        Turn {i}
      </div>
    );
  }

  return (
    <div className="turns-panel">
    { turns }
    </div>
  );
}
