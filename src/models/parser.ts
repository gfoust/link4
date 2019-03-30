import { RuleSet } from './pattern';
import { Maybe } from './util';

export interface Code {
  clean: boolean;
  sections: CodeSection[];
  rulesets: RuleSet[];
}

export interface CodeSection {
  text: string;
  description: Maybe<string>;
  className: string;
}
