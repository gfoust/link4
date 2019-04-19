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
  ready: boolean;
}

export class PlayerSetupComponent extends React.PureComponent<PlayerSetupProps, PlayerSetupState> {
  constructor(props: PlayerSetupProps) {
    super(props);

    if (props.init.type === 'human') {
      this.state = {
        name: props.init.name,
        type: props.init.type,
        file: null,
        code: null,
        ready: true,
      };
    }
    else {
      this.state = {
        name: props.init.name,
        type: props.init.type,
        file: props.init.file,
        code: props.init.code,
        ready: true,
      };
    }
  }

  onNameChange = (event: FormEvent<HTMLInputElement>) => {
    this.setState({ name: ((event.target as HTMLInputElement).value)});
  }

  onTypeChange = (type: PlayerType) => () => {
    this.setState({ type, ready: type === 'human' || this.state.ready });
  }

  onFileChange = async (event: FormEvent<HTMLInputElement>) => {
    console.log('onFileChange');
    const files = (event.target as HTMLInputElement).files;
    if (files && files[0]) {
      const file = files[0];
      (event.target as HTMLInputElement).value = '';
      this.setState({ file, ready: false });
      const code = await App.parser.parseFile(file);
      if (this.state.file === file) {
        this.setState({ code, ready: true });
      }
    }
    else {
      (event.target as HTMLInputElement).value = '';
      this.setState({ file: null, code: null, ready: true });
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
    if (this.state.type === 'computer') {
      return {
        name: this.state.name,
        type: 'computer',
        file: this.state.file,
        code: this.state.code || { clean: true, rulesets: [ ], sections: [ ] },
      };
    }
    else {
      return {
        name: this.state.name,
        type: 'human',
      };
    }
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
                onClick={() => console.log('onClick')}
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
          this.state.type === 'computer' && this.state.file && this.state.code &&
            (this.state.code.clean ? 'Rules verified' : 'Errors detected')
        }
        </div>

      </div>
    );
  }
}
