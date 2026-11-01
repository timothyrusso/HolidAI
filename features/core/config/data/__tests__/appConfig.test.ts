import { ConfigError } from '@timothyrusso/effect-core';
import { itEffect } from '@timothyrusso/effect-core/testing';
import { Effect } from 'effect';
import { AppConfig } from '@/features/core/config/data/appConfig';

const readConfig = (extra: unknown) =>
  Effect.provide(
    AppConfig.Config,
    AppConfig.layer(() => extra),
  );

describe('AppConfig', () => {
  itEffect(
    'decodes a complete extra block',
    Effect.gen(function* () {
      const config = yield* readConfig(anExtraBlock());

      expect(config.convexUrl).toBe('https://happy-otter-123.convex.cloud');
      expect(config.unsplashAccessKey).toBe('unsplash-key');
    }),
  );

  itEffect(
    'boots without the optional provider keys and the Sentry DSN',
    Effect.gen(function* () {
      const config = yield* readConfig(
        anExtraBlock({
          googlePlacesApiKey: undefined,
          googleGeminiApiKey: undefined,
          rapidApiKey: undefined,
          unsplashAccessKey: undefined,
          sentryDsn: undefined,
        }),
      );

      expect(config.unsplashAccessKey).toBeUndefined();
      expect(config.sentryDsn).toBeUndefined();
    }),
  );

  itEffect(
    'fails the boot with a ConfigError naming a missing required key',
    Effect.gen(function* () {
      const error = yield* Effect.flip(readConfig(anExtraBlock({ clerkPublishableKey: undefined })));

      expect(error).toBeInstanceOf(ConfigError);
      expect(error.field).toBe('clerkPublishableKey');
    }),
  );

  itEffect(
    'fails the boot for an empty required key',
    Effect.gen(function* () {
      const error = yield* Effect.flip(readConfig(anExtraBlock({ mmkvEncryptionKey: '' })));

      expect(error.field).toBe('mmkvEncryptionKey');
    }),
  );

  itEffect(
    'fails the boot naming the first required key when there is no extra block at all',
    Effect.gen(function* () {
      const error = yield* Effect.flip(readConfig(undefined));

      expect(error.field).toBe('convexUrl');
    }),
  );
});

const anExtraBlock = (overrides: Record<string, unknown> = {}): Record<string, unknown> => ({
  convexUrl: 'https://happy-otter-123.convex.cloud',
  clerkPublishableKey: 'pk_test_holidai',
  mmkvEncryptionKey: 'holidai-encryption-key',
  googlePlacesApiKey: 'places-key',
  googleGeminiApiKey: 'gemini-key',
  rapidApiKey: 'rapid-key',
  unsplashAccessKey: 'unsplash-key',
  sentryDsn: 'https://public@o0.ingest.sentry.io/0',
  router: { origin: false },
  ...overrides,
});
