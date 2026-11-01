import { advanceClock, itEffect } from '@timothyrusso/effect-core/testing';
import { Duration, Effect, Fiber } from 'effect';
import { type Fetch, type FetchResponse, makeHttpClient } from '@/features/core/http/data/services/httpClientLive';

const URL = 'https://api.unsplash.com/search/photos?page=1&query=Kyoto';

/**
 * A `fetch` that answers with `responses` in order (the last one repeats) and keeps every request
 * it was sent. `'hang'` never answers until its request is aborted; `'offline'` rejects.
 */
const fakeFetch = (...responses: readonly (FetchResponse | 'hang' | 'offline')[]) => {
  const sent: { url: string; init: RequestInit }[] = [];
  const fetchFn: Fetch = (url, init) => {
    const response = responses[Math.min(sent.length, responses.length - 1)];
    sent.push({ url, init });
    if (response === 'offline') return Promise.reject(new TypeError('Network request failed'));
    if (response === 'hang') return new Promise(() => undefined);
    return Promise.resolve(response);
  };
  return { fetchFn, sent };
};

describe('makeHttpClient', () => {
  itEffect('returns the decoded JSON body of a 2xx response', () =>
    Effect.gen(function* () {
      const { fetchFn } = fakeFetch(aResponse(200, { results: [] }));

      expect(yield* makeHttpClient(fetchFn).getJson(URL)).toEqual({ results: [] });
    }),
  );

  itEffect('sends a POST with a JSON body and the caller headers', () =>
    Effect.gen(function* () {
      const { fetchFn, sent } = fakeFetch(aResponse(200, { places: [] }));

      yield* makeHttpClient(fetchFn).postJson(URL, { textQuery: 'Colosseum' }, { headers: { 'X-Goog-Api-Key': 'k' } });

      expect(sent[0]?.init).toMatchObject({
        method: 'POST',
        body: '{"textQuery":"Colosseum"}',
        headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': 'k' },
      });
    }),
  );

  itEffect('fails with the status of a 4xx response without retrying it', () =>
    Effect.gen(function* () {
      const { fetchFn, sent } = fakeFetch(aResponse(401, {}));

      const error = yield* Effect.flip(makeHttpClient(fetchFn).getJson(URL));

      expect(error).toMatchObject({ _tag: 'NetworkFailure', url: URL, status: 401 });
      expect(sent).toHaveLength(1);
    }),
  );

  itEffect('fails without retrying when a 2xx body is not JSON', () =>
    Effect.gen(function* () {
      const { fetchFn, sent } = fakeFetch({
        ok: true,
        status: 200,
        json: () => Promise.reject(new SyntaxError('<html>')),
      });

      const error = yield* Effect.flip(makeHttpClient(fetchFn).getJson(URL));

      expect(error).toMatchObject({ _tag: 'NetworkFailure', status: 200 });
      expect(sent).toHaveLength(1);
    }),
  );

  itEffect('retries a 5xx and returns the body of the attempt that succeeds', () =>
    Effect.gen(function* () {
      const { fetchFn, sent } = fakeFetch(aResponse(503, {}), aResponse(200, { results: ['kyoto'] }));

      const fiber = yield* Effect.fork(makeHttpClient(fetchFn).getJson(URL));
      yield* advanceClock(Duration.millis(200));

      expect(yield* Fiber.join(fiber)).toEqual({ results: ['kyoto'] });
      expect(sent).toHaveLength(2);
    }),
  );

  itEffect('gives up after two retries when the device stays offline', () =>
    Effect.gen(function* () {
      const { fetchFn, sent } = fakeFetch('offline');

      const fiber = yield* Effect.fork(Effect.flip(makeHttpClient(fetchFn).getJson(URL)));
      yield* advanceClock(Duration.millis(600));
      const error = yield* Fiber.join(fiber);

      expect(error._tag).toBe('NetworkFailure');
      expect(error.status).toBeUndefined();
      expect(sent).toHaveLength(3);
    }),
  );

  itEffect('times out a request that never answers, aborting it', () =>
    Effect.gen(function* () {
      const { fetchFn, sent } = fakeFetch('hang', aResponse(200, { results: [] }));

      const fiber = yield* Effect.fork(makeHttpClient(fetchFn).getJson(URL));
      yield* advanceClock(Duration.seconds(10));
      yield* advanceClock(Duration.millis(200));

      expect(yield* Fiber.join(fiber)).toEqual({ results: [] });
      expect(sent[0]?.init.signal?.aborted).toBe(true);
    }),
  );

  itEffect('times out a body that never arrives, aborting its request', () =>
    Effect.gen(function* () {
      const { fetchFn, sent } = fakeFetch(
        { ok: true, status: 200, json: () => new Promise(() => undefined) },
        aResponse(200, { results: [] }),
      );

      const fiber = yield* Effect.fork(makeHttpClient(fetchFn).getJson(URL));
      yield* advanceClock(Duration.seconds(10));
      yield* advanceClock(Duration.millis(200));

      expect(yield* Fiber.join(fiber)).toEqual({ results: [] });
      expect(sent[0]?.init.signal?.aborted).toBe(true);
    }),
  );

  itEffect('serializes the POST body only when the request runs', () =>
    Effect.gen(function* () {
      const { fetchFn, sent } = fakeFetch(aResponse(200, {}));
      const body = { textQuery: 'Colosseum' };

      const post = makeHttpClient(fetchFn).postJson(URL, body);
      body.textQuery = 'Pantheon';
      yield* post;

      expect(sent[0]?.init.body).toBe('{"textQuery":"Pantheon"}');
    }),
  );
});

function aResponse(status: number, body: unknown): FetchResponse {
  return { ok: status >= 200 && status < 300, status, json: () => Promise.resolve(body) };
}
