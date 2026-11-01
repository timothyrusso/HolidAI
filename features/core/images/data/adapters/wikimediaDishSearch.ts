import type {
  WikimediaImageInfoDTO,
  WikimediaPageDTO,
} from '@/features/core/images/data/dtos/WikimediaSearchResponseDTO';
import { FOOD_CATEGORY_KEYWORDS } from '@/features/core/images/domain/entities/foodCategoryKeywords';
import { IMAGE_RESOLUTION } from '@/features/core/images/domain/entities/imageResolutions';

const BASE_URL = 'https://commons.wikimedia.org/w/api.php';

/** Commons asks API clients to name themselves. */
export const WIKIMEDIA_HEADERS = { 'User-Agent': 'HolidAI/1.0 (https://github.com/timothyrusso/holidai)' };

/** The Commons search for pictures of `dish`, thumbnails `widthPx` wide. */
export const wikimediaDishSearchUrl = (dish: string, widthPx: number): string => {
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
    iiurlwidth: String(widthPx),
    iimetadataversion: 'latest',
    format: 'json',
    origin: '*',
  });
  return `${BASE_URL}?${params.toString()}`;
};

const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'] as const;
const MIN_IMAGE_DIMENSION_PX = IMAGE_RESOLUTION.low;

const isAllowedImageExtension = (url: string): boolean => {
  const lower = url.toLowerCase();
  return ALLOWED_IMAGE_EXTENSIONS.some(ext => lower.endsWith(ext));
};

const hasFoodCategory = (page: WikimediaPageDTO, dish: string): boolean => {
  if (!page.categories?.length) return false;
  const lowerDish = dish.toLowerCase();
  return page.categories.some(cat => {
    const lowerCat = cat.title.toLowerCase();
    return lowerCat.includes(lowerDish) || FOOD_CATEGORY_KEYWORDS.some(kw => lowerCat.includes(kw));
  });
};

const isUsableImage = (page: WikimediaPageDTO, dish: string): boolean => {
  const info = page.imageinfo?.[0];
  if (!info?.thumburl) return false;
  if (info.width < MIN_IMAGE_DIMENSION_PX && info.height < MIN_IMAGE_DIMENSION_PX) return false;
  if (!isAllowedImageExtension(info.thumburl)) return false;
  if (info.extmetadata?.Restrictions?.value) return false;
  return hasFoodCategory(page, dish);
};

/**
 * The first Commons search result that is a usable picture of `dish`: a jpg or png, large enough,
 * unrestricted, and filed under a food category or one naming the dish. `null` when none is.
 */
export const selectDishImage = (pages: readonly WikimediaPageDTO[], dish: string): WikimediaImageInfoDTO | null =>
  pages.find(page => isUsableImage(page, dish))?.imageinfo?.[0] ?? null;
