import { Effect, Layer, Schema } from 'effect';
import { StorageFailure } from '@/features/core/error';
import { Storage } from '@/features/core/storage/domain/services/Storage';
import { mmkvClient } from '@/features/core/storage/libraries/mmkvClient';

/** The part of MMKV the storage reads and writes through. */
export interface KeyValueStore {
  getString: (key: string) => string | undefined;
  set: (key: string, value: string) => void;
  delete: (key: string) => void;
}

/** A `Storage` over `store`. */
export const makeStorage = (store: KeyValueStore): Storage['Type'] => {
  const attempt = <A>(key: string, run: () => A) =>
    Effect.try({ try: run, catch: cause => new StorageFailure({ key, cause }) });

  const getString = (key: string) => attempt(key, () => store.getString(key));

  return {
    getString,
    setString: (key, value) => attempt(key, () => store.set(key, value)),
    getObject: (key, schema) =>
      Effect.flatMap(getString(key), raw =>
        raw === undefined
          ? Effect.succeed(undefined)
          : Schema.decodeUnknown(Schema.parseJson(schema))(raw).pipe(
              Effect.mapError(cause => new StorageFailure({ key, cause })),
            ),
      ),
    setObject: (key, schema, value) =>
      Schema.encode(Schema.parseJson(schema))(value).pipe(
        Effect.mapError(cause => new StorageFailure({ key, cause })),
        Effect.flatMap(json => attempt(key, () => store.set(key, json))),
      ),
    remove: key => attempt(key, () => store.delete(key)),
  };
};

export const StorageLive = Layer.sync(Storage, () => makeStorage(mmkvClient));
