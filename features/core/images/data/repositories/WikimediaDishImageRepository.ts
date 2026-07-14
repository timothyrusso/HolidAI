import { inject, injectable } from 'inversify';
import type { Result } from '@/features/core/error';
import { ok } from '@/features/core/error';
import type { IHttpClient } from '@/features/core/http';
import { HTTP_TYPES } from '@/features/core/http';
import type {
  WikimediaPageDTO,
  WikimediaSearchResponseDTO,
} from '@/features/core/images/data/dtos/WikimediaSearchResponseDTO';
import { FOOD_CATEGORY_KEYWORDS } from '@/features/core/images/domain/entities/foodCategoryKeywords';
import type { ImageFetchOptions } from '@/features/core/images/domain/entities/ImageFetchOptions';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';
import { IMAGE_RESOLUTION } from '@/features/core/images/domain/entities/imageResolutions';
import type { IImageRepository } from '@/features/core/images/domain/entities/repositories/IImageRepository';

const BASE_URL = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT = 'HolidAI/1.0 (https://github.com/timothyrusso/holidai)';
const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'] as const;
const MIN_IMAGE_DIMENSION_PX = IMAGE_RESOLUTION.low;

@injectable()
export class WikimediaDishImageRepository implements IImageRepository {
  constructor(@inject(HTTP_TYPES.HttpClient) private readonly http: IHttpClient) {}

  async getImage(dish: string, options?: ImageFetchOptions): Promise<Result<ImageResult | null>> {
    const urlWidth = options?.maxWidthPx ?? IMAGE_RESOLUTION.high;
    const params = new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: `${dish} food haswbstatement:P180`,
      gsrnamespace: '6',
      gsrlimit: '20',
      gsrsort: 'relevance',
      prop: 'imageinfo|categories',
      iiprop: 'url|dimensions|extmetadata',
      cllimit: '50',
      iiurlwidth: String(urlWidth),
      iimetadataversion: 'latest',
      format: 'json',
      origin: '*',
    });

    const result = await this.http.get<WikimediaSearchResponseDTO>(`${BASE_URL}?${params.toString()}`, {
      headers: { 'User-Agent': USER_AGENT },
    });

    if (!result.success) return result;

    const pages = Object.values(result.data.query?.pages ?? {});
    const info = pages.find(p => this.isUsableImage(p, dish))?.imageinfo?.[0] ?? null;

    if (!info) return ok(null);
    return ok({ url: info.thumburl });
  }

  private isUsableImage(page: WikimediaPageDTO, dish: string): boolean {
    const info = page.imageinfo?.[0];
    if (!info?.thumburl) return false;
    if (info.width < MIN_IMAGE_DIMENSION_PX && info.height < MIN_IMAGE_DIMENSION_PX) return false;
    if (!this.isAllowedImageExtension(info.thumburl)) return false;
    if (info.extmetadata?.Restrictions?.value) return false;
    if (!this.hasFoodCategory(page, dish)) return false;
    return true;
  }

  private isAllowedImageExtension(url: string): boolean {
    const lower = url.toLowerCase();
    return ALLOWED_IMAGE_EXTENSIONS.some(ext => lower.endsWith(ext));
  }

  private hasFoodCategory(page: WikimediaPageDTO, dish: string): boolean {
    if (!page.categories?.length) return false;
    const lowerDish = dish.toLowerCase();
    return page.categories.some(cat => {
      const lowerCat = cat.title.toLowerCase();
      return lowerCat.includes(lowerDish) || FOOD_CATEGORY_KEYWORDS.some(kw => lowerCat.includes(kw));
    });
  }
}
