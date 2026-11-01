import { inject, injectable } from 'inversify';
import type { Result } from '@/features/core/error';
import { ok } from '@/features/core/error';
import type { IHttpClient } from '@/features/core/http';
import { HTTP_TYPES } from '@/features/core/http';
import type {
  GooglePlacePhotoDTO,
  GooglePlacesSearchResponseDTO,
} from '@/features/core/images/data/dtos/GooglePlacesSearchResponseDTO';
import { IMAGES_TYPES } from '@/features/core/images/di/types';
import type { IPhotoNamesRepository } from '@/features/core/images/domain/entities/repositories/IPhotoNamesRepository';

@injectable()
export class GooglePlacesImageRepository implements IPhotoNamesRepository {
  constructor(
    @inject(HTTP_TYPES.HttpClient) private readonly http: IHttpClient,
    @inject(IMAGES_TYPES.GooglePlacesApiKey) private readonly apiKey: string,
  ) {}

  async getPhotoNames(placeName: string, count: number): Promise<Result<string[]>> {
    const result = await this.fetchPhotos(placeName);
    if (!result.success) return result;
    return ok(result.data.slice(0, count).map(photo => photo.name));
  }

  private async fetchPhotos(placeName: string): Promise<Result<readonly GooglePlacePhotoDTO[]>> {
    const result = await this.http.post<GooglePlacesSearchResponseDTO>(
      'https://places.googleapis.com/v1/places:searchText',
      { textQuery: placeName },
      { headers: { 'X-Goog-Api-Key': this.apiKey, 'X-Goog-FieldMask': 'places.id,places.photos' } },
    );
    if (!result.success) return result;
    return ok(result.data.places?.[0]?.photos ?? []);
  }
}
