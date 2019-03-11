import React from 'react';
import { connect } from 'react-redux';

import { App } from 'src/App';
import { startGame } from 'src/models/action';
import { FullSetup, State } from 'src/models/state';
import { PlayerSetupComponent } from '../player-setup/player-setup';
import { ui } from '../ui';
import './start-screen.scss';

interface StartScreenProps {
  setup: FullSetup;
}

export function StatelessStartScreenComponent(props: StartScreenProps) {
  const player1 = React.createRef<PlayerSetupComponent>();
  const player2 = React.createRef<PlayerSetupComponent>();

  const onNewGame = () => {
    App.store.dispatch(startGame(
      player1.current!.setup,
      player2.current!.setup
    ));
  };

  return (
    <section className="start-screen">
      <h1>Link 4</h1>
      <div>
        <form onSubmit={event => event.preventDefault()}>
          <ui.PlayerSetup
            ref={player1}
            player="player1"
            init={props.setup.player1}
          />
          <ui.PlayerSetup
            ref={player2}
            player="player2"
            init={props.setup.player2}
          />
          <button className="btn btn-secondary btn-block" onClick={onNewGame}>
            New Game
          </button>
        </form>
      </div>
    </section>
  );
}

export const StartScreenComponent = connect((state: State) => ({
  setup: state.setup,
}))(StatelessStartScreenComponent);
