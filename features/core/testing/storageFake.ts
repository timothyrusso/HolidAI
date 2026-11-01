import { Layer } from 'effect';
import { makeStorage, Storage } from '@/features/core/storage';

/**
 * A `Storage` over an in-memory map, seeded with `entries`: `values` is what it holds, for a test
 * to read back what the code wrote. `broken` makes every call fail, as a closed MMKV would.
 */
export const StorageFake = (entries: Readonly<Record<string, string>> = {}, broken = false) => {
  const values = new Map(Object.entries(entries));
  const unlessBroken = <A>(run: () => A): A => {
    if (broken) throw new Error('MMKV instance is closed');
    return run();
  };
  const layer = Layer.succeed(
    Storage,
    makeStorage({
      getString: key => unlessBroken(() => values.get(key)),
      set: (key, value) => unlessBroken(() => void values.set(key, value)),
      delete: key => unlessBroken(() => void values.delete(key)),
    }),
  );
  return { layer, values };
};
