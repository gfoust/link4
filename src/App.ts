import * as logger from './services/logger';
import { createStore } from './store/store';

export const App = {
  logger,
  store: createStore(),
};
