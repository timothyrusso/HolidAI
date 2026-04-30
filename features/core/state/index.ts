import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 0;

export { useAppState } from '@/features/core/state/app/useAppState';
export { createSelectors } from '@/features/core/state/libraries/createSelectors';
export { registerStore, resetAllStores } from '@/features/core/state/libraries/createStore';
export { createZustandStorage } from '@/features/core/state/libraries/createZustandStorage';
export { useModalState } from '@/features/core/state/modal/useModalState';

export type {
  ActionModalContentType,
  InfoModalContentType,
  ResetPasswordModalContentType,
} from '@/features/core/state/modal/modalStore';
