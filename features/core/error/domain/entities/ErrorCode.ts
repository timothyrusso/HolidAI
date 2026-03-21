export const ErrorCode = {
  UnexpectedError: 'UnexpectedError',
  NotFound: 'NotFound',
  Unauthorized: 'Unauthorized',
  NetworkFailure: 'NetworkFailure',
  GenerationFailed: 'GenerationFailed',
  Unknown: 'Unknown',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
