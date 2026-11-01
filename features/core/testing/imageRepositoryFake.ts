import { Effect, Layer } from 'effect';
import { ImageFetchFailed } from '@/features/core/error';
import { ImageRepository, type ImageResult } from '@/features/core/images';

/**
 * An `ImageRepository` that answers from `images` and `photoNames`, keyed by the query: a query
 * with no entry has no image (or no photo), and one mapped to `'fail'` fails with `ImageFetchFailed`.
 */
export const ImageRepositoryFake = (
  images: Readonly<Record<string, ImageResult | 'fail'>> = {},
  photoNames: Readonly<Record<string, readonly string[] | 'fail'>> = {},
) =>
  Layer.succeed(ImageRepository, {
    getImage: request => {
      const image = Object.hasOwn(images, request.query) ? images[request.query] : undefined;
      return image === 'fail'
        ? Effect.fail(new ImageFetchFailed({ source: request.source }))
        : Effect.succeed(image ?? null);
    },
    getPlacePhotoNames: (query, count) => {
      const names = Object.hasOwn(photoNames, query) ? photoNames[query] : undefined;
      return names === 'fail'
        ? Effect.fail(new ImageFetchFailed({ source: 'googlePlaces' }))
        : Effect.succeed((names ?? []).slice(0, count));
    },
  });
