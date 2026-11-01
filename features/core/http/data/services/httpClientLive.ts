import { Duration, Effect, Layer, Schedule } from 'effect';
import { NetworkFailure } from '@/features/core/error';
import { HttpClient } from '@/features/core/http/domain/services/HttpClient';

/** The part of a `Response` the client reads. */
export type FetchResponse = Pick<Response, 'ok' | 'status' | 'json'>;

/** The `fetch` the client sends through: the global one in the app, a fake in tests. */
export type Fetch = (url: string, init: RequestInit) => Promise<FetchResponse>;

/** How long one attempt may take before it fails with `NetworkFailure`. */
export const REQUEST_TIMEOUT = Duration.seconds(10);

/** Two retries after the first attempt, 200 ms then 400 ms apart. */
const retrySchedule = Schedule.exponential(Duration.millis(200)).pipe(Schedule.intersect(Schedule.recurs(2)));

/** No response at all, or a server error: worth another attempt. A 4xx or a bad body is not. */
const isTransient = (failure: NetworkFailure) => failure.status === undefined || failure.status >= 500;

/**
 * An `HttpClient` over `fetchFn`. The fetch and the body read share one signal, so a timeout
 * aborts whichever is still running.
 */
export const makeHttpClient = (fetchFn: Fetch): HttpClient['Type'] => {
  const request = (url: string, init: RequestInit) =>
    Effect.tryPromise({
      try: async (signal): Promise<unknown> => {
        const response = await fetchFn(url, { ...init, signal });
        if (!response.ok) throw new NetworkFailure({ url, status: response.status });
        try {
          return await response.json();
        } catch (cause) {
          throw new NetworkFailure({ url, status: response.status, cause });
        }
      },
      catch: cause => (cause instanceof NetworkFailure ? cause : new NetworkFailure({ url, cause })),
    }).pipe(
      Effect.timeoutFail({ duration: REQUEST_TIMEOUT, onTimeout: () => new NetworkFailure({ url }) }),
      Effect.retry({ schedule: retrySchedule, while: isTransient }),
    );

  return {
    getJson: (url, options) => request(url, { method: 'GET', headers: { ...options?.headers } }),
    postJson: (url, body, options) =>
      Effect.suspend(() =>
        request(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...options?.headers },
          body: JSON.stringify(body),
        }),
      ),
  };
};

export const HttpClientLive = Layer.sync(HttpClient, () => makeHttpClient((url, init) => fetch(url, init)));
