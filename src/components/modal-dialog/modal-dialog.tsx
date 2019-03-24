import React, { FunctionComponent } from 'react';
import { App } from 'src/App';
import { setDialog } from 'src/models/action';
import './modal-dialog.scss';

interface ModalDialogProps {
  title: string;
}

export const ModalDialogComponent: FunctionComponent<ModalDialogProps> = props => {
  return (
    <div className="modal-dialog">
      <div className="container">
        <div className="header alert-primary">
          {props.title}
          <span className="material-icons" onClick={() => App.store.dispatch(setDialog(null))}>close</span>
        </div>
        <div className="contents">
          {(props as any).children}
        </div>
      </div>
    </div>
  );
};
