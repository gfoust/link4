import React from 'react';
import { connect } from 'react-redux';

import { boardCols } from 'src/config';
import { Game, PieceLocation, Player } from 'src/models/game';
import { State } from 'src/models/state';
import { canMove, findTop } from 'src/services/game';
import { Maybe } from 'src/util';
import { ui } from '../ui';
import './game-screen.scss';

export interface GameScreenComponentParams {
  games: Game[];
  nextMove: Maybe<number>;
  current: number;
  count: number;
}

export function StatelessGameScreenComponent({ games, count, nextMove, current }: GameScreenComponentParams) {
  let highlight = [ ] as PieceLocation[];
  let winner = null as Maybe<Player>;
  const game = games[current];

  if (game.status === 'playing' && game.lastMove !== null) {
    highlight.push([findTop(game.board, game.lastMove) + 1, game.lastMove]);
  }
  else if (game.winner) {
    highlight = game.winner;
    const [ winx, winy ] = game.winner[0];
    const wintype = game.board[winx][winy].type;
    if (wintype !== 'empty') {
      winner = wintype;
    }
  }
  const availableMoves: boolean[] = [];
  for (let i = 0; i < boardCols; ++i) {
    availableMoves[i] = game.status === 'playing' && canMove(game, i);
  }

  return (
    <section className="game-screen">
      <div className="board-area">
        <svg>
          <ui.Board
            x={0}
            y={0}
            width={700}
            height={700}
            game={game}
            count={count}
            nextMove={nextMove}
          />
          <ui.Frame
            x={0}
            y={100}
            width={700}
            height={600}
            availableMoves={availableMoves}
            highlight={highlight}
          />
        </svg>
        <ui.StatusPanel status={game.status} turn={game.turn} winner={winner}/>
      </div>
      <ui.TurnsPanel games={games} current={current}/>
    </section>
  );
}

export const GameScreenComponent = connect((state: State) => ({
  games: state.games,
  nextMove: state.nextMove,
  current: state.current,
  count: state.count,
}))(StatelessGameScreenComponent);
