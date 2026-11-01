import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 0;

export type { AppError, AppErrorRegistry } from '@/features/core/error/appError';
export {
  ConfigMissing,
  ImageFetchFailed,
  NetworkFailure,
  NotFound,
  StorageFailure,
  Unauthorized,
} from '@/features/core/error/domain/errors/CoreErrors';
export { useErrorMessage } from '@/features/core/error/hooks/useErrorMessage';
export { AppErrorBase, ConfigError, isAppError, toAppError, UnexpectedError } from '@/features/core/error/kit';
export { errorTagToMessageKey } from '@/features/core/error/mappers/errorTagToMessageKey';
