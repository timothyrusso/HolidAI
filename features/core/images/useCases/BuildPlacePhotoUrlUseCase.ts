import { inject, injectable } from 'inversify';
import { IMAGES_TYPES } from '@/features/core/images/di/types';
import { buildGooglePlacesMediaUrl } from '@/features/core/images/domain/utils/buildGooglePlacesMediaUrl';

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
    return buildGooglePlacesMediaUrl(resourceName, this.apiKey, maxWidthPx);
  }
}
