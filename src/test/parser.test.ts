import { CodeSection } from 'src/models/parser';
import { Rule, RuleSet } from 'src/models/rules';
import { Maybe } from 'src/models/util';
import * as parser from '../services/parser';

interface Parser {
  text: string;
  pos: number[];
  build: CodeSection[];
  completed: CodeSection[];

  init(text: string): void;
  pushWhitespace(chunk: string): void;
  lexWhitespace(): Maybe<string>;
  lexBlankLines(): Maybe<string>;
  lexLineBody(): Maybe<string>;
  lexRestOfLine(): Maybe<string>;
  parseHeader(expected: string): Maybe<string>;
  parsePattern(): Maybe<string[][]>;
  parseRule(): Maybe<Rule>;
  findFirstHeader(): Maybe<string>;
  parse(text: string): Maybe<RuleSet>;
}

describe('Parser', () => {
  let p: Parser;

  beforeEach(() => {
    p = new parser.Parser() as any;
  });

  it('should construct', () => {
    expect(p).toBeTruthy();
  });

  describe('pushWhitespace', () => {
    it('should push whitespace only', () => {
      p.init('');
      p.pushWhitespace('   \n\t\r\n  ');
      expect(p.pos).toMatchObject([ 0, 9 ]);
      expect(p.build).toMatchObject([
        { text: '   \n\t\r\n  ', description: null, className: 'whitespace' },
      ]);
      expect(p.completed).toMatchObject([ ]);
    });

    it('should push comments only', () => {
      p.init('');
      p.pushWhitespace('# hello, world!');
      expect(p.pos).toMatchObject([ 0, 15 ]);
      expect(p.build).toMatchObject([
        { text: '# hello, world!', description: null, className: 'comment' },
      ]);
      expect(p.completed).toMatchObject([ ]);
    });

    it('should separate comments from whitespace', () => {
      p.init('');
      p.pushWhitespace('\n\t# abc\n   #def\n\n');
      expect(p.pos).toMatchObject([ 0, 2, 7, 11, 15, 17 ]);
      expect(p.build).toMatchSnapshot();
      expect(p.completed).toMatchObject([ ]);
    });
  });

  describe('lexWhitespace', () => {
    it('should lex spaces at the front of the string', () => {
      p.init('   abc');
      expect(p.lexWhitespace()).toBe('   ');
      expect(p.pos).toMatchObject([ 0 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);
    });

    it('should lex all whitespace at the front of the string', () => {
      p.init('  \r\n\t  hello');
      expect(p.lexWhitespace()).toBe('  \r\n\t  ');
      expect(p.pos).toMatchObject([ 0 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);
    });

    it('should lex all whitespace at the start position', () => {
      p.init('abc \t def');
      p.pos = [ 3 ];
      expect(p.lexWhitespace()).toBe(' \t ');
      expect(p.pos).toMatchObject([ 3 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);
    });

    it('should return null if there is no whitespace at the start position', () => {
      p.init('hownowbrowncow');
      expect(p.lexWhitespace()).toBeNull();

      p.pos = [ 3 ];
      expect(p.lexWhitespace()).toBeNull();
      expect(p.pos).toMatchObject([ 3 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);
    });
  });

  describe('lexBlankLines', () => {
    it('should lex blank lines at the front of the string', () => {
      p.init('\n  \r\nhello');
      expect(p.lexBlankLines()).toBe('\n  \r\n');
      expect(p.pos).toMatchObject([ 0 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);
    });

    it('should include comments as blank lines', () => {
      p.init('# hello\n  \t  # goodbye \nabc');
      expect(p.lexBlankLines()).toBe('# hello\n  \t  # goodbye \n');
      expect(p.pos).toMatchObject([ 0 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);
    });

    it('should lex blank lines at the start position', () => {
      p.init('hello\n\n \nworld');
      p.pos = [ 5 ];
      expect(p.lexBlankLines()).toBe('\n\n \n');
      expect(p.pos).toMatchObject([ 5 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);
    });

    it('should leave whitespace at the beginning of non-blank lines', () => {
      p.init('abc  \n\t\r\n   def');
      p.pos = [ 3 ];
      expect(p.lexBlankLines()).toBe('  \n\t\r\n');
      expect(p.pos).toMatchObject([ 3 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);
    });

    it('should return null if there are no blank lines at the start position', () => {
      p.init(' a\nb');
      expect(p.lexBlankLines()).toBeNull();
      expect(p.pos).toMatchObject([ 0 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);

      p.init('a  \nb');
      expect(p.lexBlankLines()).toBeNull();
      expect(p.pos).toMatchObject([ 0 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);
    });
  });

  describe('lexLineBody', () => {
    it('should lex the line up to trailing whitespace', () => {
      p.init('xyzabc \t 123 \t\r\nxyz');
      p.pos = [ 3 ];
      expect(p.lexLineBody()).toBe('abc \t 123');
      expect(p.pos).toMatchObject([ 3 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);
    });

    it('should not lex the newline', () => {
      p.init('xyzabc\n');
      p.pos = [ 3 ];
      expect(p.lexLineBody()).toBe('abc');
      expect(p.pos).toMatchObject([ 3 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);
    });

    it('should leave comments at the end of line', () => {
      p.init('hello# comment\n');
      expect(p.lexLineBody()).toBe('hello');
      expect(p.pos).toMatchObject([ 0 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);

      p.init('hello \t # comment\n');
      expect(p.lexLineBody()).toBe('hello');
      expect(p.pos).toMatchObject([ 0 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);
    });

    it('should lex even if there is no newline at the end of string', () => {
      p.init('hello');
      expect(p.lexLineBody()).toBe('hello');
      expect(p.pos).toMatchObject([ 0 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);

      p.init('hello \t ');
      expect(p.lexLineBody()).toBe('hello');
      expect(p.pos).toMatchObject([ 0 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);

      p.init('hello # goodbye ');
      expect(p.lexLineBody()).toBe('hello');
      expect(p.pos).toMatchObject([ 0 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);
    });

    it('should return null for lines with only whitespace', () => {
      p.init('\nhello');
      expect(p.lexLineBody()).toBeNull();
      expect(p.pos).toMatchObject([ 0 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);

      p.init(' \t \nhello');
      expect(p.lexLineBody()).toBeNull();
      expect(p.pos).toMatchObject([ 0 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);

      p.init('#goodbye\nhello');
      expect(p.lexLineBody()).toBeNull();
      expect(p.pos).toMatchObject([ 0 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);
    });
  });

  describe('lexRestOfLine', () => {
    it('should lex the remaining line', () => {
      p.init('how now brown cow?\r\n\nabc');
      p.pos = [ 4 ];
      expect(p.lexRestOfLine()).toBe('now brown cow?\r\n');
      expect(p.pos).toMatchObject([ 4 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);
    });

    it('should lex to the end of the string if the string ends with newline', () => {
      p.init('how now brown cow?\n');
      expect(p.lexRestOfLine()).toBe('how now brown cow?\n');
      expect(p.pos).toMatchObject([ 0 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);
    });

    it('should lex an empty line', () => {
      p.init('abc\n\ndef');
      p.pos = [ 4 ];
      expect(p.lexRestOfLine()).toBe('\n');
      expect(p.pos).toMatchObject([ 4 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);
    });

    it('should lex to the end of the string if there are no more newlines', () => {
      p.init('how now brown cow?');
      p.pos = [ 4 ];
      expect(p.lexRestOfLine()).toBe('now brown cow?');
      expect(p.pos).toMatchObject([ 4 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);
    });

    it('should return null if at the end of the string', () => {
      p.init('hello');
      p.pos = [ 5 ];
      expect(p.lexRestOfLine()).toBeNull();
      expect(p.pos).toMatchObject([ 5 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);
    });
  });

  describe('parseHeader', () => {
    it('should parse PATTERNS header', () => {
      p.init('abcPATTERNS');
      p.pos = [ 3 ];
      expect(p.parseHeader('PATTERNS')).toBe('PATTERNS');
      expect(p.pos).toMatchObject([ 11 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([
        { text: 'PATTERNS', description: null, className: 'header' },
      ]);
    });

    it('should parse RULES header', () => {
      p.init('abcRULES');
      p.pos = [ 3 ];
      expect(p.parseHeader('RULES')).toBe('RULES');
      expect(p.pos).toMatchObject([ 8 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([
        { text: 'RULES', description: null, className: 'header' },
      ]);
    });

    it('should accept whitespace before the header', () => {
      p.init('abc\n \t # comment\r\n  \tPATTERNS');
      p.pos = [ 3 ];
      expect(p.parseHeader('PATTERNS')).toBe('PATTERNS');
      expect(p.pos).toMatchObject([ 29 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });

    it('should leave whitespace at the end of the line', () => {
      p.init('abcPATTERNS   # boo\nxyz');
      p.pos = [ 3 ];
      expect(p.parseHeader('PATTERNS')).toBe('PATTERNS');
      expect(p.pos).toMatchObject([ 11 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([
        { text: 'PATTERNS', description: null, className: 'header' },
      ]);
    });

    it('should mark non-whitespace at the end of the line as an error', () => {
      p.init('abcPATTERNS boo \nxyz');
      p.pos = [ 3 ];
      expect(p.parseHeader('PATTERNS')).toBe('PATTERNS');
      expect(p.pos).toMatchObject([ 15 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([
        { text: 'PATTERNS', description: null, className: 'header' },
        { text: ' boo', description: 'Section header should be on its own line', className: 'error' },
      ]);
    });
  });

  describe('parsePattern', () => {

    it('should parse a one-line pattern', () => {
      p.init('XO? +-*\n\nhello');
      expect(p.parsePattern()).toMatchObject([ 'XO? +-*' ]);
      expect(p.pos).toMatchObject([ 8 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });

    it('should parse a multi-line pattern', () => {
      p.init('XO?+-*\nXOXOXO\n+-+-+-\n\nhello');
      expect(p.parsePattern()).toMatchObject([ 'XO?+-*', 'XOXOXO', '+-+-+-' ]);
      expect(p.pos).toMatchObject([ 21 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });

    it('should skip over whitespace before the first pattern line', () => {
      p.init('# hi there\n \t \r\nXO\n\n');
      expect(p.parsePattern()).toMatchObject([ 'XO' ]);
      expect(p.pos).toMatchObject([ 19 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });

    it('should not skip over whitespace on the first pattern line', () => {
      p.init(' XO\n  X\n  x\n');
      expect(p.parsePattern()).toMatchObject([ ' XO', '  X', '  x' ]);
      expect(p.pos).toMatchObject([ 12 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });

    it('should omit whitespace at the end of pattern lines', () => {
      p.init('XO  \t  \r\nOX\t  \n\n');
      expect(p.parsePattern()).toMatchObject([ 'XO', 'OX' ]);
      expect(p.pos).toMatchObject([ 15 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();

      p.init('XO#XO\nOX #OX\n\n');
      expect(p.parsePattern()).toMatchObject([ 'XO', 'OX' ]);
      expect(p.pos).toMatchObject([ 13 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });

    it('should parse variables in a pattern', () => {
      p.init('Xa?+-*\nXmXOxO\n+-yz+-\n\nhello');
      expect(p.parsePattern()).toMatchObject([ 'Xa?+-*', 'XmXOxO', '+-yz+-' ]);
      expect(p.pos).toMatchObject([ 21 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });

    it('should omit invalid characters in a pattern', () => {
      p.init('X (&5 O\n\n');
      expect(p.parsePattern()).toMatchObject([ 'X  O' ]);
      expect(p.pos).toMatchObject([ 8 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });

    it('should omit characters beyond board length', () => {
      p.init('XOXOXOXOXO\nOXOXOXOa\nXOXOXOX0\n');
      expect(p.parsePattern()).toMatchObject([ 'XOXOXOX', 'OXOXOXO', 'XOXOXOX' ]);
      expect(p.pos).toMatchObject([ 29 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });

    it('should match big ol\' ugly patterns', () => {
      p.init('XOa2b?34+-yXO3\n\n');
      expect(p.parsePattern()).toMatchObject([ 'XOab?+-']);
      expect(p.pos).toMatchObject([ 15 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });

    it('should parse pattern at the end of the string', () => {
      p.init('XO');
      expect(p.parsePattern()).toMatchObject([ 'XO' ]);
      expect(p.pos).toMatchObject([ 2 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });

    it('should fail if only whitespace until the end of the string', () => {
      p.init('  \n\n  ');
      expect(p.parsePattern()).toBeNull();
      expect(p.pos).toMatchObject([ 0 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchObject([ ]);
    });

  });

  describe('findFirstHeader', () => {
    it('should find the first header', () => {
      p.init('\nabc\nXOXO\n\nPATTERNS\n');
      expect(p.findFirstHeader()).toBe('PATTERNS');
      expect(p.pos).toMatchObject([ 19 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });

    it('should consume all input if there is no header', () => {
      p.init('abc\nxyz\n');
      expect(p.findFirstHeader()).toBeNull();
      expect(p.pos).toMatchObject([ 8 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });
  });

  describe('parseRule', () => {

    it('should parse a rule with one definition and one action', () => {
      p.init('a=* : a+!\n');
      expect(p.parseRule()).toMatchObject({
        definitions: { a: '*' },
        actions: { a: 'always' },
      });
      expect(p.pos).toMatchObject([ 9 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });

    it('should parse a rule with multiple definitions', () => {
      p.init('a=* , b = X,c= ? : a+!\n');
      expect(p.parseRule()).toMatchObject({
        definitions: { a: '*', b: 'X', c: '?' },
        actions: { a: 'always' },
      });
      expect(p.pos).toMatchObject([ 22 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });

    it('should parse a rule with multiple actions', () => {
      p.init('a=* : a + !, b -! , c+ 9,d-4\n');
      expect(p.parseRule()).toMatchObject({
        definitions: { a: '*' },
        actions: { a: 'always', b: 'never', c: 9, d: -4 },
      });
      expect(p.pos).toMatchObject([ 28 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });

    it('should omit bad definitions', () => {
      p.init('a=*,b=5,7=?,c=,=*,e=Xf=O:a+!');
      expect(p.parseRule()).toMatchObject({
        definitions: { a: '*' },
        actions: { a: 'always' },
      });
      expect(p.pos).toMatchObject([ 28 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });

    it('should omit bad actions', () => {
      p.init('a=*:a+!,b,+3,c+5!,5+!\n');
      expect(p.parseRule()).toMatchObject({
        definitions: { a: '*' },
        actions: { a: 'always' },
      });
      expect(p.pos).toMatchObject([ 21 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });

    it('should return null if no definitions and/or actions', () => {
      p.init('a=:a+!\n');
      expect(p.parseRule()).toBeNull();
      expect(p.pos).toMatchObject([ 6 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();

      p.init('a=*:a!\n');
      expect(p.parseRule()).toBeNull();
      expect(p.pos).toMatchObject([ 6 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });

    it('should detect duplicate variable definitions', () => {
      p.init('a=X,a=O:a+!');
      expect(p.parseRule()).toMatchObject({
        definitions: { a: 'X' },
        actions: { a: 'always' },
      });
      expect(p.pos).toMatchObject([ 11 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });

    it('should detect duplicate action priorities', () => {
      p.init('a=X:a+!,a-!');
      expect(p.parseRule()).toMatchObject({
        definitions: { a: 'X' },
        actions: { a: 'always' },
      });
      expect(p.pos).toMatchObject([ 11 ]);
      expect(p.build).toMatchObject([ ]);
      expect(p.completed).toMatchSnapshot();
    });

  });

  describe('parse', () => {
    it('should parse a simple rule set', () => {
      const text = `PATTERNS

XXa

RULES

a=*:a+!
`;
      expect(p.parse(text)).toMatchSnapshot();
      expect(p.completed).toMatchSnapshot();
    });

    it('should parse amore complicated rule set', () => {
      const text = `# Immediate win situations

PATTERNS

abcd

a
b
c
d

a
 b
  c
   d

RULES

a=*, b=X, c=X, d=X : a+!
a=X, b=*, c=X, d=X : b+!

# Set up two-way win
PATTERNS

*aXX*  # pattern is reversible

RULES

a=*, b=X : a+!
`;
      expect(p.parse(text)).toMatchSnapshot();
      expect(p.completed).toMatchSnapshot();
    });

  });
});
