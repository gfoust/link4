import React from 'react';

import { App } from 'src/App';
import { setCurrentGame, setDialog } from 'src/models/action';
import { Game } from 'src/models/game';
import { ui } from '../ui';
import './turns-panel.scss';

export interface TurnsPanelProps {
  games: Game[];
  current: number;
}

export function TurnsPanelComponent({ games, current }: TurnsPanelProps) {

  const turns = [ ] as JSX.Element[];
  for (let i = 0, end = games.length; i < end; ++i) {
    const itemClass = i === 0 ? 'secondary' : App.game.otherPlayer(games[i].turn);
    const currentClass = i === current ? 'current' : '';
    const explain = games[i].explain;
    turns.push(
      <button
        key={`turn-${i}`}
        id={`turn-${i}`}
        className={`list-group-item list-group-item-action list-group-item-${itemClass} ${currentClass}`}
        onClick={() => App.store.dispatch(setCurrentGame(i))}
      >
        Turn {i}
        { i === current && explain &&
            <span
              className="material-icons"
              onClick={(evt: React.MouseEvent) => {
                evt.stopPropagation();
                App.store.dispatch(setDialog(
                  <ui.ModalDialog title="Link 4 Turn Explanation">
                    <ui.ExplainViewer scores={explain} board={games[i - 1].board}/>
                  </ui.ModalDialog>
                ));
              }}
            >info</span>
        }
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
