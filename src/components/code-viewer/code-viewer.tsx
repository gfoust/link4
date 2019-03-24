import $ from 'jquery';
import React from 'react';

import { Code } from 'src/models/parser';

import './code-viewer.scss';

interface CodeViewerProps {
  code: Code;
}

export class CodeViewerComponent extends React.PureComponent<CodeViewerProps> {

  private preEl = React.createRef<HTMLPreElement>();

  render() {
    let i = 0;
    return (
      <pre ref={this.preEl} className="code-viewer">{
        this.props.code.sections.map(s =>
          s.description ?
          <span key={'cv-' + i++} className={s.className} data-toggle="tooltip" title={s.description}>{s.text}</span> :
          <span key={'cv-' + i++} className={s.className}>{s.text}</span>
        )
      }</pre>
    );
  }

  componentDidMount() {
    if (this.preEl.current) {
      ($(this.preEl.current).find('[data-toggle="tooltip"]') as any).tooltip({ html: true });
    }
  }
}
