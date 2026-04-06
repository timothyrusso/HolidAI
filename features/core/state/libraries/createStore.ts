import type { StoreApi } from 'zustand';

/**
 * Global registry of reset callbacks, one per store singleton.
 *
 * All stores registered here are module-level singletons — instantiated once at app
 * load and never destroyed. The Set therefore grows only once and holds no dead
 * references. Do NOT call store factories inside a component or dynamic scope: the
 * resulting closure would be retained here for the lifetime of the app.
 */
const storeResetFns = new Set<() => void>();

/**
 * Resets every registered store back to the state snapshot captured at registration
 * time. Call this on logout or whenever a full in-memory state wipe is needed.
 *
 * Note: this resets in-memory state only. Persisted storage (MMKV) is not cleared —
 * call the relevant store's persist middleware `clearStorage` separately if needed.
 */
export const resetAllStores = () => {
  storeResetFns.forEach(fn => fn());
};

/**
 * Registers a store singleton with the global reset registry.
 *
 * Captures a snapshot of the store's current state at call time and uses it as the
 * reset target when {@link resetAllStores} is invoked. Call this immediately after
 * creating the singleton, before any user interaction mutates the store.
 *
 * @param store - The singleton store to register. Must be a module-level instance,
 * never a factory instance created for testing.
 *
 * @example
 * export const useAppStore = createAppStore();
 * registerStore(useAppStore); // call before any set() reaches the store
 */
export const registerStore = <T>(store: StoreApi<T>): void => {
  const initialSnapshot = store.getState();
  storeResetFns.add(() => store.setState(initialSnapshot, true));
};
