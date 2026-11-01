import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 0;

export { StorageLive } from '@/features/core/storage/data/services/storageLive';
export { storage } from '@/features/core/storage/di/resolve';
export type { IStorage } from '@/features/core/storage/domain/entities/IStorage';
export { Storage } from '@/features/core/storage/domain/services/Storage';
