import { itEffect } from '@timothyrusso/effect-core/testing';
import { Effect, Layer } from 'effect';
import { collectLogs, StorageFake } from '@/features/core/testing';
import { languageToRestore, savedLanguage, saveLanguage } from '@/features/core/translations/useCases/language';

const chosen = StorageFake({ app_language: 'it' });
const neverChosen = StorageFake();
const saving = StorageFake({ app_language: 'en' });
const chosenWithLogs = Layer.merge(StorageFake({ app_language: 'it' }).layer, collectLogs().layer);
const unreadableLogs = collectLogs();
const unreadable = Layer.merge(StorageFake({ app_language: 'it' }, true).layer, unreadableLogs.layer);

describe('savedLanguage', () => {
  itEffect(
    'returns the language the user chose',
    Effect.gen(function* () {
      expect(yield* savedLanguage).toBe('it');
    }),
    chosen.layer,
  );

  itEffect(
    'returns undefined until the user chooses one',
    Effect.gen(function* () {
      expect(yield* savedLanguage).toBeUndefined();
    }),
    neverChosen.layer,
  );
});

describe('saveLanguage', () => {
  itEffect(
    'replaces the language the user chose',
    Effect.gen(function* () {
      yield* saveLanguage('it');

      expect(saving.values.get('app_language')).toBe('it');
    }),
    saving.layer,
  );
});

describe('languageToRestore', () => {
  itEffect(
    'returns the language the user chose',
    Effect.gen(function* () {
      expect(yield* languageToRestore).toBe('it');
    }),
    chosenWithLogs,
  );

  itEffect(
    'falls back to the device language, and logs the StorageFailure, when storage cannot be read',
    Effect.gen(function* () {
      expect(yield* languageToRestore).toBeUndefined();
      expect(unreadableLogs.entries).toMatchObject([
        {
          level: 'warn',
          message: 'restore the saved language failed',
          context: { cause: { _tag: 'StorageFailure', key: 'app_language' } },
        },
      ]);
    }),
    unreadable,
  );
});
