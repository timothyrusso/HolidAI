import type { ErrorCode as ErrorCodeType } from '@/features/core/error/domain/entities/ErrorCode';
import { ErrorCode } from '@/features/core/error/domain/entities/ErrorCode';

export const errorCodeToMessageKey: Partial<Record<ErrorCodeType, string>> = {
  [ErrorCode.NetworkFailure]: 'ERRORS.NETWORK',
  [ErrorCode.Unauthorized]: 'ERRORS.UNAUTHORIZED',
  [ErrorCode.GenerationFailed]: 'ERRORS.GENERATION',
  [ErrorCode.NotFound]: 'ERRORS.NOT_FOUND',
};
// Unmapped codes (UnexpectedError, Unknown, and any new code without a UI entry) fall back to 'ERRORS.GENERIC'
