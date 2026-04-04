import type { Result } from '@/features/core/error';
import type { ImageFetchOptions } from '@/features/core/images/domain/entities/ImageFetchOptions';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';

export interface IImageRepository {
  getImage(resourceName: string, options?: ImageFetchOptions): Promise<Result<ImageResult | null>>;
}
