import React from 'react';
import { connect } from 'react-redux';

import { Player, Status } from 'src/models/game';
import { PlayerInfo, State } from 'src/models/state';
import { Maybe } from 'src/models/util';
import './status-panel.scss';

export interface StatusPanelProps {
  status: Status;
  turn: Player;
  winner: Maybe<Player>;
  playerNames: PlayerInfo<string>;
}

export function StatelessStatusPanelComponent({ status, turn, winner, playerNames }: StatusPanelProps) {
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

export const StatusPanelComponent = connect((state: State) => ({
  playerNames: state.playerNames,
}))(StatelessStatusPanelComponent);
