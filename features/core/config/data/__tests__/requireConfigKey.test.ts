import { itEffect } from '@timothyrusso/effect-core/testing';
import { Effect } from 'effect';
import { requireConfigKey } from '@/features/core/config/data/requireConfigKey';
import type { AppConfigValues } from '@/features/core/config/domain/schemas/AppConfigSchema';

describe('requireConfigKey', () => {
  itEffect(
    'returns the value of a key that is set',
    Effect.gen(function* () {
      expect(yield* requireConfigKey(aConfig(), 'unsplashAccessKey')).toBe('unsplash-key');
    }),
  );

  itEffect(
    'fails with ConfigMissing naming a key that is absent',
    Effect.gen(function* () {
      const error = yield* Effect.flip(
        requireConfigKey(aConfig({ googlePlacesApiKey: undefined }), 'googlePlacesApiKey'),
      );

      expect(error._tag).toBe('ConfigMissing');
      expect(error.field).toBe('googlePlacesApiKey');
    }),
  );

  itEffect(
    'fails with ConfigMissing for a key set to an empty string',
    Effect.gen(function* () {
      const error = yield* Effect.flip(requireConfigKey(aConfig({ unsplashAccessKey: '' }), 'unsplashAccessKey'));

      expect(error.field).toBe('unsplashAccessKey');
    }),
  );
});

const aConfig = (overrides: Partial<AppConfigValues> = {}): AppConfigValues => ({
  convexUrl: 'https://happy-otter-123.convex.cloud',
  clerkPublishableKey: 'pk_test_holidai',
  mmkvEncryptionKey: 'holidai-encryption-key',
  googlePlacesApiKey: 'places-key',
  unsplashAccessKey: 'unsplash-key',
  ...overrides,
});
