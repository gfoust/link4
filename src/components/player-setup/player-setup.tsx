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
  depth: number;
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
        depth: 4,
        ready: true,
      };
    }
    else if (props.init.type === 'rules') {
      this.state = {
        name: props.init.name,
        type: props.init.type,
        file: props.init.file,
        depth: 4,
        code: props.init.code,
        ready: true,
      };
    }
    else {
      this.state = {
        name: props.init.name,
        type: props.init.type,
        file: null,
        code: null,
        depth: props.init.depth,
        ready: true,
      };
    }
  }

  fileInputRef = React.createRef<HTMLInputElement>();

  onNameChange = (event: FormEvent<HTMLInputElement>) => {
    this.setState({ name: ((event.target as HTMLInputElement).value)});
  }

  onTypeChange = (type: PlayerType) => () => {
    this.setState({ type, ready: type !== 'rules' || this.state.ready });
  }

  onDepthChange = (depth: number) => () => {
    this.setState({ depth });
  }

  onFileChange = (event: FormEvent<HTMLInputElement>) => {
    this.updateFiles(event.currentTarget.files);
  }

  onFileClick = () => {
    if (this.fileInputRef.current) {
      this.fileInputRef.current.value = '';
      this.updateFiles(null);
    }
  }

  async updateFiles(files: Maybe<FileList>) {
    if (files && files[0]) {
      const file = files[0];
      // (event.target as HTMLInputElement).value = '';
      this.setState({ file, ready: false });
      const code = await App.parser.parseFile(file);
      if (this.state.file === file) {
        this.setState({ code, ready: true });
      }
    }
    else {
      this.setState({ file: null, code: null, ready: true });
    }
  }

  onViewCode = () => {
    if (this.state.code) {
      App.store.dispatch(setDialog(
        <ui.ModalDialog title="Link 4 Rule Set">
          <ui.CodeViewer sections={this.state.code.sections}/>
        </ui.ModalDialog>
      ));
    }
  }

  get setup(): PlayerSetup {
    if (this.state.type === 'human') {
      return {
        name: this.state.name,
        type: 'human',
      };
    }
    else if (this.state.type === 'rules') {
      return {
        name: this.state.name,
        type: 'rules',
        file: this.state.file,
        code: this.state.code || { clean: true, rulesets: [ ], sections: [ ] },
      };
    }
    else {
      return {
        name: this.state.name,
        type: 'ai',
        depth: this.state.depth,
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
                this.state.type === 'rules' ?
                  <span className="material-icons">list_alt</span> :
                  <span className="material-icons">computer</span>
            }
            </div>
            <div className="dropdown-menu">
              <div className="dropdown-item" onClick={this.onTypeChange('human')}>Human</div>
              <div className="dropdown-item" onClick={this.onTypeChange('ai')}>Computer</div>
              <div className="dropdown-item" onClick={this.onTypeChange('rules')}>Rule-based</div>
            </div>
          </div>

          {/* Name input */}
          <input
              type="text"
              value={this.state.name}
              onChange={this.onNameChange}
              placeholder={App.state.defaultPlayerNames[this.props.player]}
              autoFocus
            />
        </div>

        {/* File selection group */}
        <div className="file-add-on">
        { this.state.type === 'rules' &&
            <div className="custom-file" onClick={this.onFileClick}>
              <input
                type="file"
                ref={this.fileInputRef}
                className="custom-file-input"
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
        { this.state.type === 'ai' &&
            <>
              <div className="btn btn-block btn-outline-secondary dropdown-toggle" data-toggle="dropdown" tabIndex={-1}>
                <div className="depth">Depth: {this.state.depth}</div>
              </div>
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={this.onDepthChange(1)}>1</div>
                <div className="dropdown-item" onClick={this.onDepthChange(2)}>2</div>
                <div className="dropdown-item" onClick={this.onDepthChange(3)}>3</div>
                <div className="dropdown-item" onClick={this.onDepthChange(4)}>4</div>
                <div className="dropdown-item" onClick={this.onDepthChange(5)}>5</div>
                <div className="dropdown-item" onClick={this.onDepthChange(6)}>6</div>
                <div className="dropdown-item" onClick={this.onDepthChange(7)}>7</div>
                <div className="dropdown-item" onClick={this.onDepthChange(8)}>8</div>
              </div>
            </>
        }
        </div>

        {/* Code view group */}
        <div className="code-add-on" onClick={this.onViewCode}>
        {
          this.state.type === 'rules' && this.state.file && this.state.code &&
            (this.state.code.clean ? 'Rules verified' : 'Errors detected')
        }
        </div>

      </div>
    );
  }
}
