import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './App';
import Root from './Root';
import { createStore } from './store/store';

App.store = createStore();

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Root />,
    document.getElementById('root') as HTMLElement
  );
});
