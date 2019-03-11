import { Maybe } from 'src/models/util';

export interface Logger {
  log(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;
}

let logger: Maybe<Logger> = console;
const loggerList: Logger[] = [ console ];

export function log(message?: any, ...optionalParams: any[]): void;
export function log() {
  if (logger) {
    logger.log(...arguments);
  }
}

export function warn(message?: any, ...optionalParams: any[]): void;
export function warn() {
  if (logger) {
    logger.warn(...arguments);
  }
}

export function error(message?: any, ...optionalParams: any[]): void;
export function error() {
  if (logger) {
    logger.log(...arguments);
  }
}

export function push(newLogger: Logger): void {
  loggerList.push(newLogger);
  logger = newLogger;
}

export function pop(): Maybe<Logger> {
  loggerList.pop();
  const last = logger;
  logger = loggerList.length > 0 ? loggerList[loggerList.length - 1] : null;
  return last;

}
