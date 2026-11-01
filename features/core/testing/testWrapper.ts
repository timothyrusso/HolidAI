import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { EffectRuntimeProvider, type ProvidedRuntime } from '@timothyrusso/effect-core/react';
import { createElement, type ReactNode } from 'react';

/**
 * The providers the app mounts, around a test runtime and a fresh query client that never
 * retries and never schedules garbage collection (a timer that would outlive the test). Pass it
 * as `wrapper` to `renderHook`.
 */
export const makeTestWrapper = (runtime: ProvidedRuntime) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity }, mutations: { retry: false, gcTime: Infinity } },
  });
  return function TestProviders({ children }: { readonly children: ReactNode }) {
    return createElement(QueryClientProvider, { client }, createElement(EffectRuntimeProvider, { runtime }, children));
  };
};
