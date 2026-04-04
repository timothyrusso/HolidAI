import type { ILogger, Result } from '@/features/core/error';
import { ERROR_TYPES } from '@/features/core/error/di/types';
import { IMAGES_TYPES } from '@/features/core/images/di/types';
import type { ImageFetchOptions } from '@/features/core/images/domain/entities/ImageFetchOptions';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';
import type { IImageRepository } from '@/features/core/images/domain/entities/repositories/IImageRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class FetchGooglePlaceImageUseCase {
  constructor(
    @inject(IMAGES_TYPES.GooglePlacesImageRepository) private readonly imageRepository: IImageRepository,
    @inject(ERROR_TYPES.Logger) private readonly logger: ILogger,
  ) {}

  async execute(resourceName: string, options?: ImageFetchOptions): Promise<Result<ImageResult | null>> {
    const result = await this.imageRepository.getImage(resourceName, options);
    if (!result.success) this.logger.error(result.error, { resourceName });
    return result;
  }
}
