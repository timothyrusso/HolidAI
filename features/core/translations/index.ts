import type { FeatureTier } from '@/features/core/featureTier';
export const FEATURE_TIER: FeatureTier = 0;

export { initI18n } from '@/features/core/translations/libraries/i18nBindings';
export { Languages } from '@/features/core/translations/domain/entities/Languages';
export { TranslationKeys } from '@/features/core/translations/domain/entities/TranslationKeys';
export type { Language } from '@/features/core/translations/domain/entities/Languages';
export { useLocale } from '@/features/core/translations/hooks/useLocale';
export { useChangeLanguage } from '@/features/core/translations/facades/useChangeLanguage';
