import { inject, injectable } from 'inversify';
import type { ILogger, Result } from '@/features/core/error';
import { ERROR_TYPES } from '@/features/core/error';
import { IMAGES_TYPES } from '@/features/core/images/di/types';
import type { ImageFetchOptions } from '@/features/core/images/domain/entities/ImageFetchOptions';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';
import type { IImageListRepository } from '@/features/core/images/domain/entities/repositories/IImageListRepository';

@injectable()
export class FetchGooglePlaceImagesUseCase {
  constructor(
    @inject(IMAGES_TYPES.GooglePlacesImageListRepository) private readonly imageRepository: IImageListRepository,
    @inject(ERROR_TYPES.Logger) private readonly logger: ILogger,
  ) {}

  /**
   * Fetches multiple Google Places images for a place.
   * @param resourceName - The place identifier/name to fetch images for.
   * @param count - The maximum number of images to return.
   * @param options - Optional fetch options (e.g. resolution).
   * @returns A `Result` with an array of `ImageResult` (empty if none); failure is logged.
   */
  async execute(resourceName: string, count: number, options?: ImageFetchOptions): Promise<Result<ImageResult[]>> {
    const result = await this.imageRepository.getImages(resourceName, count, options);
    if (!result.success) this.logger.error(result.error, { resourceName });
    return result;
  }
}
