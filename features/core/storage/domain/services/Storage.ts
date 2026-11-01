import { Context, type Effect, type Schema } from 'effect';
import type { StorageFailure } from '@/features/core/error';

/** Key-value device storage. A stored object is JSON, decoded with the caller's Schema on read. */
export class Storage extends Context.Tag('storage/Storage')<
  Storage,
  {
    readonly getString: (key: string) => Effect.Effect<string | undefined, StorageFailure>;
    readonly setString: (key: string, value: string) => Effect.Effect<void, StorageFailure>;
    /** The decoded value, `undefined` when the key is absent, `StorageFailure` when it no longer decodes. */
    readonly getObject: <A, I>(
      key: string,
      schema: Schema.Schema<A, I>,
    ) => Effect.Effect<A | undefined, StorageFailure>;
    readonly setObject: <A, I>(
      key: string,
      schema: Schema.Schema<A, I>,
      value: NoInfer<A>,
    ) => Effect.Effect<void, StorageFailure>;
    readonly remove: (key: string) => Effect.Effect<void, StorageFailure>;
  }
>() {}
