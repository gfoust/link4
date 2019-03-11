import React, { FormEvent } from 'react';
import { connect } from 'react-redux';

import { App } from 'src/App';
import { Player, PlayerType } from 'src/models/game';
import { defaultPlayerNames, PlayerInfo, State } from 'src/models/state';
import { startGame } from 'src/store/action';
import './start-screen.scss';

interface StartScreenProps {
  playerNames: PlayerInfo<string>;
  playerTypes: PlayerInfo<PlayerType>;
}

interface StartScreenState {
  player1Name: string;
  player2Name: string;
  player1Type: PlayerType;
  player2Type: PlayerType;
}

export class StatelessStartScreenComponent extends React.PureComponent<StartScreenProps, StartScreenState> {
  constructor(props: StartScreenProps) {
    super(props);

    this.state = {
      player1Name: props.playerNames.player1,
      player2Name: props.playerNames.player2,
      player1Type: props.playerTypes.player1,
      player2Type: props.playerTypes.player2,
    };
  }

  onNameChange = (player: Player) => (event: FormEvent<HTMLInputElement>) => {
    this.setState({ [player + 'Name']: (event.target as HTMLInputElement).value } as any);
  }

  onTypeChange = (player: Player, type: PlayerType) => () => {
    this.setState({ [player + 'Type']: type } as any);
  }

  onNewGame = () => {
    App.store.dispatch(startGame(
      this.state.player1Name,
      this.state.player2Name,
      this.state.player1Type,
      this.state.player2Type
    ));
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
                { this.state.player1Type === 'human' ?
                    <span className="material-icons">person</span> :
                    <span className="material-icons">computer</span>
                }
                </div>
                <div className="dropdown-menu">
                  <div className="dropdown-item" onClick={this.onTypeChange('player1', 'human')}>Human</div>
                  <div className="dropdown-item" onClick={this.onTypeChange('player1', 'computer')}>Computer</div>
                </div>
              </div>
              <input
                type="text"
                value={this.state.player1Name}
                onInput={this.onNameChange('player1')}
                placeholder={defaultPlayerNames.player1}
                autoFocus
              />
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <div className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" tabIndex={-1}>
                { this.state.player2Type === 'human' ?
                    <span className="material-icons">person</span> :
                    <span className="material-icons">computer</span>
                }
                </div>
                <div className="dropdown-menu">
                  <div className="dropdown-item" onClick={this.onTypeChange('player2', 'human')}>Human</div>
                  <div className="dropdown-item" onClick={this.onTypeChange('player2', 'computer')}>Computer</div>
                </div>
              </div>
              <input
                type="text"
                value={this.state.player2Name}
                onInput={this.onNameChange('player2')}
                placeholder={defaultPlayerNames.player2}
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

export const StartScreenComponent = connect((state: State) => ({
  playerNames: state.playerNames,
  playerTypes: state.playerTypes,
}))(StatelessStartScreenComponent);
