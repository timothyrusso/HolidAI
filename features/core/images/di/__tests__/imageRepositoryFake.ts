import { Effect, Layer } from 'effect';
import { ImageFetchFailed } from '@/features/core/error';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';
import { ImageRepository } from '@/features/core/images/domain/repositories/ImageRepository';

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
      const image = images[request.query];
      return image === 'fail'
        ? Effect.fail(new ImageFetchFailed({ source: request.source }))
        : Effect.succeed(image ?? null);
    },
    getPlacePhotoNames: (query, count) => {
      const names = photoNames[query];
      return names === 'fail'
        ? Effect.fail(new ImageFetchFailed({ source: 'googlePlaces' }))
        : Effect.succeed((names ?? []).slice(0, count));
    },
  });
