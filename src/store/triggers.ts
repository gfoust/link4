import { App } from 'src/App';
import { Action, setComputerMove, SetComputerMove, takeTurn } from 'src/models/action';
import { State } from 'src/models/state';

export function trigger(state: State, nextState: State, action: Action) {
  switch (action.type) {
    case 'TakeTurn':
      onTakeTurn(nextState);
      break;
    case 'SetComputerMove':
      onSetComputerMove(action);
      break;
    case 'StartGame':
      onStartGame(nextState);
      break;
  }
}

async function onTakeTurn(nextState: State) {
  setTimeout(() => (document.getElementById(`turn-${nextState.current}`) as HTMLElement).scrollIntoView(), 10);
  doComputerMove(nextState);
}

function onSetComputerMove(action: SetComputerMove) {
  setTimeout(() => App.store.dispatch(takeTurn(action.column, action.explain)), 400);
}

async function onStartGame(nextState: State) {
  doComputerMove(nextState);
}

async function doComputerMove(nextState: State) {
  const game = nextState.games[nextState.current];
  const setup = nextState.setup[game.turn];
  if (game.status === 'playing' && setup.type === 'computer') {
    const rulesets = setup.code.rulesets;
    const scores = await App.ai.scoreColumns(game.turn, game.board, rulesets);
    const move = App.ai.pickMove(scores);
    App.store.dispatch(setComputerMove(move, scores));
  }
}
