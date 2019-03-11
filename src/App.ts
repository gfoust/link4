import * as Redux from 'redux';

import * as config from './config';
import { Action } from './models/action';
import { State } from './models/state';
import * as ai from './services/ai';
import * as game from './services/game';
import * as logger from './services/logger';
import * as parser from './services/parser';
import * as pattern from './services/pattern';
import * as state from './services/state';
import * as triggers from './services/triggers';
import * as util from './services/util';

export const App = {
  ai,
  config,
  game,
  logger,
  parser,
  pattern,
  state,
  store: { } as Redux.Store <State, Action>,
  triggers,
  util,
};
