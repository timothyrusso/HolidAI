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

/** A Commons search result with everything the app shows: a thumbnail and its size. */
export type UsableImageInfoDTO = WikimediaImageInfoDTO & {
  readonly thumburl: string;
  readonly width: number;
  readonly height: number;
};

/** Commons renders a vector file to a png thumbnail named `<file>.svg.png`. */
const isAllowedImageExtension = (url: string): boolean => {
  const lower = url.toLowerCase();
  return !lower.endsWith('.svg.png') && ALLOWED_IMAGE_EXTENSIONS.some(ext => lower.endsWith(ext));
};

const NOT_A_LETTER = '[^a-z0-9\\u00c0-\\uffff]';

const escapeRegExp = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Matches `word` (or its plural with an `s`) as a whole word of a lowercased text. */
const wholeWord = (word: string): RegExp =>
  new RegExp(`(?:^|${NOT_A_LETTER})${escapeRegExp(word.toLowerCase())}s?(?=$|${NOT_A_LETTER})`);

const FOOD_CATEGORY_PATTERNS = FOOD_CATEGORY_KEYWORDS.map(wholeWord);

const hasFoodCategory = (page: WikimediaPageDTO, dish: string): boolean => {
  if (!page.categories?.length) return false;
  const dishPattern = wholeWord(dish);
  return page.categories.some(cat => {
    const lowerCat = cat.title.toLowerCase();
    return dishPattern.test(lowerCat) || FOOD_CATEGORY_PATTERNS.some(pattern => pattern.test(lowerCat));
  });
};

const isUsableImage = (info: WikimediaImageInfoDTO | undefined): info is UsableImageInfoDTO => {
  if (info?.thumburl === undefined || info.width === undefined || info.height === undefined) return false;
  if (info.width < MIN_IMAGE_DIMENSION_PX && info.height < MIN_IMAGE_DIMENSION_PX) return false;
  if (!isAllowedImageExtension(info.thumburl)) return false;
  return !info.extmetadata?.Restrictions?.value;
};

/**
 * The first Commons search result that is a usable picture of `dish`: a jpg or png (not a vector
 * rendered to png), large enough, unrestricted, and filed under a food category or one naming the
 * dish, matched as whole words. `null` when none is.
 */
export const selectDishImage = (pages: readonly WikimediaPageDTO[], dish: string): UsableImageInfoDTO | null => {
  for (const page of pages) {
    const info = page.imageinfo?.[0];
    if (isUsableImage(info) && hasFoodCategory(page, dish)) return info;
  }
  return null;
};
