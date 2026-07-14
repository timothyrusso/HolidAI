import { inject, injectable } from 'inversify';
import type { Result } from '@/features/core/error';
import { ok } from '@/features/core/error';
import type { FetchUnsplashImageUseCase } from '@/features/core/images';
import { IMAGES_TYPES, UrlType } from '@/features/core/images';
import type { TripAiResp } from '@/features/trips';

@injectable()
export class EnrichTripWithCoverImageUseCase {
  constructor(
    @inject(IMAGES_TYPES.FetchUnsplashImageUseCase)
    private readonly fetchUnsplashImageUseCase: FetchUnsplashImageUseCase,
  ) {}

  /**
   * Enriches a trip with an Unsplash cover image for its destination.
   * @param tripAiResp - The generated trip to enrich.
   * @returns A `Result` with the trip carrying `coverImage` ({ url, blurHash }); empty strings where
   * no image is found.
   */
  async execute(tripAiResp: TripAiResp): Promise<Result<TripAiResp>> {
    const location = tripAiResp.tripDetails.location.split(',')[0];
    const result = await this.fetchUnsplashImageUseCase.execute(location, { urlType: UrlType.REGULAR });
    const data = result.success ? result.data : null;
    const coverImage = {
      url: typeof data?.url === 'string' ? data.url : '',
      blurHash: data?.blurHash ?? '',
    };
    return ok({ ...tripAiResp, coverImage });
  }
}
