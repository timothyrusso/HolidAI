import { itEffect } from '@timothyrusso/effect-core/testing';
import { Effect } from 'effect';
import { AppConfig } from '@/features/core/config';
import { placePhotoUrls } from '@/features/core/images/useCases/placePhotoUrls';
import { TEST_CONFIG } from '@/features/core/testing';

describe('placePhotoUrls', () => {
  itEffect(
    'returns the media URL of each photo, with the Places key and the width asked for',
    Effect.gen(function* () {
      expect(yield* placePhotoUrls(['places/ChIJ1/photos/AU1', 'places/ChIJ1/photos/AU2'], 400)).toEqual([
        'https://places.googleapis.com/v1/places/ChIJ1/photos/AU1/media?key=places-test-key&maxWidthPx=400',
        'https://places.googleapis.com/v1/places/ChIJ1/photos/AU2/media?key=places-test-key&maxWidthPx=400',
      ]);
    }),
    AppConfig.layerOf(TEST_CONFIG),
  );

  itEffect(
    'fails with ConfigMissing when the Places key is not configured',
    Effect.gen(function* () {
      const error = yield* Effect.flip(placePhotoUrls(['places/ChIJ1/photos/AU1'], 400));

      expect(error).toMatchObject({ _tag: 'ConfigMissing', field: 'googlePlacesApiKey' });
    }),
    AppConfig.layerOf({ ...TEST_CONFIG, googlePlacesApiKey: undefined }),
  );
});
