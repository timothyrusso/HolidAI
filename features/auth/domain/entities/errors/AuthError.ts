import { BaseError, type ErrorCode } from '@/features/core/error';

type AuthErrorCode =
  | typeof ErrorCode.AuthSignInFailed
  | typeof ErrorCode.AuthSignUpFailed
  | typeof ErrorCode.AuthVerificationFailed
  | typeof ErrorCode.AuthPasswordResetFailed;

export class AuthError extends BaseError {
  constructor(code: AuthErrorCode, cause?: Error) {
    super(`Auth operation failed [${code}]`, code, { cause });
  }
}
