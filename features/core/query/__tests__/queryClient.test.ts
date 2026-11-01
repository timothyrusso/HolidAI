import { NetworkFailure } from '@/features/core/error';
import { queryClient } from '@/features/core/query/queryClient';

const retry = queryClient.getDefaultOptions().queries?.retry;
const shouldRetry = (failureCount: number, error: Error) =>
  typeof retry === 'function' ? retry(failureCount, error) : retry;

describe('queryClient retry', () => {
  it('never retries an app error, which already ran its own retries', () => {
    expect(shouldRetry(0, new NetworkFailure({ url: 'https://api.unsplash.com', status: 503 }))).toBe(false);
  });

  it('retries any other failure up to three times', () => {
    expect([0, 1, 2, 3].map(count => shouldRetry(count, new TypeError('Network request failed')))).toEqual([
      true,
      true,
      true,
      false,
    ]);
  });
});
