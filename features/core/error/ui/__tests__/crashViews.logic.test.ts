import { act, renderHook } from '@testing-library/react-native';
import { useGenericCrashViewLogic } from '@/features/core/error/ui/components/GenericCrashView/GenericCrashView.logic';
import { useRootAppCrashViewLogic } from '@/features/core/error/ui/components/RootAppCrashView/RootAppCrashView.logic';
import { routerFake } from '@/features/core/testing';

describe('useGenericCrashViewLogic', () => {
  it('shows the generic error', async () => {
    const { result } = await renderHook(useGenericCrashViewLogic, {
      initialProps: { retry: async () => undefined, redirectTo: '/home-page' },
    });

    expect(result.current.state.message).toBe('ERRORS.GENERIC');
  });

  it('goes to the safe screen and retries', async () => {
    let retried = false;
    const retry = async () => {
      retried = true;
    };
    const { result } = await renderHook(useGenericCrashViewLogic, {
      initialProps: { retry, redirectTo: '/home-page' },
    });

    await act(async () => result.current.effects.handleRetry());

    expect(routerFake.history).toEqual([{ verb: 'replace', href: '/home-page' }]);
    expect(retried).toBe(true);
  });
});

describe('useRootAppCrashViewLogic', () => {
  it('shows the generic error and hands back the restart', async () => {
    const retry = async () => undefined;
    const { result } = await renderHook(useRootAppCrashViewLogic, { initialProps: { retry } });

    expect(result.current.state.message).toBe('ERRORS.GENERIC');
    expect(result.current.effects.retry).toBe(retry);
  });
});
