import React from 'react';
import { connect } from 'react-redux';

import { App } from 'src/App';
import { setNextMove } from 'src/models/action';
import { Game, PieceLocation, Player, PlayerType } from 'src/models/game';
import { PlayerInfo, State } from 'src/models/state';
import { Maybe } from 'src/models/util';
import { ui } from '../ui';
import './game-screen.scss';

export interface GameScreenComponentProps {
  games: Game[];
  nextMove: Maybe<number>;
  current: number;
  count: number;
  playerTypes: PlayerInfo<PlayerType>;
}

export function StatelessGameScreenComponent({
  games,
  count,
  nextMove,
  current,
  playerTypes,
}: GameScreenComponentProps) {
  let highlight = [ ] as PieceLocation[];
  let winner = null as Maybe<Player>;
  const game = games[current];

  if (game.status === 'playing' && game.lastMove !== null) {
    highlight.push([App.game.findTop(game.board, game.lastMove) + 1, game.lastMove]);
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
  for (let i = 0; i < App.config.boardCols; ++i) {
    availableMoves[i] =
      game.status === 'playing' &&
      playerTypes[game.turn] === 'human' &&
      App.game.canMove(game.board, i);
  }

  return (
    <section className="game-screen">
      <ui.MenuPanel/>
      <div className="board-area">
        <svg onMouseLeave={() => App.store.dispatch(setNextMove(null))}>
          <ui.Board
            x={0}
            y={0}
            width={700}
            height={700}
            game={game}
            count={count}
            nextMove={nextMove}
            playerTypes={playerTypes}
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
  playerTypes: state.playerTypes,
}))(StatelessGameScreenComponent);
