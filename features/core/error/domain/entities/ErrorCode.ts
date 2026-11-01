/** @deprecated Night 4 shim for the features not yet on Effect (#504, #505); deleted in #505. The error tag replaces the code. */
export const ErrorCode = {
  UnexpectedError: 'UnexpectedError',
  NotFound: 'NotFound',
  Unauthorized: 'Unauthorized',
  NetworkFailure: 'NetworkFailure',
  GenerationFailed: 'GenerationFailed',
  Unknown: 'Unknown',
  AuthSignInFailed: 'AuthSignInFailed',
  AuthSignUpFailed: 'AuthSignUpFailed',
  AuthVerificationFailed: 'AuthVerificationFailed',
  AuthPasswordResetFailed: 'AuthPasswordResetFailed',
  TokensExhausted: 'TokensExhausted',
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
