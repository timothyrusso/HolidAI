import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ProvidedRuntime } from '@timothyrusso/effect-core/react';
import { useEffectMutation, useEffectQuery } from '@timothyrusso/effect-core/react';
import { Effect, Layer } from 'effect';
import { NetworkFailure, StorageFailure, UnexpectedError } from '@/features/core/error';
import { makeTestRuntime, makeTestWrapper } from '@/features/core/testing';

/** Renders `hook` on a test runtime; `done` unmounts it, then disposes the runtime, in the app's teardown order. */
const renderOnTestRuntime = async <Result>(hook: () => Result) => {
  const { runtime, logs } = makeTestRuntime(Layer.empty);
  const rendered = await renderHook(hook, { wrapper: makeTestWrapper(runtime as unknown as ProvidedRuntime) });
  const done = async () => {
    await rendered.unmount();
    await runtime.dispose();
  };
  return { ...rendered, runtime, logs, done };
};

describe('useEffectQuery', () => {
  it('resolves with the value of the Effect it runs on the app runtime', async () => {
    const { result, done, logs } = await renderOnTestRuntime(() =>
      useEffectQuery({ queryKey: ['success'], queryFn: Effect.succeed('Rome') }),
    );

    await waitFor(() => expect(result.current.data).toBe('Rome'));
    expect(logs.entries).toEqual([]);
    await done();
  });

  it('reports a tagged failure as itself and logs it once as a warning', async () => {
    const failure = new NetworkFailure({ url: 'https://api.unsplash.com/search/photos', status: 503 });
    const { result, done, logs } = await renderOnTestRuntime(() =>
      useEffectQuery({ queryKey: ['tagged'], queryFn: Effect.fail(failure) }),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(failure);
    expect(logs.entries.map(entry => [entry.level, entry.message])).toEqual([['warn', 'NetworkFailure']]);
    await done();
  });

  it('turns a defect into an UnexpectedError carrying it, logged once as an error', async () => {
    const defect = new Error('boom');
    const { result, done, logs } = await renderOnTestRuntime(() =>
      useEffectQuery({ queryKey: ['defect'], queryFn: Effect.die(defect) }),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(UnexpectedError);
    expect(result.current.error?.cause).toBe(defect);
    expect(logs.entries.map(entry => entry.level)).toEqual(['error']);
    await done();
  });

  it('interrupts the running Effect when the hook unmounts, and logs nothing', async () => {
    const fiber = { interrupted: false };
    const { result, unmount, runtime, logs } = await renderOnTestRuntime(() =>
      useEffectQuery({
        queryKey: ['never'],
        queryFn: Effect.never.pipe(Effect.onInterrupt(() => Effect.sync(() => (fiber.interrupted = true)))),
      }),
    );

    await waitFor(() => expect(result.current.fetchStatus).toBe('fetching'));
    await unmount();

    await waitFor(() => expect(fiber.interrupted).toBe(true));
    expect(logs.entries).toEqual([]);
    await runtime.dispose();
  });
});

describe('useEffectMutation', () => {
  it('resolves with the value of the Effect it runs', async () => {
    const { result, done } = await renderOnTestRuntime(() =>
      useEffectMutation({ mutationFn: (city: string) => Effect.succeed(`saved ${city}`) }),
    );

    await act(async () => {
      expect(await result.current.mutateAsync('Lisbon')).toBe('saved Lisbon');
    });
    await done();
  });

  it('reports a tagged failure as itself', async () => {
    const failure = new StorageFailure({ key: 'app_language' });
    const { result, done } = await renderOnTestRuntime(() =>
      useEffectMutation({ mutationFn: (_key: string) => Effect.fail(failure) }),
    );

    await act(async () => result.current.mutate('app_language'));

    await waitFor(() => expect(result.current.error).toBe(failure));
    await done();
  });
});
