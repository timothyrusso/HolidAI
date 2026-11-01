import { act, waitFor } from '@testing-library/react-native';
import { A_CLERK_USER, clerkFake, NoFeatures, renderWithLayer } from '@/features/core/testing';
import { UserBackendFake } from '@/features/user/di/__tests__/userBackendFake';
import { useDecrementTokens } from '@/features/user/facades/useDecrementTokens';
import { useGetUser } from '@/features/user/facades/useGetUser';
import { useGetUserTokens } from '@/features/user/facades/useGetUserTokens';

describe('useGetUser', () => {
  it('returns the signed-in user', async () => {
    clerkFake.signIn();
    const { result, done } = await renderWithLayer(NoFeatures, useGetUser, undefined);

    expect(result.current.user).toEqual({
      id: A_CLERK_USER.id,
      username: 'holidaiqa',
      email: 'holidaiqa+clerk_test@example.com',
      profileImageUrl: 'https://img.clerk.com/holidaiqa.png',
    });
    await done();
  });

  it('returns no user while nobody is signed in', async () => {
    const { result, done } = await renderWithLayer(NoFeatures, useGetUser, undefined);

    expect(result.current.user).toBeUndefined();
    await done();
  });
});

describe('useGetUserTokens', () => {
  it('returns the tokens the user has left', async () => {
    clerkFake.signIn();
    UserBackendFake(7);
    const { result, done } = await renderWithLayer(NoFeatures, useGetUserTokens, undefined);

    expect(result.current.userTokens).toBe(7);
    await done();
  });

  it('returns no tokens while nobody is signed in', async () => {
    UserBackendFake(7);
    const { result, done } = await renderWithLayer(NoFeatures, useGetUserTokens, undefined);

    expect(result.current.userTokens).toBe(0);
    await done();
  });
});

describe('useDecrementTokens', () => {
  it("spends the signed-in user's tokens", async () => {
    clerkFake.signIn();
    const backend = UserBackendFake(10);
    const { result, done } = await renderWithLayer(NoFeatures, useDecrementTokens, undefined);

    await act(async () => result.current.decrementTokens(4));

    await waitFor(() => expect(backend.tokens()).toBe(6));
    await done();
  });

  it('spends nothing, and logs nothing, while nobody is signed in', async () => {
    const backend = UserBackendFake(10);
    const { result, logs, done } = await renderWithLayer(NoFeatures, useDecrementTokens, undefined);

    await act(async () => result.current.decrementTokens(4));

    expect(backend.tokens()).toBe(10);
    expect(logs.entries).toEqual([]);
    await done();
  });

  it('keeps the tokens, and logs an UnexpectedError, when Convex rejects the spend', async () => {
    clerkFake.signIn();
    const backend = UserBackendFake(2);
    const { result, logs, done } = await renderWithLayer(NoFeatures, useDecrementTokens, undefined);

    await act(async () => result.current.decrementTokens(4));

    await waitFor(() => expect(logs.entries.map(entry => entry.message)).toEqual(['UnexpectedError']));
    expect(backend.tokens()).toBe(2);
    await done();
  });
});
