import * as Redux from 'redux';

import * as config from './config';
import { Action } from './models/action';
import { State } from './models/state';
import * as formatter from './services/formatter';
import * as game from './services/game';
import * as logger from './services/logger';
import * as parser from './services/parser';
import * as rules from './services/rules';
import * as state from './services/state';
import * as util from './services/util';
import * as triggers from './store/triggers';

export const App = {
  config,
  formatter,
  game,
  logger,
  parser,
  rules,
  state,
  store: { } as Redux.Store <State, Action>,
  triggers,
  util,
};
