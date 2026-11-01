import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 0;

export { NetworkLive } from '@/features/core/network/data/services/networkLive';
export { checkConnectivityUseCase } from '@/features/core/network/di/resolve';
export { NETWORK_TYPES } from '@/features/core/network/di/types';
export type { INetworkService } from '@/features/core/network/domain/entities/services/INetworkService';
export { Network } from '@/features/core/network/domain/services/Network';
