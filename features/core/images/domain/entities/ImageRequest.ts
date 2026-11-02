import type { UrlType } from '@/features/core/images/domain/entities/UrlType';

/** One image to look up: the provider to ask, what to search for, and the size wanted. */
export type ImageRequest =
  | { readonly source: 'unsplash'; readonly query: string; readonly urlType?: UrlType }
  | { readonly source: 'googlePlaces'; readonly query: string; readonly maxWidthPx?: number }
  | { readonly source: 'wikimediaDish'; readonly query: string; readonly maxWidthPx?: number };
