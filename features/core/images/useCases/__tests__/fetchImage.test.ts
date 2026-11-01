import { itEffect } from '@timothyrusso/effect-core/testing';
import { Effect } from 'effect';
import { ImageRepositoryFake } from '@/features/core/images/di/__tests__/imageRepositoryFake';
import { fetchImage } from '@/features/core/images/useCases/fetchImage';

const KYOTO = { url: 'https://images.unsplash.com/kyoto-regular', blurHash: 'LEHV6nWB2yk8' };

describe('fetchImage', () => {
  itEffect(
    'returns the image the provider has for the request',
    Effect.gen(function* () {
      expect(yield* fetchImage({ source: 'unsplash', query: 'Kyoto' })).toEqual(KYOTO);
    }),
    ImageRepositoryFake({ Kyoto: KYOTO }),
  );

  itEffect(
    'returns null when the provider has no image',
    Effect.gen(function* () {
      expect(yield* fetchImage({ source: 'unsplash', query: 'Nowhere' })).toBeNull();
    }),
    ImageRepositoryFake({ Kyoto: KYOTO }),
  );

  itEffect(
    'fails with the provider failure',
    Effect.gen(function* () {
      const error = yield* Effect.flip(fetchImage({ source: 'wikimediaDish', query: 'Carbonara' }));

      expect(error._tag).toBe('ImageFetchFailed');
    }),
    ImageRepositoryFake({ Carbonara: 'fail' }),
  );
});
