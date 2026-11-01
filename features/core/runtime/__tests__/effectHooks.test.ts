import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ProvidedRuntime } from '@timothyrusso/effect-core/react';
import { useEffectMutation, useEffectQuery } from '@timothyrusso/effect-core/react';
import { Effect, Layer } from 'effect';
import { NetworkFailure, StorageFailure, UnexpectedError } from '@/features/core/error';
import { makeTestRuntime, makeTestWrapper } from '@/features/core/testing';

const renderOnTestRuntime = async <Result>(hook: () => Result) => {
  const { runtime, logs } = makeTestRuntime(Layer.empty);
  const rendered = await renderHook(hook, { wrapper: makeTestWrapper(runtime as unknown as ProvidedRuntime) });
  return { ...rendered, runtime, logs };
};

describe('useEffectQuery', () => {
  it('resolves with the value of the Effect it runs on the app runtime', async () => {
    const { result, runtime, logs } = await renderOnTestRuntime(() =>
      useEffectQuery({ queryKey: ['success'], queryFn: Effect.succeed('Rome') }),
    );

    await waitFor(() => expect(result.current.data).toBe('Rome'));
    expect(logs.entries).toEqual([]);
    await runtime.dispose();
  });

  it('reports a tagged failure as itself and logs it once as a warning', async () => {
    const failure = new NetworkFailure({ url: 'https://api.unsplash.com/search/photos', status: 503 });
    const { result, runtime, logs } = await renderOnTestRuntime(() =>
      useEffectQuery({ queryKey: ['tagged'], queryFn: Effect.fail(failure) }),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBe(failure);
    expect(logs.entries.map(entry => [entry.level, entry.message])).toEqual([['warn', 'NetworkFailure']]);
    await runtime.dispose();
  });

  it('turns a defect into an UnexpectedError carrying it, logged once as an error', async () => {
    const defect = new Error('boom');
    const { result, runtime, logs } = await renderOnTestRuntime(() =>
      useEffectQuery({ queryKey: ['defect'], queryFn: Effect.die(defect) }),
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(UnexpectedError);
    expect(result.current.error?.cause).toBe(defect);
    expect(logs.entries.map(entry => entry.level)).toEqual(['error']);
    await runtime.dispose();
  });

  it('interrupts the running Effect when the hook unmounts, and logs nothing', async () => {
    const { result, unmount, runtime, logs } = await renderOnTestRuntime(() =>
      useEffectQuery({ queryKey: ['never'], queryFn: Effect.never }),
    );

    await waitFor(() => expect(result.current.fetchStatus).toBe('fetching'));
    await unmount();

    expect(logs.entries).toEqual([]);
    await runtime.dispose();
  });
});

describe('useEffectMutation', () => {
  it('resolves with the value of the Effect it runs', async () => {
    const { result, runtime } = await renderOnTestRuntime(() =>
      useEffectMutation({ mutationFn: (city: string) => Effect.succeed(`saved ${city}`) }),
    );

    await act(async () => {
      expect(await result.current.mutateAsync('Lisbon')).toBe('saved Lisbon');
    });
    await runtime.dispose();
  });

  it('reports a tagged failure as itself', async () => {
    const failure = new StorageFailure({ key: 'app_language' });
    const { result, runtime } = await renderOnTestRuntime(() =>
      useEffectMutation({ mutationFn: (_key: string) => Effect.fail(failure) }),
    );

    await act(async () => result.current.mutate('app_language'));

    await waitFor(() => expect(result.current.error).toBe(failure));
    await runtime.dispose();
  });
});
