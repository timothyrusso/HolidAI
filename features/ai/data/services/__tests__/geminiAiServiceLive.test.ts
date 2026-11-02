import { itEffect } from '@timothyrusso/effect-core/testing';
import { Effect, Either, Layer } from 'effect';
import answer from '@/features/ai/__fixtures__/generatedTripAnswer.json';
import { makeGeminiAiService } from '@/features/ai/data/services/geminiAiServiceLive';
import { AiService } from '@/features/ai/domain/services/AiService';
import { AppConfig, type AppConfigValues } from '@/features/core/config';
import { TEST_CONFIG } from '@/features/core/testing';

/** What the fake Gemini API answers each request with, in order, the last one repeating. */
type Reply = { readonly status: number; readonly body: unknown };

/**
 * A `fetch` that answers like the Gemini API, and keeps the URL of every request it was sent. With
 * no replies it rejects as React Native's `fetch` does when the connection drops.
 */
const GeminiFake = (replies: readonly Reply[]) => {
  const sent: string[] = [];
  const fetch: typeof globalThis.fetch = async input => {
    sent.push(String(input));
    const reply = replies[Math.min(sent.length - 1, replies.length - 1)];
    if (reply === undefined) throw new TypeError('Network request failed');
    return new Response(JSON.stringify(reply.body), {
      status: reply.status,
      headers: { 'Content-Type': 'application/json' },
    });
  };
  return { fetch, sent };
};

const serviceOver = (gemini: ReturnType<typeof GeminiFake>, config: AppConfigValues = TEST_CONFIG) =>
  makeGeminiAiService(gemini.fetch).pipe(Layer.provide(AppConfig.layerOf(config)));

const search = (prompt: string) => Effect.flatMap(AiService, ai => ai.search(prompt));
const extractTrip = (context: string) => Effect.flatMap(AiService, ai => ai.extractTrip('Lisbon for 2 days', context));

const found = GeminiFake([aCandidate('Lisbon in May: castles, trams and custard tarts.')]);
const askedModel = GeminiFake([aCandidate('Lisbon in May: castles, trams and custard tarts.')]);
const offline = GeminiFake([]);
const offlineOnExpoFetch = {
  sent: [],
  fetch: async () => {
    throw new Error('fetch failed: java.net.UnknownHostException: Unable to resolve host');
  },
};
const ourBug = {
  sent: [],
  fetch: async () => {
    throw new TypeError("Cannot read properties of undefined (reading 'candidates')");
  },
};
const foundNothing = GeminiFake([aCandidate('')]);
const overloaded = GeminiFake([{ status: 503, body: anApiError(503, 'UNAVAILABLE') }]);
const badRequest = GeminiFake([{ status: 400, body: anApiError(400, 'INVALID_ARGUMENT') }]);
const withoutKey = GeminiFake([aCandidate('Lisbon')]);
const extracted = GeminiFake([aCandidate(JSON.stringify(answer))]);
const notATrip = GeminiFake([aCandidate(JSON.stringify({ tripDetails: { location: 'Lisbon' } }))]);

