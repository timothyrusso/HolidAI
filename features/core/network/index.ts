import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 0;

export { checkConnectivityUseCase } from '@/features/core/network/di/resolve';
export { NETWORK_TYPES } from '@/features/core/network/di/types';
export type { INetworkService } from '@/features/core/network/domain/entities/services/INetworkService';
