import type { StoreApi, UseBoundStore } from 'zustand';

/**
 * Augments a Zustand store with a `.use` namespace of per-key selector hooks.
 *
 * Each key of the store state becomes a zero-argument function under `.use` that
 * subscribes only to that slice, preventing re-renders when unrelated state changes.
 *
 * @example
 * const appStore = createSelectors(useAppStore);
 * const language = appStore.use.language(); // re-renders only when language changes
 */
type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never;

/**
 * Adds a `.use` selector namespace to any Zustand store.
 *
 * Iterates over the store's top-level keys at call time and attaches a stable
 * selector for each. Works with both `create` and `createWithEqualityFn` stores
 * since both satisfy the `UseBoundStore<StoreApi<T>>` constraint.
 *
 * @param _store - The Zustand store to augment. Must be a store whose state is an
 * indexable object (`Record<string, unknown>`), which is true for every store in
 * this app.
 * @returns The same store reference, widened to include the `.use` namespace.
 */
export const createSelectors = <S extends UseBoundStore<StoreApi<Record<string, unknown>>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as Record<string, () => unknown>)[k] = () => store(s => s[k]);
  }

  return store;
};
