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
    /**
     * Searches Google Places for `query` and returns the photo resource names of the first
     * matching place, up to `count`.
     */
    readonly getPlacePhotoNames: (
      query: string,
      count: number,
    ) => Effect.Effect<readonly string[], ImageFetchFailed | NetworkFailure | ConfigMissing>;
  }
>() {}
