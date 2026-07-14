import { inject, injectable } from 'inversify';
import type { ILogger, Result } from '@/features/core/error';
import { ERROR_TYPES } from '@/features/core/error';
import { IMAGES_TYPES } from '@/features/core/images/di/types';
import type { ImageFetchOptions } from '@/features/core/images/domain/entities/ImageFetchOptions';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';
import type { IImageRepository } from '@/features/core/images/domain/entities/repositories/IImageRepository';

@injectable()
export class FetchGooglePlaceImageUseCase {
  constructor(
    @inject(IMAGES_TYPES.GooglePlacesImageRepository) private readonly imageRepository: IImageRepository,
    @inject(ERROR_TYPES.Logger) private readonly logger: ILogger,
  ) {}

  /**
   * Fetches a single Google Places image for a place.
   * @param resourceName - The place identifier/name to fetch an image for.
   * @param options - Optional fetch options (e.g. resolution).
   * @returns A `Result` with the `ImageResult`, or `null` when no image is found; failure is logged.
   */
  async execute(resourceName: string, options?: ImageFetchOptions): Promise<Result<ImageResult | null>> {
    const result = await this.imageRepository.getImage(resourceName, options);
    if (!result.success) this.logger.error(result.error, { resourceName });
    return result;
  }
}
