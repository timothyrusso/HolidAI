import { IMAGES_TYPES } from '@/features/core/images/di/types';
import { inject, injectable } from 'inversify';

@injectable()
export class BuildPlacePhotoUrlUseCase {
  constructor(@inject(IMAGES_TYPES.GooglePlacesApiKey) private readonly apiKey: string) {}

  /**
   * Builds a Google Places photo media URL for a given photo resource.
   * @param resourceName - The Google Places photo resource name (e.g. 'places/XXX/photos/YYY').
   * @param maxWidthPx - The maximum image width in pixels requested from the API.
   * @returns The fully-qualified Google Places media URL including the API key and width.
   */
  execute(resourceName: string, maxWidthPx: number): string {
    return `https://places.googleapis.com/v1/${resourceName}/media?key=${this.apiKey}&maxWidthPx=${maxWidthPx}`;
  }
}
