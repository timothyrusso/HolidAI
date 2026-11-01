import { inject, injectable } from 'inversify';
import type { Result } from '@/features/core/error';
import { ok } from '@/features/core/error';
import type { IHttpClient } from '@/features/core/http';
import { HTTP_TYPES } from '@/features/core/http';
import {
  selectDishImage,
  WIKIMEDIA_HEADERS,
  wikimediaDishSearchUrl,
} from '@/features/core/images/data/adapters/wikimediaDishSearch';
import type { WikimediaSearchResponseDTO } from '@/features/core/images/data/dtos/WikimediaSearchResponseDTO';
import type { ImageFetchOptions } from '@/features/core/images/domain/entities/ImageFetchOptions';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';
import { IMAGE_RESOLUTION } from '@/features/core/images/domain/entities/imageResolutions';
import type { IImageRepository } from '@/features/core/images/domain/entities/repositories/IImageRepository';

@injectable()
export class WikimediaDishImageRepository implements IImageRepository {
  constructor(@inject(HTTP_TYPES.HttpClient) private readonly http: IHttpClient) {}

  async getImage(dish: string, options?: ImageFetchOptions): Promise<Result<ImageResult | null>> {
    const urlWidth = options?.maxWidthPx ?? IMAGE_RESOLUTION.high;
    const result = await this.http.get<WikimediaSearchResponseDTO>(wikimediaDishSearchUrl(dish, urlWidth), {
      headers: WIKIMEDIA_HEADERS,
    });

    if (!result.success) return result;

    const info = selectDishImage(Object.values(result.data.query?.pages ?? {}), dish);

    if (!info) return ok(null);
    return ok({ url: info.thumburl });
  }
}
