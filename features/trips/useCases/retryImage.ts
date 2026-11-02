import { Effect } from 'effect';
import type { UnexpectedError } from '@/features/core/error';
import { ImageRepository, UrlType } from '@/features/core/images';
import { Network } from '@/features/core/network';
import type { CoverImage } from '@/features/trips/domain/entities/CoverImage';

/** How many Google Places photos an activity keeps. */
export const MAX_ACTIVITY_PHOTOS = 6;

/** Writes the new image to the trip. */
type Save<A> = (image: A) => Effect.Effect<void, UnexpectedError>;

/**
 * Runs `retry` only when the device is online and `isFirstRetry` says the failed image was not
 * retried yet: offline, the image keeps its chance for later.
 */
const whenOnlineFirstRetry = <A, E, R>(isFirstRetry: () => boolean, retry: Effect.Effect<A, E, R>) =>
  Effect.gen(function* () {
    const network = yield* Network;
    if (!(yield* network.isConnected) || !isFirstRetry()) return;
    yield* retry;
  });

/** Looks up a new Unsplash cover for `location` and saves it; a search with no photo saves nothing. */
export const retryCoverImage = (location: string, isFirstRetry: () => boolean, save: Save<CoverImage>) =>
  whenOnlineFirstRetry(
    isFirstRetry,
    Effect.gen(function* () {
      const images = yield* ImageRepository;
      const image = yield* images.getImage({ source: 'unsplash', query: location, urlType: UrlType.REGULAR });
      if (!image) return;
      yield* save({ url: typeof image.url === 'string' ? image.url : '', blurHash: image.blurHash ?? '' });
    }),
  );

/** Looks up a new Wikimedia picture of the dish `searchTerm` and saves it, an empty URL when there is none. */
export const retryDishImage = (searchTerm: string, isFirstRetry: () => boolean, save: Save<string>) =>
  whenOnlineFirstRetry(
    isFirstRetry,
    Effect.gen(function* () {
      const images = yield* ImageRepository;
      const image = yield* images.getImage({ source: 'wikimediaDish', query: searchTerm });
      yield* save(typeof image?.url === 'string' ? image.url : '');
    }),
  );

/** Looks up the Google Places photos of `placeName` in `location` and saves their names. */
export const retryActivityPhotos = (
  placeName: string,
  location: string,
  isFirstRetry: () => boolean,
  save: Save<readonly string[]>,
) =>
  whenOnlineFirstRetry(
    isFirstRetry,
    Effect.gen(function* () {
      const images = yield* ImageRepository;
      yield* save(yield* images.getPlacePhotoNames(`${placeName}, ${location}`, MAX_ACTIVITY_PHOTOS));
    }),
  );
