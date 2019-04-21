import { App } from 'src/App';
import { Action, setComputerMove, SetComputerMove, takeTurn } from 'src/models/action';
import { AiRequestMessage, AiResponseMessage } from 'src/models/ai';
import { State } from 'src/models/state';

export function trigger(state: State, nextState: State, action: Action) {
  switch (action.type) {
    case 'TakeTurn':
      onTakeTurn(nextState);
      break;
    case 'SetComputerMove':
      onSetComputerMove(nextState, action);
      break;
    case 'StartGame':
      onStartGame(nextState);
      break;
  }
}

async function onTakeTurn(nextState: State) {
  setTimeout(() => (document.getElementById(`turn-${nextState.current}`) as HTMLElement).scrollIntoView(), 10);
  doRulesMove(nextState);
  doAiMove(nextState);
}

function onSetComputerMove(nextState: State, action: SetComputerMove) {
  const gameId = nextState.gameId;
  setTimeout(() => {
    if (App.store.getState().gameId === gameId) {
      App.store.dispatch(takeTurn(action.column, action.explain));
    }
  }, 400);
}

async function onStartGame(nextState: State) {
  doRulesMove(nextState);
  doAiMove(nextState);
}

async function doRulesMove(nextState: State) {
  const game = nextState.games[nextState.current];
  const setup = nextState.setup[game.turn];
  if (game.status === 'playing' && setup.type === 'rules') {
    const rulesets = setup.code.rulesets;
    const scores = await App.rules.scoreColumns(game.turn, game.board, rulesets);
    const move = App.rules.pickMove(scores);
    App.store.dispatch(setComputerMove(move, scores));
  }
}

let currentAiMessage = 0;

async function doAiMove(nextState: State) {
  const messageId = ++currentAiMessage;
  const gameId = nextState.gameId;
  const game = nextState.games[nextState.current];
  const setup = nextState.setup[game.turn];
  if (game.status === 'playing' && setup.type === 'ai') {
    const message: AiRequestMessage = {
      id: messageId,
      gameId,
      depth: setup.depth,
      game: {
        status: game.status,
        turn: game.turn,
        board: game.board,
      },
    };
    App.worker.postMessage(message);
  }
}

export function makeAiMove(event: MessageEvent) {
  const response: AiResponseMessage = event.data;
  if (response.id === currentAiMessage && response.gameId === App.store.getState().gameId) {
    App.store.dispatch(setComputerMove(response.move, null));
  }
}
