import React from 'react';
import { App } from 'src/App';
import { Board } from 'src/models/game';
import { AbsoluteScore, Reason, RelativeScore, Score } from 'src/models/rules';
import { ui } from '../ui';
import './explain-viewer.scss';

function Priority({ score }: { score: Score }) {
  if (score === undefined) {
    return <span className="no-score">Not Scored</span>;
  }
  else if (score.priority === 'always') {
    return <span className="score-always">Always</span>;
  }
  else if (score.priority === 'never') {
    return <span className="score-never">Never</span>;
  }
  else if (score.priority > 0) {
    return <span className="score-positive">+{score.priority}</span>;
  }
  else if (score.priority < 0) {
    return <span className="score-negative">{score.priority}</span>;
  }
  else {
    return <span className="score-zero">0</span>;
  }
}

function Reason({ reason, board }: { reason: Reason, board: Board }) {
  return (
    <div className="match">
      <div className="match-reason">Rule:</div>
      <ui.CodeViewer sections={App.formatter.formatReason(reason)}/>
      <div className="match-board">Board:</div>
      <ui.CodeViewer sections={App.formatter.formatBoard(board, reason)}/>
    </div>
  );
}

function Explain({ score, board }: { score: Score, board: Board }) {
  if (score) {
    if (score.priority === 'never' && score.reason === 'full') {
      return (
        <div className="match">
          Column Full
        </div>
      );
    }
    if (score.priority === 'always' || score.priority === 'never') {
      return <Reason reason={(score as AbsoluteScore).reason} board={board}/>;
    }
    else {
      return (
        <>
        { (score as RelativeScore).reasons.length > 0 ?
            (score as RelativeScore).reasons.map(reason =>
              <Reason reason={reason} board={board}/>
            ) :
            'No Rules Matched'
        }
        </>
      );
    }
  }
  return <div>WIP</div>;
}

interface ExplainViewerProps {
  board: Board;
  scores: Score[];
}

interface ExplainViewerState {
  details: {
    column: number;
    score: Score;
  } | null;
}

export class ExplainViewerComponent extends React.PureComponent<ExplainViewerProps, ExplainViewerState> {

  state = { details: null } as ExplainViewerState;

  pickScore = (column: number, score: Score) => () => {
    if (score) {
      this.setState({ details: { column, score } });
    }
  }

  clearScore = () => {
    this.setState({ details: null });
  }

  render() {
    const details = this.state.details;
    if (details) {
      return (
        <div className="explain-viewer">
          <div className="clear-score" onClick={this.clearScore}>&larr; Back</div>
          <div className="column-score">
            <span className="column-label">Column {details.column + 1}:</span> <Priority score={details.score}/>
          </div>
          <Explain score={details.score} board={this.props.board}/>
        </div>
      );
    }
    else {
      return (
        <div className="explain-viewer">
        { this.props.scores.map((s, i) =>
            <div key={i} className={`column-score ${s ? 'has-details' : ''}`} onClick={this.pickScore(i, s)}>
              <span className="column-label">Column {i + 1}:</span> <Priority score={s}/>
            </div>
          )
        }
        </div>
      );
    }
  }

}
