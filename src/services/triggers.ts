import { App } from 'src/App';
import { Action, setComputerMove, SetComputerMove, StartGame, takeTurn } from 'src/models/action';
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
      onStartGame(nextState, action);
      break;
  }
}

async function onTakeTurn(nextState: State) {
  setTimeout(() => (document.getElementById(`turn-${nextState.current}`) as HTMLElement).scrollIntoView(), 10);
  const game = nextState.games[nextState.current];
  if (game.status === 'playing' && nextState.playerTypes[game.turn] === 'computer') {
    const move = await App.ai.pickMove(game.turn, game.board);
    App.store.dispatch(setComputerMove(move));
  }
}

function onSetComputerMove(action: SetComputerMove) {
  const column = action.column;
  if (column !== null) {
    setTimeout(() => App.store.dispatch(takeTurn(column)), 600);
  }
}

async function onStartGame(nextState: State, action: StartGame) {
  const game = nextState.games[nextState.current];
  if (action.playerTypes.player1 === 'computer') {
    const move = await App.ai.pickMove(game.turn, game.board);
    App.store.dispatch(setComputerMove(move));
  }
}
