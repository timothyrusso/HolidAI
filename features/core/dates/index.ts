import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 0;

export { formatDateForPrompt } from '@/features/core/dates/domain/utils/formatDateForPrompt';
export {
  getTimezoneFormattedDate,
  getTodayInLocalTimezone,
} from '@/features/core/dates/domain/utils/getTimezoneFormattedDate';
export { translateDate } from '@/features/core/dates/mappers/translateDate';
