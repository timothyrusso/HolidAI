import { IMAGES_TYPES } from '@/features/core/images/di/types';
import { inject, injectable } from 'inversify';

@injectable()
export class BuildPlacePhotoUrlUseCase {
  constructor(@inject(IMAGES_TYPES.GooglePlacesApiKey) private readonly apiKey: string) {}

  execute(resourceName: string, maxWidthPx: number): string {
    return `https://places.googleapis.com/v1/${resourceName}/media?key=${this.apiKey}&maxWidthPx=${maxWidthPx}`;
  }
}
