import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 0;

export { logger } from '@/features/core/error/di/resolve';
export { ERROR_TYPES } from '@/features/core/error/di/types';
export { BaseError } from '@/features/core/error/domain/entities/BaseError';
export { ErrorCode } from '@/features/core/error/domain/entities/ErrorCode';
export { fail, ok } from '@/features/core/error/domain/entities/Result';
export type { Result } from '@/features/core/error/domain/entities/Result';
export type { ILogger } from '@/features/core/error/domain/entities/services/ILogger';
export { ensureError } from '@/features/core/error/domain/utils/ensureError';
export { useErrorMessage } from '@/features/core/error/hooks/useErrorMessage';
export { errorCodeToMessageKey } from '@/features/core/error/mappers/errorCodeToMessageKey';
