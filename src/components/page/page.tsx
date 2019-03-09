import React from 'react';
import { connect } from 'react-redux';

import { Game, PieceLocation, Player } from 'src/models/game';
import { State } from 'src/models/state';
import { findTop } from 'src/services/game';
import { Maybe } from 'src/util';
import { ui } from '../ui';
import './page.scss';

export interface PageComponentParams {
  games: Game[];
  nextMove: Maybe<number>;
  current: number;
  count: number;
}

export function StatelessPageComponent({ games, count, nextMove, current }: PageComponentParams) {
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

  return (
    <section>
      <div className="play-space">
        <svg>
          <ui.Board x={0} y={0} width={700} height={700} game={game} count={count} nextMove={nextMove}/>
          <ui.Frame x={0} y={100} width={700} height={600} active={game.status === 'playing'} highlight={highlight}/>
        </svg>
        <ui.TurnsPanel games={games} current={current}/>
      </div>
      <ui.StatusPanel status={game.status} turn={game.turn} winner={winner}/>
    </section>
  );
}

export const PageComponent = connect((state: State) => ({
  games: state.games,
  nextMove: state.nextMove,
  current: state.current,
  count: state.count,
}))(StatelessPageComponent);
