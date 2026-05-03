import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 0;

export { httpClient } from '@/features/core/http/di/resolve';
export { HTTP_TYPES } from '@/features/core/http/di/types';
export type { IHttpClient } from '@/features/core/http/domain/entities/services/IHttpClient';
