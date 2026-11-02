import { renderHook } from '@testing-library/react-native';
import type { ProvidedRuntime } from '@timothyrusso/effect-core/react';
import type { Layer } from 'effect';
import { type CoreTestServices, makeTestRuntime } from '@/features/core/testing/testAppLayer';
import { makeTestWrapper } from '@/features/core/testing/testWrapper';

/**
 * Renders `hook` (a facade or a ViewModel) over a test runtime of `features` on the core test
 * services, inside the providers the app mounts. `logs` is what the boundary logged, and `done`
 * unmounts the hook and disposes the runtime: call it at the end of the test.
 */
export const renderWithLayer = async <Props, Result, R, E>(
  features: Layer.Layer<R, E, CoreTestServices>,
  hook: (props: Props) => Result,
  initialProps: NoInfer<Props>,
) => {
  const { runtime, logs } = makeTestRuntime(features);
  // NOTE: the runtime provides `features` and the core test services, not every app service the
  // provider's type names; a hook that needs a service the test left out fails as a defect, which
  // is the test telling you what to add.
  const provided = runtime as unknown as ProvidedRuntime;
  const rendered = await renderHook(hook, { wrapper: makeTestWrapper(provided), initialProps });
  const done = async () => {
    await rendered.unmount();
    await runtime.dispose();
  };
  return { ...rendered, logs, runtime, done };
};
