import type { Result } from '@/features/core/error';
import { ok } from '@/features/core/error';
import type { IHttpClient } from '@/features/core/http';
import { HTTP_TYPES } from '@/features/core/http/di/types';
import type { UnsplashSearchResponseDTO } from '@/features/core/images/data/dtos/UnsplashSearchResponseDTO';
import { IMAGES_TYPES } from '@/features/core/images/di/types';
import type { ImageFetchOptions } from '@/features/core/images/domain/entities/ImageFetchOptions';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';
import { UrlType } from '@/features/core/images/domain/entities/UrlType';
import type { IImageRepository } from '@/features/core/images/domain/entities/repositories/IImageRepository';
import { inject, injectable } from 'tsyringe';

const noImage = require('@/ui/assets/images/no-image-placeholder.jpg');

@injectable()
export class UnsplashImageRepository implements IImageRepository {
  constructor(
    @inject(HTTP_TYPES.HttpClient) private readonly http: IHttpClient,
    @inject(IMAGES_TYPES.UnsplashApiKey) private readonly apiKey: string,
  ) {}

  async getImage(query: string, options?: ImageFetchOptions): Promise<Result<ImageResult>> {
    const urlType = options?.urlType ?? UrlType.REGULAR;
    const url = `https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(query)}`;
    const result = await this.http.get<UnsplashSearchResponseDTO>(url, {
      headers: { Authorization: `Client-ID ${this.apiKey}` },
    });
    if (!result.success) return result;
    const photo = result.data.results?.[0];
    if (!photo) return ok({ url: noImage });
    return ok({ url: photo.urls[urlType], blurHash: photo.blur_hash ?? undefined });
  }
}
