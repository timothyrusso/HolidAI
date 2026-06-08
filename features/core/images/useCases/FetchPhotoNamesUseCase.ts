import type { ILogger, Result } from '@/features/core/error';
import { ERROR_TYPES } from '@/features/core/error';
import { IMAGES_TYPES } from '@/features/core/images/di/types';
import type { IPhotoNamesRepository } from '@/features/core/images/domain/entities/repositories/IPhotoNamesRepository';
import { inject, injectable } from 'inversify';

@injectable()
export class FetchPhotoNamesUseCase {
  constructor(
    @inject(IMAGES_TYPES.GooglePlacesPhotoNamesRepository) private readonly photoNamesRepository: IPhotoNamesRepository,
    @inject(ERROR_TYPES.Logger) private readonly logger: ILogger,
  ) {}

  async execute(placeName: string, count: number): Promise<Result<string[]>> {
    const result = await this.photoNamesRepository.getPhotoNames(placeName, count);
    if (!result.success) this.logger.error(result.error, { placeName });
    return result;
  }
}
