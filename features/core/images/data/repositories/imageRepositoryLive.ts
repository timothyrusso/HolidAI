import { Effect, Layer, Schema } from 'effect';
import { AppConfig, requireConfigKey } from '@/features/core/config';
import { ImageFetchFailed } from '@/features/core/error';
import { HttpClient } from '@/features/core/http';
import {
  selectDishImage,
  WIKIMEDIA_HEADERS,
  wikimediaDishSearchUrl,
} from '@/features/core/images/data/adapters/wikimediaDishSearch';
import { GooglePlacesSearchResponseDTO } from '@/features/core/images/data/dtos/GooglePlacesSearchResponseDTO';
import { UnsplashSearchResponseDTO } from '@/features/core/images/data/dtos/UnsplashSearchResponseDTO';
import { WikimediaSearchResponseDTO } from '@/features/core/images/data/dtos/WikimediaSearchResponseDTO';
import type { ImageRequest } from '@/features/core/images/domain/entities/ImageRequest';
import { IMAGE_RESOLUTION } from '@/features/core/images/domain/entities/imageResolutions';
import { UrlType } from '@/features/core/images/domain/entities/UrlType';
import { ImageRepository } from '@/features/core/images/domain/repositories/ImageRepository';
import { buildGooglePlacesMediaUrl } from '@/features/core/images/domain/utils/buildGooglePlacesMediaUrl';

const UNSPLASH_SEARCH_URL = 'https://api.unsplash.com/search/photos';
const GOOGLE_PLACES_SEARCH_URL = 'https://places.googleapis.com/v1/places:searchText';

/** Decodes a provider's response, failing with `ImageFetchFailed` naming the provider. */
const decode =
  <A, I>(schema: Schema.Schema<A, I>, source: ImageRequest['source']) =>
  (body: unknown) =>
    Schema.decodeUnknown(schema)(body).pipe(Effect.mapError(cause => new ImageFetchFailed({ source, cause })));

export const ImageRepositoryLive = Layer.effect(
  ImageRepository,
  Effect.gen(function* () {
    const http = yield* HttpClient;
    const config = yield* AppConfig.Config;

    const unsplash = (query: string, urlType: UrlType) =>
      Effect.gen(function* () {
        const apiKey = yield* requireConfigKey(config, 'unsplashAccessKey');
        const body = yield* http.getJson(`${UNSPLASH_SEARCH_URL}?page=1&query=${encodeURIComponent(query)}`, {
          headers: { Authorization: `Client-ID ${apiKey}` },
        });
        const response = yield* decode(UnsplashSearchResponseDTO, 'unsplash')(body);
        const photo = response.results[0];
        return photo ? { url: photo.urls[urlType], blurHash: photo.blur_hash ?? undefined } : null;
      });

    const googlePlaces = (query: string, maxWidthPx: number) =>
      Effect.gen(function* () {
        const apiKey = yield* requireConfigKey(config, 'googlePlacesApiKey');
        const body = yield* http.postJson(
          GOOGLE_PLACES_SEARCH_URL,
          { textQuery: query },
          { headers: { 'X-Goog-Api-Key': apiKey, 'X-Goog-FieldMask': 'places.id,places.photos' } },
        );
        const response = yield* decode(GooglePlacesSearchResponseDTO, 'googlePlaces')(body);
        const photoName = response.places?.[0]?.photos?.[0]?.name;
        return photoName ? { url: buildGooglePlacesMediaUrl(photoName, apiKey, maxWidthPx) } : null;
      });

    const wikimediaDish = (dish: string, widthPx: number) =>
      Effect.gen(function* () {
        const body = yield* http.getJson(wikimediaDishSearchUrl(dish, widthPx), { headers: WIKIMEDIA_HEADERS });
        const response = yield* decode(WikimediaSearchResponseDTO, 'wikimediaDish')(body);
        const info = selectDishImage(Object.values(response.query?.pages ?? {}), dish);
        return info ? { url: info.thumburl } : null;
      });

    return {
      getImage: request => {
        switch (request.source) {
          case 'unsplash':
            return unsplash(request.query, request.urlType ?? UrlType.REGULAR);
          case 'googlePlaces':
            return googlePlaces(request.query, request.maxWidthPx ?? IMAGE_RESOLUTION.medium);
          case 'wikimediaDish':
            return wikimediaDish(request.query, request.maxWidthPx ?? IMAGE_RESOLUTION.high);
        }
      },
    };
  }),
);
