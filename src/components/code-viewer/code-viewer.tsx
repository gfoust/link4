import React from 'react';
import { Code } from 'src/models/parser';

import './code-viewer.scss';

interface CodeViewerProps {
  code: Code;
}

export function CodeViewerComponent({ code }: CodeViewerProps) {
  return (
    <pre className="code-viewer">{
      code.sections.map(s =>
        s.description ?
        <span className={s.className} title={s.description}>{s.text}</span> :
        <span className={s.className}>{s.text}</span>
      )
    }</pre>
  );
}
