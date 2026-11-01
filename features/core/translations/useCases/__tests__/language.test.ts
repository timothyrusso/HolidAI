import { itEffect } from '@timothyrusso/effect-core/testing';
import { Effect } from 'effect';
import { StorageFake } from '@/features/core/testing';
import { savedLanguage, saveLanguage } from '@/features/core/translations/useCases/language';

const chosen = StorageFake({ app_language: 'it' });
const neverChosen = StorageFake();
const saving = StorageFake({ app_language: 'en' });

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
