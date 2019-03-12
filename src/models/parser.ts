import { Maybe } from './util';

export interface Code {
  clean: boolean;
  sections: CodeSection[];
}

export interface CodeSection {
  text: string;
  description: Maybe<string>;
  className: string;
}
