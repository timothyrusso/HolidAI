import { type DefaultFunctionArgs, type FunctionReference, getFunctionName } from 'convex/server';
import { useSyncExternalStore } from 'react';

type Handler = (args: unknown) => unknown;

const queries = new Map<string, Handler>();
const mutations = new Map<string, Handler>();
const failing = new Set<string>();
const listeners = new Set<() => void>();
const optimistic = new Map<string, unknown>();
const held: { gate: Promise<void> | null; release: () => void } = { gate: null, release: () => undefined };
let version = 0;

const keyOf = (ref: FunctionReference<'query'>, args: unknown) => `${getFunctionName(ref)}:${JSON.stringify(args)}`;

const answer = (ref: FunctionReference<'query'>, args: unknown) => {
  const key = keyOf(ref, args);
  if (optimistic.has(key)) return optimistic.get(key);
  const handler = queries.get(getFunctionName(ref));
  return handler === undefined ? undefined : handler(args);
};

/** The local store an optimistic update reads and writes, as Convex hands it over. */
const localStore = {
  getQuery: (ref: FunctionReference<'query'>, args: unknown) => answer(ref, args),
  setQuery: (ref: FunctionReference<'query'>, args: unknown, value: unknown) =>
    void optimistic.set(keyOf(ref, args), value),
};

const notify = () => {
  version += 1;
  for (const listener of listeners) listener();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => void listeners.delete(listener);
};

/**
 * Convex as a facade or ViewModel test sees it, in place of a deployment: `__mocks__/convex/react.ts`
 * hands out its `useQuery` and `useMutation`. A feature's backend fake (in its `di/__tests__/`)
 * answers each function with `setQuery` and `setMutation` over its own in-memory tables; every
 * mutation re-renders the queries, as Convex's live queries do. `failMutation` makes a function
 * reject like a server error. `hold` keeps every mutation in flight until `release`, so a test sees
 * what an optimistic update shows before the server answers. `reset` runs before every test.
 */
export const convexFake = {
  setQuery: <Args extends DefaultFunctionArgs>(
    ref: FunctionReference<'query', 'public', Args>,
    handler: (args: Args) => unknown,
  ) => void queries.set(getFunctionName(ref), handler as Handler),
  setMutation: <Args extends DefaultFunctionArgs>(
    ref: FunctionReference<'mutation', 'public', Args>,
    handler: (args: Args) => unknown,
  ) => void mutations.set(getFunctionName(ref), handler as Handler),
  failMutation: (ref: FunctionReference<'mutation'>) => void failing.add(getFunctionName(ref)),
  hold: () => {
    held.gate = new Promise(resolve => {
      held.release = resolve;
    });
  },
  release: () => {
    held.release();
    held.gate = null;
  },
  reset: () => {
    queries.clear();
    mutations.clear();
    failing.clear();
    listeners.clear();
    optimistic.clear();
    held.gate = null;
  },
  useQuery: (ref: FunctionReference<'query'>, args: unknown) => {
    useSyncExternalStore(subscribe, () => version);
    return args === 'skip' ? undefined : answer(ref, args);
  },
  useMutation: (ref: FunctionReference<'mutation'>) => {
    const name = getFunctionName(ref);
    const mutate = async (args: unknown) => {
      if (held.gate) await held.gate;
      if (failing.has(name)) throw new Error(`[CONVEX M(${name})] Server Error`);
      const handler = mutations.get(name);
      if (handler === undefined) throw new Error(`convexFake has no mutation ${name}`);
      const result = handler(args);
      notify();
      return result;
    };
    const withOptimisticUpdate = (update: (store: typeof localStore, args: never) => void) => async (args: unknown) => {
      update(localStore, args as never);
      notify();
      try {
        return await mutate(args);
      } finally {
        optimistic.clear();
        notify();
      }
    };
    return Object.assign(mutate, { withOptimisticUpdate });
  },
};
