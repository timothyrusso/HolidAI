import { api } from '@/convex/_generated/api';
import { clerkFake, convexFake, NoFeatures, renderWithLayer } from '@/features/core/testing';
import { useStartNewTrip } from '@/features/trips/facades/useStartNewTrip';

const withTokens = (tokens: number) => convexFake.setQuery(api.users.getUserTokens, () => tokens);

describe('useStartNewTrip', () => {
  it('lets a user with tokens start a trip', async () => {
    clerkFake.signIn();
    withTokens(3);
    const { result, done } = await renderWithLayer(NoFeatures, useStartNewTrip, undefined);

    expect(result.current.canStart()).toBe(true);
    await done();
  });

  it('stops a user with no tokens left', async () => {
    clerkFake.signIn();
    withTokens(0);
    const { result, done } = await renderWithLayer(NoFeatures, useStartNewTrip, undefined);

    expect(result.current.canStart()).toBe(false);
    await done();
  });
});
