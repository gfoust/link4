import React from 'react';

import { Player, Status } from 'src/models/game';
import { Maybe } from 'src/util';
import './status-panel.scss';

export interface StatusPanelProps {
  status: Status;
  turn: Player;
  winner: Maybe<Player>;
}

export function StatusPanelComponent({ status, turn, winner }: StatusPanelProps) {
  let message: string;
  let player= '';
  if (status === 'playing') {
    if (turn === 'player1') {
      message = "Player 1's Turn";
    }
    else {
      message = "Player 2's Turn";
    }
    player = turn;
  }
  else {
    if (winner) {
      if (winner === 'player1') {
        message = 'Player 1 Wins';
      }
      else {
        message = 'Player 2 Wins';
      }
      player = winner;
    }
    else {
      message = 'Tie Game';
    }
  }

  return (
    <div className={`alert alert-${player}`}>
      { message }
    </div>
  );
}
