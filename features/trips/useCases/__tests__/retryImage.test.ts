import { itEffect } from '@timothyrusso/effect-core/testing';
import { Effect, Layer } from 'effect';
import { ImageRepositoryFake, NetworkFake } from '@/features/core/testing';
import type { CoverImage } from '@/features/trips/domain/entities/CoverImage';
import {
  MAX_ACTIVITY_PHOTOS,
  retryActivityPhotos,
  retryCoverImage,
  retryDishImage,
} from '@/features/trips/useCases/retryImage';

const LISBON = { url: 'https://images.unsplash.com/lisbon-regular', blurHash: 'LKO2?U%2Tw=w' };
const NATA = { url: 'https://upload.wikimedia.org/pastel-de-nata.jpg' };
const BELEM_PHOTOS = Array.from({ length: 8 }, (_, index) => `places/ChIJ2/photos/AU${index + 1}`);

const images = ImageRepositoryFake(
  { Lisbon: LISBON, 'pastel de nata': NATA, Porto: 'fail' },
  { 'Belém Tower, Lisbon': BELEM_PHOTOS, 'Belém Tower, Porto': 'fail' },
);
const online = Layer.merge(images, NetworkFake('online'));
const offline = Layer.merge(images, NetworkFake('offline'));
const unknownNetwork = Layer.merge(images, NetworkFake('broken'));

/** A save that records what it was given. */
const recorder = <A>() => {
  const saved: A[] = [];
  return { saved, save: (image: A) => Effect.sync(() => void saved.push(image)) };
};
const first = () => true;
const again = () => false;

describe('retryCoverImage', () => {
  itEffect(
    'saves the new cover the search found',
    Effect.gen(function* () {
      const covers = recorder<CoverImage>();

      yield* retryCoverImage('Lisbon', first, covers.save);

      expect(covers.saved).toEqual([LISBON]);
    }),
    online,
  );

  itEffect(
    'saves nothing when the search has no photo',
    Effect.gen(function* () {
      const covers = recorder<CoverImage>();

      yield* retryCoverImage('Nowhere', first, covers.save);

      expect(covers.saved).toEqual([]);
    }),
    online,
  );

  itEffect(
    'neither searches nor saves offline, and leaves the URL for a later retry',
    Effect.gen(function* () {
      const covers = recorder<CoverImage>();
      let asked = false;

      yield* retryCoverImage(
        'Lisbon',
        () => {
          asked = true;
          return true;
        },
        covers.save,
      );

      expect(covers.saved).toEqual([]);
      expect(asked).toBe(false);
    }),
    offline,
  );

  itEffect(
    'saves nothing for a URL already retried',
    Effect.gen(function* () {
      const covers = recorder<CoverImage>();

      yield* retryCoverImage('Lisbon', again, covers.save);

      expect(covers.saved).toEqual([]);
    }),
    online,
  );

  itEffect(
    'fails with the provider failure and saves nothing',
    Effect.gen(function* () {
      const covers = recorder<CoverImage>();

      const error = yield* Effect.flip(retryCoverImage('Porto', first, covers.save));

      expect(error._tag).toBe('ImageFetchFailed');
      expect(covers.saved).toEqual([]);
    }),
    online,
  );

  itEffect(
    'fails with NetworkFailure when the network state cannot be read, and saves nothing',
    Effect.gen(function* () {
      const covers = recorder<CoverImage>();

      const error = yield* Effect.flip(retryCoverImage('Lisbon', first, covers.save));

      expect(error._tag).toBe('NetworkFailure');
      expect(covers.saved).toEqual([]);
    }),
    unknownNetwork,
  );
});

describe('retryDishImage', () => {
  itEffect(
    'saves the new picture of the dish',
    Effect.gen(function* () {
      const urls = recorder<string>();

      yield* retryDishImage('pastel de nata', first, urls.save);

      expect(urls.saved).toEqual([NATA.url]);
    }),
    online,
  );

  itEffect(
    'saves an empty URL when there is no picture, so the placeholder shows',
    Effect.gen(function* () {
      const urls = recorder<string>();

      yield* retryDishImage('bifana', first, urls.save);

      expect(urls.saved).toEqual(['']);
    }),
    online,
  );

  itEffect(
    'saves nothing offline',
    Effect.gen(function* () {
      const urls = recorder<string>();

      yield* retryDishImage('pastel de nata', first, urls.save);

      expect(urls.saved).toEqual([]);
    }),
    offline,
  );
});

describe('retryActivityPhotos', () => {
  itEffect(
    'saves the names of the photos of the place in its city, up to the activity maximum',
    Effect.gen(function* () {
      const names = recorder<readonly string[]>();

      yield* retryActivityPhotos('Belém Tower', 'Lisbon', first, names.save);

      expect(names.saved).toEqual([BELEM_PHOTOS.slice(0, MAX_ACTIVITY_PHOTOS)]);
    }),
    online,
  );

  itEffect(
    'fails with the provider failure and saves nothing',
    Effect.gen(function* () {
      const names = recorder<readonly string[]>();

      const error = yield* Effect.flip(retryActivityPhotos('Belém Tower', 'Porto', first, names.save));

      expect(error._tag).toBe('ImageFetchFailed');
      expect(names.saved).toEqual([]);
    }),
    online,
  );
});
