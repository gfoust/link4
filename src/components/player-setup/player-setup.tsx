import React, { FormEvent } from 'react';
import { App } from 'src/App';
import { setDialog } from 'src/models/action';
import { Player, PlayerType } from 'src/models/game';
import { Code } from 'src/models/parser';
import { PlayerSetup } from 'src/models/state';
import { Maybe } from 'src/models/util';
import { ui } from '../ui';
import './player-setup.scss';

interface PlayerSetupProps {
  player: Player;
  init: PlayerSetup;
}

interface PlayerSetupState {
  name: string;
  type: PlayerType;
  file: Maybe<File>;
  code: Maybe<Code>;
}

export class PlayerSetupComponent extends React.PureComponent<PlayerSetupProps, PlayerSetupState> {
  constructor(props: PlayerSetupProps) {
    super(props);

    this.state = {
      name: props.init.name,
      type: props.init.type,
      file: props.init.file,
      code: props.init.code,
    };
  }

  onNameChange = (event: FormEvent<HTMLInputElement>) => {
    this.setState({ name: ((event.target as HTMLInputElement).value)});
  }

  onTypeChange = (type: PlayerType) => () => {
    this.setState({ type });
  }

  onFileChange = async (event: FormEvent<HTMLInputElement>) => {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      const file = files[0];
      this.setState({ file, code: null });
      const code = await App.parser.parseFile(file);
      if (this.state.file === file) {
        this.setState({ code });
      }
    }
  }

  onViewCode = () => {
    if (this.state.code) {
      App.store.dispatch(setDialog(
        <ui.CodeViewer code={this.state.code}/>
      ));
    }
  }

  get setup(): PlayerSetup {
    return {
      name: this.state.name,
      type: this.state.type,
      file: this.state.file,
      code: this.state.code,
    };
  }

  render() {
    return (
      <div className="player-setup">

        {/* Name-type input group */}
        <div className="input-group">

          {/* Type dropdown */}
          <div className="input-group-prepend">
            <div className={`btn btn-${this.props.player} dropdown-toggle`} data-toggle="dropdown" tabIndex={-1}>
            {
              this.state.type === 'human' ?
                <span className="material-icons">person</span> :
                <span className="material-icons">computer</span>
            }
            </div>
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={this.onTypeChange('human')}>Human</div>
              <div className="dropdown-item" onClick={this.onTypeChange('computer')}>Computer</div>
            </div>
          </div>

          {/* Name input */}
          <input
              type="text"
              value={this.state.name}
              onChange={this.onNameChange}
              placeholder={App.state.defaultPlayerNames.player1}
              autoFocus
            />
        </div>

        {/* File selection group */}
        <div className="file-add-on">
        { this.state.type === 'computer' &&
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="customFile1"
                onChange={this.onFileChange}
              />
              <div className="custom-file-label">
              { this.state.file ?
                  this.state.file.name :
                  'Choose File'
              }
              </div>
            </div>
        }
        </div>

        {/* Code view group */}
        <div className="code-add-on" onClick={this.onViewCode}>
        {
          this.state.type === 'computer' && this.state.code &&
            (this.state.code.clean ? 'Rules verified' : 'Errors detected')
        }
        </div>

      </div>
    );
  }
}
