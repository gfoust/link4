import { Action } from 'src/models/action';
import { State } from 'src/models/state';

export function trigger(state: State, nextState: State, action: Action) {
  switch (action.type) {
    case 'TakeTurn':
      console.log('TakeTurn');
      setTimeout(() => (document.getElementById(`turn-${nextState.current}`) as HTMLElement).scrollIntoView(), 10);
      break;
  }

}
