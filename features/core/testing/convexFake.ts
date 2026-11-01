import { type DefaultFunctionArgs, type FunctionReference, getFunctionName } from 'convex/server';
import { useSyncExternalStore } from 'react';

type Handler = (args: unknown) => unknown;

const queries = new Map<string, Handler>();
const mutations = new Map<string, Handler>();
const failing = new Set<string>();
const listeners = new Set<() => void>();
let version = 0;

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
 * reject like a server error. `reset` runs before every test.
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
  reset: () => {
    queries.clear();
    mutations.clear();
    failing.clear();
    listeners.clear();
  },
  useQuery: (ref: FunctionReference<'query'>, args: unknown) => {
    useSyncExternalStore(subscribe, () => version);
    const handler = queries.get(getFunctionName(ref));
    return args === 'skip' || handler === undefined ? undefined : handler(args);
  },
  useMutation: (ref: FunctionReference<'mutation'>) => {
    const name = getFunctionName(ref);
    const mutate = async (args: unknown) => {
      if (failing.has(name)) throw new Error(`[CONVEX M(${name})] Server Error`);
      const handler = mutations.get(name);
      if (handler === undefined) throw new Error(`convexFake has no mutation ${name}`);
      const result = handler(args);
      notify();
      return result;
    };
    return Object.assign(mutate, { withOptimisticUpdate: () => mutate });
  },
};
