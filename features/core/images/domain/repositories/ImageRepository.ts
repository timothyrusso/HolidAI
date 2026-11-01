import { Context, type Effect } from 'effect';
import type { ConfigMissing, ImageFetchFailed, NetworkFailure } from '@/features/core/error';
import type { ImageRequest } from '@/features/core/images/domain/entities/ImageRequest';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';

/** Image search over the app's providers: Unsplash, Google Places and Wikimedia Commons. */
export class ImageRepository extends Context.Tag('images/ImageRepository')<
  ImageRepository,
  {
    /** The best image for `request`, or `null` when the provider has none. */
    readonly getImage: (
      request: ImageRequest,
    ) => Effect.Effect<ImageResult | null, ImageFetchFailed | NetworkFailure | ConfigMissing>;
  }
>() {}