describe('GeminiAiServiceLive, search', () => {
  itEffect(
    'returns the text of the grounded answer',
    Effect.gen(function* () {
      expect(yield* search('Lisbon for 2 days')).toBe('Lisbon in May: castles, trams and custard tarts.');
    }),
    serviceOver(found),
  );

  itEffect(
    'asks Gemini 2.5 Flash',
    Effect.gen(function* () {
      yield* search('Lisbon for 2 days');

      expect(askedModel.sent[0]).toContain('/models/gemini-2.5-flash:generateContent');
    }),
    serviceOver(askedModel),
  );

  itEffect(
    'fails with a transient GeminiSearchError when the connection drops',
    Effect.gen(function* () {
      const result = yield* Effect.either(search('Lisbon for 2 days'));

      expect(Either.isLeft(result) && result.left).toMatchObject({ _tag: 'GeminiSearchError', transient: true });
    }),
    serviceOver(offline),
  );

  itEffect(
    "fails with a transient GeminiSearchError when Expo's fetch loses the connection",
    Effect.gen(function* () {
      const result = yield* Effect.either(search('Lisbon for 2 days'));

      expect(Either.isLeft(result) && result.left).toMatchObject({ _tag: 'GeminiSearchError', transient: true });
    }),
    serviceOver(offlineOnExpoFetch),
  );

  itEffect(
    'fails with a non-transient GeminiSearchError for any other TypeError, so it is never sent again',
    Effect.gen(function* () {
      const result = yield* Effect.either(search('Lisbon for 2 days'));

      expect(Either.isLeft(result) && result.left).toMatchObject({ _tag: 'GeminiSearchError', transient: false });
    }),
    serviceOver(ourBug),
  );

  itEffect(
    'fails with a non-transient GeminiSearchError when the answer is empty',
    Effect.gen(function* () {
      const result = yield* Effect.either(search('Lisbon for 2 days'));

      expect(Either.isLeft(result) && result.left).toMatchObject({ _tag: 'GeminiSearchError', transient: false });
    }),
    serviceOver(foundNothing),
  );

  itEffect(
    'fails with a transient GeminiSearchError, once, when Gemini is overloaded',
    Effect.gen(function* () {
      const result = yield* Effect.either(search('Lisbon for 2 days'));

      expect(Either.isLeft(result) && result.left).toMatchObject({ _tag: 'GeminiSearchError', transient: true });
      expect(overloaded.sent).toHaveLength(1);
    }),
    serviceOver(overloaded),
  );

  itEffect(
    'fails with a non-transient GeminiSearchError when Gemini rejects the request',
    Effect.gen(function* () {
      const result = yield* Effect.either(search('Lisbon for 2 days'));

      expect(Either.isLeft(result) && result.left).toMatchObject({ _tag: 'GeminiSearchError', transient: false });
    }),
    serviceOver(badRequest),
  );

  itEffect(
    'fails with ConfigMissing and sends nothing when the API key is not configured',
    Effect.gen(function* () {
      const result = yield* Effect.either(search('Lisbon for 2 days'));

      expect(Either.isLeft(result) && result.left).toMatchObject({
        _tag: 'ConfigMissing',
        field: 'googleGeminiApiKey',
      });
      expect(withoutKey.sent).toEqual([]);
    }),
    serviceOver(withoutKey, { ...TEST_CONFIG, googleGeminiApiKey: undefined }),
  );
});

describe('GeminiAiServiceLive, extractTrip', () => {
  itEffect(
    'returns the trip the answer holds, decoded for the domain',
    Effect.gen(function* () {
      const trip = yield* extractTrip('Lisbon in May: castles, trams and custard tarts.');

      expect(trip.tripDetails).toMatchObject({ location: 'Lisbon, Portugal', startDate: '2026-05-12' });
      expect(trip.coverImage).toEqual({ url: '', blurHash: '' });
    }),
    serviceOver(extracted),
  );

  itEffect(
    'fails with a non-transient GeminiExtractionError when the answer is not a trip',
    Effect.gen(function* () {
      const result = yield* Effect.either(extractTrip('Lisbon in May: castles, trams and custard tarts.'));

      expect(Either.isLeft(result) && result.left).toMatchObject({ _tag: 'GeminiExtractionError', transient: false });
    }),
    serviceOver(notATrip),
  );
});

function aCandidate(text: string): Reply {
  return {
    status: 200,
    body: {
      candidates: [{ content: { role: 'model', parts: [{ text }] }, finishReason: 'STOP', index: 0 }],
      usageMetadata: { promptTokenCount: 120, candidatesTokenCount: 48, totalTokenCount: 168 },
    },
  };
}

function anApiError(code: number, status: string) {
  return { error: { code, message: `Gemini answered ${status}`, status } };
}
