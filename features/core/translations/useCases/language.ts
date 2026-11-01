import { Effect } from 'effect';
import { Storage } from '@/features/core/storage';
import { TranslationKeys } from '@/features/core/translations/domain/entities/TranslationKeys';

/** The language the user chose, `undefined` until they choose one. */
export const savedLanguage = Effect.flatMap(Storage, storage => storage.getString(TranslationKeys.storageLanguageKey));

/** Remembers `language` as the user's choice. */
export const saveLanguage = (language: string) =>
  Effect.flatMap(Storage, storage => storage.setString(TranslationKeys.storageLanguageKey, language));
