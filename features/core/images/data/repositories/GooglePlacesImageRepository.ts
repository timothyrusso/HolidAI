import type { Result } from '@/features/core/error';
import { ok } from '@/features/core/error';
import type { IHttpClient } from '@/features/core/http';
import { HTTP_TYPES } from '@/features/core/http/di/types';
import type { GooglePlacesSearchResponseDTO } from '@/features/core/images/data/dtos/GooglePlacesSearchResponseDTO';
import { IMAGES_TYPES } from '@/features/core/images/di/types';
import type { ImageFetchOptions } from '@/features/core/images/domain/entities/ImageFetchOptions';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';
import type { IImageRepository } from '@/features/core/images/domain/entities/repositories/IImageRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GooglePlacesImageRepository implements IImageRepository {
  constructor(
    @inject(HTTP_TYPES.HttpClient) private readonly http: IHttpClient,
    @inject(IMAGES_TYPES.GooglePlacesApiKey) private readonly apiKey: string,
  ) {}

  async getImage(placeName: string, options?: ImageFetchOptions): Promise<Result<ImageResult | null>> {
    const maxWidthPx = options?.maxWidthPx ?? 500;
    const result = await this.http.post<GooglePlacesSearchResponseDTO>(
      'https://places.googleapis.com/v1/places:searchText',
      { textQuery: placeName },
      { headers: { 'X-Goog-Api-Key': this.apiKey, 'X-Goog-FieldMask': 'places.id,places.photos' } },
    );
    if (!result.success) return result;
    const photoName = result.data.places?.[0]?.photos?.[0]?.name;
    if (!photoName) return ok(null);
    return ok({
      url: `https://places.googleapis.com/v1/${photoName}/media?key=${this.apiKey}&maxWidthPx=${maxWidthPx}`,
    });
  }
}
