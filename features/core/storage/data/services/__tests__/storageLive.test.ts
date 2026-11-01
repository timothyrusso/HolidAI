import { itEffect } from '@timothyrusso/effect-core/testing';
import { Effect, Schema } from 'effect';
import { type KeyValueStore, makeStorage } from '@/features/core/storage/data/services/storageLive';

const LanguagePreference = Schema.Struct({ language: Schema.Literal('en', 'it'), updatedAt: Schema.Number });

/** An in-memory store; `broken` makes every call throw, as a closed MMKV instance would. */
const aStore = (entries: Record<string, string> = {}, broken = false) => {
  const values = new Map(Object.entries(entries));
  const unlessBroken = <A>(run: () => A): A => {
    if (broken) throw new Error('MMKV instance is closed');
    return run();
  };
  const store: KeyValueStore = {
    getString: key => unlessBroken(() => values.get(key)),
    set: (key, value) => unlessBroken(() => void values.set(key, value)),
    delete: key => unlessBroken(() => void values.delete(key)),
  };
  return { store, values };
};

describe('makeStorage', () => {
  itEffect('reads back a string it wrote', () =>
    Effect.gen(function* () {
      const storage = makeStorage(aStore().store);

      yield* storage.setString('app_language', 'it');

      expect(yield* storage.getString('app_language')).toBe('it');
    }),
  );

  itEffect('reads back an object it wrote, through its Schema', () =>
    Effect.gen(function* () {
      const storage = makeStorage(aStore().store);

      yield* storage.setObject('language', LanguagePreference, { language: 'it', updatedAt: 1_700_000_000_000 });

      expect(yield* storage.getObject('language', LanguagePreference)).toEqual({
        language: 'it',
        updatedAt: 1_700_000_000_000,
      });
    }),
  );

  itEffect('returns undefined for a key that was never written', () =>
    Effect.gen(function* () {
      expect(yield* makeStorage(aStore().store).getObject('language', LanguagePreference)).toBeUndefined();
    }),
  );

  itEffect('fails with StorageFailure for a stored value that no longer decodes, and keeps it', () =>
    Effect.gen(function* () {
      const { store, values } = aStore({ language: '{"language":"fr"}' });

      const error = yield* Effect.flip(makeStorage(store).getObject('language', LanguagePreference));

      expect(error).toMatchObject({ _tag: 'StorageFailure', key: 'language' });
      expect(values.get('language')).toBe('{"language":"fr"}');
    }),
  );

  itEffect('fails with StorageFailure for a value that is not JSON', () =>
    Effect.gen(function* () {
      const error = yield* Effect.flip(
        makeStorage(aStore({ language: 'not json' }).store).getObject('language', LanguagePreference),
      );

      expect(error._tag).toBe('StorageFailure');
    }),
  );

  itEffect('removes a key', () =>
    Effect.gen(function* () {
      const { store, values } = aStore({ app_language: 'en' });

      yield* makeStorage(store).remove('app_language');

      expect(values.has('app_language')).toBe(false);
    }),
  );

  itEffect('fails with StorageFailure naming the key when the store throws', () =>
    Effect.gen(function* () {
      const error = yield* Effect.flip(makeStorage(aStore({}, true).store).setString('app_language', 'it'));

      expect(error).toMatchObject({ _tag: 'StorageFailure', key: 'app_language' });
    }),
  );
});
