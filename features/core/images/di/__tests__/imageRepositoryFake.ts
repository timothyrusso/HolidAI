import { Effect, Layer } from 'effect';
import { ImageFetchFailed } from '@/features/core/error';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';
import { ImageRepository } from '@/features/core/images/domain/repositories/ImageRepository';

/**
 * An `ImageRepository` that answers from `images`, keyed by the request's query: a query with no
 * entry has no image, and one mapped to `'fail'` fails with `ImageFetchFailed`.
 */
export const ImageRepositoryFake = (images: Readonly<Record<string, ImageResult | 'fail'>> = {}) =>
  Layer.succeed(ImageRepository, {
    getImage: request => {
      const image = images[request.query];
      return image === 'fail'
        ? Effect.fail(new ImageFetchFailed({ source: request.source }))
        : Effect.succeed(image ?? null);
    },
  });
