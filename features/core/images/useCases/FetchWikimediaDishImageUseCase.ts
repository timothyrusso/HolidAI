import { inject, injectable } from 'inversify';
import type { ILogger, Result } from '@/features/core/error';
import { ERROR_TYPES } from '@/features/core/error';
import { IMAGES_TYPES } from '@/features/core/images/di/types';
import type { ImageFetchOptions } from '@/features/core/images/domain/entities/ImageFetchOptions';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';
import type { IImageRepository } from '@/features/core/images/domain/entities/repositories/IImageRepository';

@injectable()
export class FetchWikimediaDishImageUseCase {
  constructor(
    @inject(IMAGES_TYPES.WikimediaDishImageRepository) private readonly repository: IImageRepository,
    @inject(ERROR_TYPES.Logger) private readonly logger: ILogger,
  ) {}

  /**
   * Fetches a Wikimedia Commons image for a dish.
   * @param dish - The dish search term used for the Wikimedia lookup.
   * @param options - Optional fetch options (e.g. resolution).
   * @returns A `Result` with the `ImageResult`, or `null` when no image is found; failure is logged.
   */
  async execute(dish: string, options?: ImageFetchOptions): Promise<Result<ImageResult | null>> {
    const result = await this.repository.getImage(dish, options);
    if (!result.success) this.logger.error(result.error, { dish });
    return result;
  }
}
