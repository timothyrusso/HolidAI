import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 0;

export { AppConfig, ConfigLive } from '@/features/core/config/data/appConfig';
export { requireConfigKey } from '@/features/core/config/data/requireConfigKey';
export type {
  AppConfigValues,
  OptionalConfigKey,
} from '@/features/core/config/domain/schemas/AppConfigSchema';
