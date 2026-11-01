import { act } from '@testing-library/react-native';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { registerStore } from '@/features/core/state';
import { clerkFake, NoFeatures, renderWithLayer, routerFake } from '@/features/core/testing';
import { useSessionChanges } from '@/features/user/facades/useSessionChanges';

const wizardStore = createWithEqualityFn<{ destination: string }>()(() => ({ destination: '' }), shallow);
registerStore(wizardStore);

afterEach(() => {
  wizardStore.setState({ destination: '' });
});

describe('useSessionChanges', () => {
  it('resets every client store when the user signs out', async () => {
    clerkFake.signIn();
    const { rerender, done } = await renderWithLayer(NoFeatures, useSessionChanges, undefined);
    wizardStore.setState({ destination: 'Kyoto, Japan' });

    clerkFake.reset();
    await act(async () => rerender(undefined));

    expect(wizardStore.getState().destination).toBe('');
    await done();
  });

  it('keeps the stores while the user stays signed in', async () => {
    clerkFake.signIn();
    const { rerender, done } = await renderWithLayer(NoFeatures, useSessionChanges, undefined);
    wizardStore.setState({ destination: 'Kyoto, Japan' });

    await act(async () => rerender(undefined));

    expect(wizardStore.getState().destination).toBe('Kyoto, Japan');
    await done();
  });

  it('goes home when the user signs in', async () => {
    const { result, rerender, done } = await renderWithLayer(NoFeatures, useSessionChanges, undefined);

    clerkFake.signIn();
    await act(async () => rerender(undefined));

    expect(result.current.isSignedIn).toBe(true);
    expect(routerFake.history).toEqual([{ verb: 'replace', href: '/home-page' }]);
    await done();
  });

  it('stays put on a launch that is already signed in', async () => {
    clerkFake.signIn();
    const { done } = await renderWithLayer(NoFeatures, useSessionChanges, undefined);

    expect(routerFake.history).toEqual([]);
    await done();
  });
});
