import { App } from 'src/App';
import { Code, CodeSection } from 'src/models/parser';
import { Actions, Definitions, Pattern, Priority, Rule, RuleSet } from 'src/models/pattern';
import { Maybe } from 'src/models/util';

export function parseFile(file: File) {
  return new Promise<Code>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const p = new Parser();
      p.parse(event.target.result);
      const sections = p.sections;
      const clean = p.sections.every(s => s.className !== 'error');
      resolve({ clean, sections });
    };
    reader.onerror = (event: any) => {
      reject(event.error);
    };
    reader.readAsText(file);
  });
}

export class Parser {
  private text!: string;
  private pos!: number[];
  private build!: CodeSection[];
  private completed!: CodeSection[];

  get sections() {
    return this.completed;
  }

  private init(text: string) {
    this.text = text;
    this.build = [ ];
    this.pos = [ 0 ];
    this.completed = [ ];
  }

  private push(text: string, description: Maybe<string>, className: string) {
    if (text) {
      this.pos.push(this.pos[this.pos.length - 1] + text.length);
      this.build.push({ text, description, className });
    }
  }

  private pushWhitespace(text: string) {
    if (text) {
      const parts = text.match(/\s+|#.*/g) as RegExpMatchArray;
      for (const part of parts) {
        if (part.startsWith('#')) {
          this.push(part, null, 'comment');
        }
        else {
          this.push(part, null, 'whitespace');
        }
      }
    }
  }

  private commit() {
    this.pos = [ this.pos[this.pos.length - 1] ];
    this.completed.push(...this.build);
    this.build = [ ];
  }

  private reset() {
    if (this.pos.length > 1) {
      this.pos = [ this.pos[0] ];
      this.build = [ ];
    }
  }

  private re(regexp: RegExp) {
    regexp.lastIndex = this.pos[this.pos.length - 1];
    return regexp;
  }

  private onlyWhitespaceLeft() {
    return this.text.match(this.re(/\s*$/y));
  }

  private lexWhitespace() {
    const match = this.text.match(this.re(/(\s+|#.*)+/y));
    if (match) {
      return match[0];
    }
    else {
      return null;
    }
  }

  private lexBlankLines() {
    const match = this.text.match(this.re(/([ \t\r]*(#.*)?\n)+/y));
    if (match) {
      return match[0];
    }
    else {
      return null;
    }
  }

  private lexLineBody() {
    const match = this.text.match(this.re(/[^#\n]*[^\s#]/y));
    if (match) {
      return match[0];
    }
    else {
      return null;
    }
  }

  private lexRestOfLine() {
    const match = this.text.match(this.re(/.*(\r?\n|$)/y));
    if (match && match[0]) {
      return match[0];
    }
    else {
      return null;
    }
  }

  private parseHeader(expected: string) {
    const ws = this.lexWhitespace();
    if (ws !== null) {
      this.pushWhitespace(ws);
    }

    const match = this.text.match(this.re(/(PATTERNS|RULES)/iy));
    if (!match) {
      this.reset();
      return null;
    }

    const header = match[0].toUpperCase();
    if (header === expected) {
      this.push(header, null, 'header');
    }
    else {
      this.push(header, 'Expected ::= ' + expected, 'header');
    }

    const line = this.lexLineBody();
    if (line) {
      this.push(line, 'Section header should be on its own line', 'error');
    }

    this.commit();
    return header;
  }

  private parsePattern() {
    const lines = this.lexBlankLines();
    if (lines !== null) {
      this.pushWhitespace(lines);
    }

    const pattern = [ ] as string[];
    let height = 0;
    let line = this.lexLineBody();
    while (line) {
      if (height + 1 >= App.config.boardRows) {
        this.push(line, 'Pattern longer than board height', 'error');
      }
      else {
        pattern[height] = '';
        const parts = line.match(/[XO+\-*? ]+|[a-z]+|[^XO+\-*? a-z]+/g) as RegExpMatchArray;
        let length = 0;
        for (const part of parts) {
          if (part.match(/[XO+\-*? a-z]/)) {
            const className = part.match(/[a-z]/) ? 'variable' : 'pattern';
            if (length + part.length <= App.config.boardCols) {
              this.push(part, null, className);
              pattern[height] += part;
            }
            else if (length < App.config.boardCols) {
              this.push(part.substring(0, App.config.boardCols - length), null, className);
              pattern[height] += part.substring(0, App.config.boardCols - length);
              this.push(part.substring(App.config.boardCols - length), 'Pattern longer than board length', 'error');
            }
            else {
              this.push(part, 'Pattern longer than board length', 'error');
            }
            length += part.length;
          }
          else {
            this.push(part, 'Invalid character in pattern', 'error');
          }
        }

        const ws = this.lexRestOfLine();
        if (ws) {
          this.pushWhitespace(ws);
        }
      }

      ++height;
      line = this.lexLineBody();
    }

    if (height > 0) {
      this.commit();
      return pattern;
    }
    else {
      this.reset();
      return null;
    }
  }

  private checkVariable(text: string): Maybe<string> {
    let result = null as Maybe<string>;

    if (text.match(/^[a-z]$/)) {
      this.push(text, null, 'variable');
      result = text;
    }
    else {
      this.push(text, 'Invalid variable name', 'error');
    }

    return result;
  }

  private checkPattern(text: string): Maybe<string> {
    let result = null as Maybe<string>;

    if (text.match(/^[XO+\-*?]$/)) {
      this.push(text, null, 'pattern');
      result = text;
    }
    else if (text.match(/^[XO+\-*?]+$/)) {
      this.push(text, 'Pattern should only be a single character', 'error');
    }
    else {
      this.push(text, 'Invalid pattern', 'error');
    }

    return result;
  }

  private checkPriority(text: string): Maybe<Priority> {
    let result = null as Maybe<Priority>;

    const match = text.match(/^([+-])(\s*)(!|\d+)$/);
    if (match) {
      let className: string;
      if (match[1] === '+') {
        className = 'pos-priority';
        if (match[3] === '!') {
          result = 'always';
        }
        else {
          result = Number(match[3]);
        }
      }
      else {
        className = 'neg-priority';
        if (match[3] === '!') {
          result = 'never';
        }
        else {
          result = -Number(match[3]);
        }
      }
      this.push(text, null, className);
    }
    else {
      this.push(text, 'Invalid action', 'error');
    }

    return result;
  }

  private checkDefinition(text: string, defns: Definitions) {
    if (text.match(/^\s*$/)) {
      this.push(text, null, 'whitespace');
    }
    else {
      const match = text.match(/^(\s*)(\S.*?)(\s*)=(\s*)(\S.*?)(\s*)$/);
      if (match) {
        if (match[2] in defns) {
          this.push(text, 'Duplicate variable definition', 'error');
        }
        else {
          this.push(match[1], null, 'whitespace');
          const variable = this.checkVariable(match[2]);
          this.push(match[3], null, 'whitespace');
          this.push('=', null, 'equals');
          this.push(match[4], null, 'whitespace');
          const definition = this.checkPattern(match[5]);
          this.push(match[6], null, 'whitespace');
          if (variable !== null && definition !== null) {
            defns[variable] = definition;
          }
        }
      }
      else {
        this.push(text, 'Expected ::= variable = pattern', 'error');
      }
    }
  }

  private checkDefinitions(text: string): Definitions {
    const defns = { } as Definitions;

    const parts = text.split(',');
    this.checkDefinition(parts[0], defns);
    for (let i = 1; i < parts.length; ++i) {
      this.push(',', null, 'comma');
      this.checkDefinition(parts[i], defns);
    }

    return defns;
  }

  private checkActions(text: string): Actions {
    const actions = { } as Actions;

    const parts = text.split(',');
    this.checkAction(parts[0], actions);
    for (let i = 1; i < parts.length; ++i) {
      this.push(',', null, 'comma');
      this.checkAction(parts[i], actions);
    }

    return actions;
  }

  private checkAction(text: string, actions: Actions) {
    if (text.match(/^\s*$/)) {
      this.push(text, null, 'whitespace');
    }
    else {
      const match = text.match(/^(\s*)(\S.*?)(\s*)([+-].*?)(\s*)$/);
      if (match) {
        if (match[2] in actions) {
          this.push(text, 'Duplicate variable priority', 'error');
        }
        else {
          this.push(match[1], null, 'whitespace');
          const variable = this.checkVariable(match[2]);
          this.push(match[3], null, 'whitespace');
          const action = this.checkPriority(match[4]);
          this.push(match[5], null, 'whitespace');
          if (variable !== null && action !== null) {
            actions[variable] = action;
          }
        }
      }
      else {
        this.push(text, 'Expected ::= variable +/- priority', 'error');
      }
    }
  }

  private parseRule(): Maybe<Rule> {
    const lines = this.lexBlankLines();
    if (lines != null) {
      this.pushWhitespace(lines);
    }

    const line = this.lexLineBody();
    if (line) {
      const halves = line.split(':', 2);
      if (halves.length === 2) {
        const definitions = this.checkDefinitions(halves[0]);
        this.push(':', null, 'colon');
        const actions = this.checkActions(halves[1]);
        this.commit();
        if (Object.keys(definitions).length > 0 && Object.keys(actions).length > 0) {
          return { definitions, actions };
        }
        else {
          return null;
        }
      }
      else {
        this.push(line, 'Expected ::= definitions : actions', 'error');
        this.commit();
        return null;
      }
    }
    else {
      this.reset();
      return null;
    }
  }

  private findFirstHeader(): Maybe<string> {
    let header = this.parseHeader('PATTERNS');
    while (header === null) {
      const ws = this.lexWhitespace();
      if (ws) {
        this.pushWhitespace(ws);
      }
      const line = this.lexLineBody();
      if (line) {
        this.push(line, 'Expected ::= section header', 'error');
      }
      else {
        break;
      }
      this.commit();
      header = this.parseHeader('PATTERNS');
    }
    this.commit();
    return header;
  }

  parse(text: string) {
    this.init(text);
    const rulesets = [ ] as RuleSet[];
    const first = this.findFirstHeader();
    if (first) {
      let header = first;
      let state: 'patterns' | 'ignoring-patterns' | 'rules' | 'ignoring-rules' =
        first === 'PATTERNS' ? 'patterns' : 'ignoring-rules';
      let patterns = [ ] as Pattern[];
      let rules = [ ] as Rule[];

      while (! this.onlyWhitespaceLeft()) {
        const newHeader = this.parseHeader(header === 'PATTERNS' ? 'RULES' : 'PATTERNS');
        if (newHeader) {
          if (header === 'PATTERNS') {
            if (newHeader === 'PATTERNS') {
              state = 'ignoring-patterns';
            }
            else /* newHeader === 'RULES' */ {
              state = 'rules';
            }
          }
          else /* header === RULES */ {
            if (state === 'rules') {
              if (patterns.length > 0 && rules.length > 0) {
                rulesets.push({ patterns, rules });
              }
              patterns = [ ];
              rules = [ ];
            }
            if (newHeader === 'RULES') {
              state = 'ignoring-rules';
            }
            else /* newHeader === 'PATTERNS' */ {
              state = 'patterns';
            }
          }
          header = newHeader;
        }
        else if (header === 'PATTERNS') {
          const pattern = this.parsePattern();
          if (pattern && state === 'patterns') {
            patterns.push(pattern);
          }
        }
        else {
          const rule = this.parseRule();
          if (rule && state === 'rules') {
            rules.push(rule);
          }
        }

      }
      if (state === 'rules') {
        if (patterns.length > 0 && rules.length > 0) {
          rulesets.push({ patterns, rules });
        }
      }
  }
    const ws = this.lexWhitespace();
    if (ws) {
      this.pushWhitespace(ws);
    }
    this.commit();
    if (rulesets.length > 0) {
      return rulesets;
    }
    else {
      return null;
    }
  }
}
