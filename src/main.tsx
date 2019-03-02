import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Root from './Root';

document.addEventListener('DOMContentLoaded', () => {
  console.log('boo');
  ReactDOM.render(
    <Root />,
    document.getElementById('root') as HTMLElement
  );
});
