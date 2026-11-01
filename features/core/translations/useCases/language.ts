import { Effect } from 'effect';
import { logBackgroundFailure } from '@/features/core/logger';
import { Storage } from '@/features/core/storage';
import { TranslationKeys } from '@/features/core/translations/domain/entities/TranslationKeys';

/** The language the user chose, `undefined` until they choose one. */
export const savedLanguage = Effect.flatMap(Storage, storage => storage.getString(TranslationKeys.storageLanguageKey));

/** Remembers `language` as the user's choice. */
export const saveLanguage = (language: string) =>
  Effect.flatMap(Storage, storage => storage.setString(TranslationKeys.storageLanguageKey, language));

/**
 * The language to switch to at launch: the one the user chose, or `undefined` (the device's) when
 * storage cannot be read. A preference never stops the app launching; the boot awaits no boundary,
 * so the failure is logged here.
 */
export const languageToRestore = savedLanguage.pipe(
  Effect.tapError(error => logBackgroundFailure('restore the saved language')(Effect.fail(error))),
  Effect.orElseSucceed(() => undefined),
);
