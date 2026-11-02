import { act, renderHook } from '@testing-library/react-native';
import { makeFunctionReference } from 'convex/server';
import { convexFake } from '@/features/core/testing/convexFake';

const getTitle = makeFunctionReference<'query', Record<string, never>, string>('trips:getTitle');
const rename = makeFunctionReference<'mutation', Record<string, never>, null>('trips:rename');

const renameShowing = (title: string) =>
  convexFake.useMutation(rename).withOptimisticUpdate(store => store.setQuery(getTitle, {}, title))({});

describe('the Convex fake, when a mutation from an earlier test settles late', () => {
  it('keeps the optimistic value of the current test on screen', async () => {
    let settleEarlier: () => void = () => undefined;
    convexFake.setMutation(
      rename,
      () =>
        new Promise<null>(resolve => {
          settleEarlier = () => resolve(null);
        }),
    );
    const earlier = renameShowing('Earlier');

    convexFake.reset();
    convexFake.setQuery(getTitle, () => 'Server');
    convexFake.setMutation(rename, () => new Promise<null>(() => undefined));
    void renameShowing('Current');
    const { result } = await renderHook(() => convexFake.useQuery(getTitle, {}));

    await act(async () => {
      settleEarlier();
      await earlier;
    });

    expect(result.current).toBe('Current');
  });
});
