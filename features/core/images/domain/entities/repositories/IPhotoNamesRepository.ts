import type { Result } from '@/features/core/error';

export interface IPhotoNamesRepository {
  getPhotoNames(placeName: string, count: number): Promise<Result<string[]>>;
}
