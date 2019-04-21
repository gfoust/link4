import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import Root from './Root';
import AiWorker from './services/ai.worker';
import { createStore } from './store/store';

App.store = createStore();
App.worker = new AiWorker() as Worker;
App.worker.onmessage = App.triggers.makeAiMove;
(window as any).worker = App.worker;

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Root />,
    document.getElementById('root') as HTMLElement
  );
});
