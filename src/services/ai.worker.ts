import { AiRequestMessage, AiResponseMessage, Move } from 'src/models/ai';
import { Game } from 'src/models/game';
import { planMove } from './ai';

console.log('loading worker');

export default class AiWorker {
  constructor() {
    throw new Error('Should not use');
  }

  onmessage: (this: Worker, ev: MessageEvent) => any;

  // tslint:disable-next-line no-empty
  postMessage(message: any) {
  }
}

onmessage = (event: MessageEvent) => {
  const request: AiRequestMessage = event.data;
  // console.log('request', request);
  const game: Game = { ...request.game, lastMove: null, explain: null, winner: null };
  const move = planMove(game, game.turn, request.depth) as Move;
  // console.log('move', move);

  const response: AiResponseMessage = {
    id: request.id,
    gameId: request.gameId,
    move: move.column,
  };
  // console.log('response', response);
  postMessage(response);
};
