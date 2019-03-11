import React from 'react';

import { Player, Status } from 'src/models/game';
import { FullSetup } from 'src/models/state';
import { Maybe } from 'src/models/util';
import { defaultPlayerNames } from 'src/services/state';
import './status-panel.scss';

export interface StatusPanelProps {
  status: Status;
  turn: Player;
  winner: Maybe<Player>;
  setup: FullSetup;
}

export function StatusPanelComponent({ status, turn, winner, setup }: StatusPanelProps) {
  const playerNames = {
    player1: setup.player1.name.trim(),
    player2: setup.player2.name.trim(),
  };

  if (! playerNames.player1.match(/\S/)) {
    playerNames.player1 = defaultPlayerNames.player1;
  }

  if (! playerNames.player2.match(/\S/)) {
    playerNames.player2 = defaultPlayerNames.player2;
  }

  let message: string;
  let player = '';
  if (status === 'playing') {
    message = playerNames[turn] + "'s Turn";
    player = turn;
  }
  else {
    if (winner) {
      message = playerNames[winner] + ' Wins';
      player = winner;
    }
    else {
      message = 'Tie Game';
      player = 'tie';
    }
  }

  return (
    <div className={`alert alert-${player}`}>
      { message }
    </div>
  );
}
