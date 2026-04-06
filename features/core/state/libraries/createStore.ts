import type { StateCreator } from 'zustand';
import { create as _create } from 'zustand';

// All stores using this `create` wrapper are module-level singletons, instantiated
// once at app load and never destroyed. storeResetFns therefore grows only once and
// holds no dead references. Do NOT call `create` inside a component or dynamic scope —
// the resulting closure would be retained by this Set for the lifetime of the app.
const storeResetFns = new Set<() => void>();

export const resetAllStores = () => {
  storeResetFns.forEach(resetFn => {
    resetFn();
  });
};

export const create = (<T>() => {
  return (stateCreator: StateCreator<T>) => {
    const store = _create(stateCreator);
    const initialState = store.getState();
    storeResetFns.add(() => {
      store.setState(initialState, true);
    });
    return store;
  };
}) as typeof _create;
