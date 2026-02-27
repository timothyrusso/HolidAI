import { Languages } from '../../translations/domain/entities/Languages';

/**
 * Represents a collection of app keys.
 *
 * @property {string} storageLanguageKey - The key used for storing the language in storage.
 * @property {string} defaultLanguage - The default language.
 */
export const AppKeys = {
  storageLanguageKey: 'app_language',
  defaultLanguage: Languages.EN,
} as const;
