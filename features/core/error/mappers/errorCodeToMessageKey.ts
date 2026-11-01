import type { ErrorCode as ErrorCodeType } from '@/features/core/error/domain/entities/ErrorCode';
import { ErrorCode } from '@/features/core/error/domain/entities/ErrorCode';

/** @deprecated Night 4 shim for the features not yet on Effect (#504, #505); deleted in #505. Use `errorTagToMessageKey`. */
export const errorCodeToMessageKey: Partial<Record<ErrorCodeType, string>> = {
  [ErrorCode.NetworkFailure]: 'ERRORS.NETWORK',
  [ErrorCode.Unauthorized]: 'ERRORS.UNAUTHORIZED',
  [ErrorCode.GenerationFailed]: 'ERRORS.GENERATION',
  [ErrorCode.NotFound]: 'ERRORS.NOT_FOUND',
  [ErrorCode.AuthSignInFailed]: 'ERRORS.AUTH.SIGN_IN_FAILED',
  [ErrorCode.AuthSignUpFailed]: 'ERRORS.AUTH.SIGN_UP_FAILED',
  [ErrorCode.AuthVerificationFailed]: 'ERRORS.AUTH.VERIFICATION_FAILED',
  [ErrorCode.AuthPasswordResetFailed]: 'ERRORS.AUTH.PASSWORD_RESET_FAILED',
  [ErrorCode.TokensExhausted]: 'ERRORS.TOKENS_EXHAUSTED',
};
