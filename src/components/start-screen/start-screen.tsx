import React, { FormEvent } from 'react';

import { App } from 'src/App';
import { setScreen, startGame } from 'src/store/action';
import './start-screen.scss';

interface StartScreenComponentState {
  player1Name: string;
  player2Name: string;
}

export class StartScreenComponent extends React.PureComponent<{ }, StartScreenComponentState> {
  constructor(props: { }) {
    super(props);

    this.state = {
      player1Name: '',
      player2Name: '',
    };
  }

  onNameChange = (name: 'player1Name' | 'player2Name') => (event: FormEvent<HTMLInputElement>) => {
    this.setState({ [name]: (event.target as HTMLInputElement).value } as any);
  }

  onNewGame = () => {
    App.store.dispatch(startGame(this.state.player1Name, this.state.player2Name));
  }

  render() {
    return (
      <section className="start-screen">
        <h1>Link 4</h1>
        <div>
          <form onSubmit={event => event.preventDefault()}>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <div className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" tabIndex={-1}>
                  <span className="material-icons">person</span>
                </div>
                <div className="dropdown-menu">
                  <div className="dropdown-item">Human</div>
                  <div className="dropdown-item">Computer</div>
                </div>
              </div>
              <input
                type="text"
                value={this.state.player1Name}
                onInput={this.onNameChange('player1Name')}
                placeholder="Player 1"
                autoFocus
              />
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <div className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" tabIndex={-1}>
                  <span className="material-icons">person</span>
                </div>
                <div className="dropdown-menu">
                  <div className="dropdown-item">Human</div>
                  <div className="dropdown-item">Computer</div>
                </div>
              </div>
              <input
                type="text"
                value={this.state.player2Name}
                onInput={this.onNameChange('player2Name')}
                placeholder="Player 2"
              />
            </div>
            <button className="btn btn-primary btn-block" onClick={this.onNewGame}>
              New Game
            </button>
          </form>
        </div>
      </section>
    );
  }
}
