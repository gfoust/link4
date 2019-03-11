import React from 'react';
import { Code } from 'src/models/parser';

import './code-viewer.scss';

interface CodeViewerProps {
  code: Code;
}

export function CodeViewerComponent({ code }: CodeViewerProps) {
  return (
    <pre className="code-viewer">{code.text}</pre>
  );
}
