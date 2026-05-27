import type { Result } from '@/features/core/error';
import { ok } from '@/features/core/error';
import type { IHttpClient } from '@/features/core/http';
import { HTTP_TYPES } from '@/features/core/http';
import type {
  WikimediaImageInfoDTO,
  WikimediaPageDTO,
  WikimediaSearchResponseDTO,
} from '@/features/core/images/data/dtos/WikimediaSearchResponseDTO';
import type { ImageFetchOptions } from '@/features/core/images/domain/entities/ImageFetchOptions';
import type { ImageResult } from '@/features/core/images/domain/entities/ImageResult';
import type { IImageRepository } from '@/features/core/images/domain/entities/repositories/IImageRepository';
import { inject, injectable } from 'inversify';

const BASE_URL = 'https://commons.wikimedia.org/w/api.php';
const USER_AGENT = 'HolidAI/1.0 (https://github.com/timothyrusso/holidai)';
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
const FOOD_CATEGORY_KEYWORDS = [
  'food',
  'cuisine',
  'dish',
  'recipe',
  'gastronomy',
  'cooking',
  'meal',
  'drink',
  'beverage',
];

@injectable()
export class WikimediaDishImageRepository implements IImageRepository {
  constructor(@inject(HTTP_TYPES.HttpClient) private readonly http: IHttpClient) {}

  async getImage(dish: string, options?: ImageFetchOptions): Promise<Result<ImageResult | null>> {
    const urlWidth = options?.maxWidthPx ?? 800;
    const params = new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: `${dish} food haswbstatement:P180`,
      gsrnamespace: '6',
      gsrlimit: '20',
      gsrsort: 'relevance',
      prop: 'imageinfo|categories',
      iiprop: 'url|dimensions|extmetadata',
      cllimit: '20',
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
    const info = this.pickBest(pages, false) ?? this.pickBest(pages, true);

    if (!info) return ok(null);
    return ok({ url: info.thumburl });
  }

  private pickBest(pages: WikimediaPageDTO[], relaxAspectRatio: boolean): WikimediaImageInfoDTO | null {
    const page = pages.find(p => this.isUsableImage(p, relaxAspectRatio));
    return page?.imageinfo?.[0] ?? null;
  }

  private isUsableImage(page: WikimediaPageDTO, relaxAspectRatio: boolean): boolean {
    const info = page.imageinfo?.[0];
    if (!info?.thumburl) return false;
    if (info.width < 400 || info.height < 300) return false;
    if (!this.isAllowedExtension(info.thumburl)) return false;
    if (info.extmetadata?.Restrictions?.value) return false;
    if (info.extmetadata?.DeletionReason) return false;
    if (!relaxAspectRatio && info.width < info.height) return false;
    if (!this.hasFoodCategory(page)) return false;
    return true;
  }

  private isAllowedExtension(thumburl: string): boolean {
    const lower = thumburl.toLowerCase();
    return ALLOWED_EXTENSIONS.some(ext => lower.includes(ext));
  }

  private hasFoodCategory(page: WikimediaPageDTO): boolean {
    if (!page.categories?.length) return false;
    return page.categories.some(cat =>
      FOOD_CATEGORY_KEYWORDS.some(keyword => cat.title.toLowerCase().includes(keyword)),
    );
  }
}
