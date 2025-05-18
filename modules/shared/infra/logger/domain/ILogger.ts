export interface ILogger {
  error: <O>(error: Error, ...optionalParams: O[]) => void;
  log: <T, O>(message: T, ...optionalParams: O[]) => void;
  warning: <T, O>(message: T, ...optionalParams: O[]) => void;
  info: <T, O>(message: T, ...optionalParams: O[]) => void;
  debug: <T, O>(message: T, ...optionalParams: O[]) => void;
}
