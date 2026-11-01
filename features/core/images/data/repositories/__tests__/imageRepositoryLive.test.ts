import { itEffect } from '@timothyrusso/effect-core/testing';
import { Effect, Layer } from 'effect';
import { AppConfig, type AppConfigValues } from '@/features/core/config';
import { NetworkFailure } from '@/features/core/error';
import { HttpClient } from '@/features/core/http';
import { ImageRepositoryLive } from '@/features/core/images/data/repositories/imageRepositoryLive';
import { ImageRepository } from '@/features/core/images/domain/repositories/ImageRepository';
import { TEST_CONFIG } from '@/features/core/testing';

/** A request the fake received: the method, the URL and the headers it was sent with. */
interface SentRequest {
  readonly method: 'GET' | 'POST';
  readonly url: string;
  readonly headers: Readonly<Record<string, string>>;
}

/**
 * An `HttpClient` that answers each request with the body registered for the first URL prefix it
 * matches (an `Error` body fails as `NetworkFailure`), and keeps every request it was sent.
 */
const HttpClientFake = (bodies: Readonly<Record<string, unknown>>) => {
  const sent: SentRequest[] = [];
  const answer = (method: SentRequest['method'], url: string, headers: Readonly<Record<string, string>> = {}) =>
    Effect.suspend(() => {
      sent.push({ method, url, headers });
      const prefix = Object.keys(bodies).find(candidate => url.startsWith(candidate));
      const body = prefix === undefined ? undefined : bodies[prefix];
      return body instanceof Error || prefix === undefined
        ? Effect.fail(new NetworkFailure({ url, status: 503 }))
        : Effect.succeed(body);
    });
  const layer = Layer.succeed(HttpClient, {
    getJson: (url, options) => answer('GET', url, options?.headers),
    postJson: (url, _body, options) => answer('POST', url, options?.headers),
  });
  return { layer, sent };
};

const UNSPLASH = 'https://api.unsplash.com/search/photos';
const PLACES = 'https://places.googleapis.com/v1/places:searchText';
const COMMONS = 'https://commons.wikimedia.org/w/api.php';

const repositoryOver = (http: ReturnType<typeof HttpClientFake>, config: AppConfigValues = TEST_CONFIG) =>
  ImageRepositoryLive.pipe(Layer.provide(Layer.merge(http.layer, AppConfig.layerOf(config))));

const getImage = (request: Parameters<ImageRepository['Type']['getImage']>[0]) =>
  Effect.flatMap(ImageRepository, repository => repository.getImage(request));

const unsplashOk = HttpClientFake({ [UNSPLASH]: anUnsplashResponse() });
const unsplashEmpty = HttpClientFake({ [UNSPLASH]: { results: [] } });
const unsplashMalformed = HttpClientFake({ [UNSPLASH]: { results: [{ urls: 'not an object' }] } });
const unsplashDown = HttpClientFake({ [UNSPLASH]: new Error('down') });
const unsplashWithoutKey = HttpClientFake({ [UNSPLASH]: anUnsplashResponse() });

describe('ImageRepositoryLive, Unsplash', () => {
  itEffect(
    'returns the first photo at the size asked for, with its blur hash',
    Effect.gen(function* () {
      const image = yield* getImage({ source: 'unsplash', query: 'Kyoto, Japan', urlType: 'small' });

      expect(image).toEqual({ url: 'https://images.unsplash.com/kyoto-small', blurHash: 'LEHV6nWB2yk8' });
      expect(unsplashOk.sent[0]?.url).toBe(`${UNSPLASH}?page=1&query=Kyoto%2C%20Japan`);
      expect(unsplashOk.sent[0]?.headers.Authorization).toBe('Client-ID unsplash-test-key');
    }),
    repositoryOver(unsplashOk),
  );

  itEffect(
    'returns null when the search has no photo',
    Effect.gen(function* () {
      expect(yield* getImage({ source: 'unsplash', query: 'Nowhere' })).toBeNull();
    }),
    repositoryOver(unsplashEmpty),
  );

  itEffect(
    'fails with ImageFetchFailed when the response does not decode',
    Effect.gen(function* () {
      const error = yield* Effect.flip(getImage({ source: 'unsplash', query: 'Kyoto' }));

      expect(error._tag).toBe('ImageFetchFailed');
    }),
    repositoryOver(unsplashMalformed),
  );

  itEffect(
    'fails with the NetworkFailure of the request',
    Effect.gen(function* () {
      const error = yield* Effect.flip(getImage({ source: 'unsplash', query: 'Kyoto' }));

      expect(error._tag).toBe('NetworkFailure');
    }),
    repositoryOver(unsplashDown),
  );

  itEffect(
    'fails with ConfigMissing and sends nothing when the access key is not configured',
    Effect.gen(function* () {
      const error = yield* Effect.flip(getImage({ source: 'unsplash', query: 'Kyoto' }));

      expect(error).toMatchObject({ _tag: 'ConfigMissing', field: 'unsplashAccessKey' });
      expect(unsplashWithoutKey.sent).toEqual([]);
    }),
    repositoryOver(unsplashWithoutKey, { ...TEST_CONFIG, unsplashAccessKey: undefined }),
  );
});

const placesOk = HttpClientFake({
  [PLACES]: {
    places: [{ id: 'ChIJ1', photos: [{ name: 'places/ChIJ1/photos/AU1' }, { name: 'places/ChIJ1/photos/AU2' }] }],
  },
});
const placesWithoutPhotos = HttpClientFake({ [PLACES]: { places: [{ id: 'ChIJ1' }] } });

describe('ImageRepositoryLive, Google Places', () => {
  itEffect(
    'returns the media URL of the first photo of the first place, at the width asked for',
    Effect.gen(function* () {
      const image = yield* getImage({ source: 'googlePlaces', query: 'Colosseum, Rome', maxWidthPx: 800 });

      expect(image).toEqual({
        url: 'https://places.googleapis.com/v1/places/ChIJ1/photos/AU1/media?key=places-test-key&maxWidthPx=800',
      });
      expect(placesOk.sent[0]?.headers['X-Goog-Api-Key']).toBe('places-test-key');
    }),
    repositoryOver(placesOk),
  );

  itEffect(
    'returns null when the place has no photo',
    Effect.gen(function* () {
      expect(yield* getImage({ source: 'googlePlaces', query: 'Colosseum, Rome' })).toBeNull();
    }),
    repositoryOver(placesWithoutPhotos),
  );
});

const placesDown = HttpClientFake({ [PLACES]: new Error('down') });
const placesWithoutKey = HttpClientFake({ [PLACES]: {} });

const getPlacePhotoNames = (query: string, count: number) =>
  Effect.flatMap(ImageRepository, repository => repository.getPlacePhotoNames(query, count));

describe('ImageRepositoryLive, Google Places photo names', () => {
  itEffect(
    'returns the photo names of the first place, up to the count asked for',
    Effect.gen(function* () {
      expect(yield* getPlacePhotoNames('Colosseum, Rome', 1)).toEqual(['places/ChIJ1/photos/AU1']);
    }),
    repositoryOver(placesOk),
  );

  itEffect(
    'returns no names when the place has no photo',
    Effect.gen(function* () {
      expect(yield* getPlacePhotoNames('Colosseum, Rome', 6)).toEqual([]);
    }),
    repositoryOver(placesWithoutPhotos),
  );

  itEffect(
    'fails with the NetworkFailure of the search',
    Effect.gen(function* () {
      const error = yield* Effect.flip(getPlacePhotoNames('Colosseum, Rome', 6));

      expect(error._tag).toBe('NetworkFailure');
    }),
    repositoryOver(placesDown),
  );

  itEffect(
    'fails with ConfigMissing and sends nothing when the Places key is not configured',
    Effect.gen(function* () {
      const error = yield* Effect.flip(getPlacePhotoNames('Colosseum, Rome', 6));

      expect(error).toMatchObject({ _tag: 'ConfigMissing', field: 'googlePlacesApiKey' });
      expect(placesWithoutKey.sent).toEqual([]);
    }),
    repositoryOver(placesWithoutKey, { ...TEST_CONFIG, googlePlacesApiKey: undefined }),
  );
});

const commonsOk = HttpClientFake({
  [COMMONS]: {
    query: {
      pages: {
        '1': aCommonsPage({ pageid: 1, thumburl: 'https://upload.wikimedia.org/carbonara.svg' }),
        '2': aCommonsPage({ pageid: 2, width: 120, height: 90 }),
        '3': aCommonsPage({ pageid: 3, categories: [{ title: 'Category:Trains' }] }),
        '4': aCommonsPage({ pageid: 4, thumburl: 'https://upload.wikimedia.org/carbonara.jpg' }),
      },
    },
  },
});
const commonsEmpty = HttpClientFake({ [COMMONS]: {} });
const commonsWithoutThumbnail = HttpClientFake({
  [COMMONS]: {
    query: {
      pages: {
        '1': { ...aCommonsPage({ pageid: 1 }), imageinfo: [{ width: 1200, height: 800 }] },
        '2': aCommonsPage({ pageid: 2, thumburl: 'https://upload.wikimedia.org/carbonara-plate.jpg' }),
      },
    },
  },
});
const commonsTrain = HttpClientFake({
  [COMMONS]: { query: { pages: { '1': aCommonsPage({ categories: [{ title: 'Category:Steam locomotives' }] }) } } },
});
const commonsVector = HttpClientFake({
  [COMMONS]: {
    query: { pages: { '1': aCommonsPage({ thumburl: 'https://upload.wikimedia.org/800px-Carbonara.svg.png' }) } },
  },
});

describe('ImageRepositoryLive, Wikimedia Commons', () => {
  itEffect(
    'returns the first usable food picture, skipping vectors, small images and non-food categories',
    Effect.gen(function* () {
      const image = yield* getImage({ source: 'wikimediaDish', query: 'Carbonara' });

      expect(image).toEqual({ url: 'https://upload.wikimedia.org/carbonara.jpg' });
      expect(commonsOk.sent[0]?.url).toContain('iiurlwidth=800');
    }),
    repositoryOver(commonsOk),
  );

  itEffect(
    'returns null when the search finds no page, without needing a key',
    Effect.gen(function* () {
      expect(yield* getImage({ source: 'wikimediaDish', query: 'Carbonara' })).toBeNull();
    }),
    repositoryOver(commonsEmpty, { ...TEST_CONFIG, googlePlacesApiKey: undefined, unsplashAccessKey: undefined }),
  );

  itEffect(
    'skips a page with no thumbnail and returns a later usable one',
    Effect.gen(function* () {
      const image = yield* getImage({ source: 'wikimediaDish', query: 'Carbonara' });

      expect(image).toEqual({ url: 'https://upload.wikimedia.org/carbonara-plate.jpg' });
    }),
    repositoryOver(commonsWithoutThumbnail),
  );

  itEffect(
    'does not take a food word inside a longer word as a food category',
    Effect.gen(function* () {
      expect(yield* getImage({ source: 'wikimediaDish', query: 'Carbonara' })).toBeNull();
    }),
    repositoryOver(commonsTrain),
  );

  itEffect(
    'skips a vector file rendered to a png thumbnail',
    Effect.gen(function* () {
      expect(yield* getImage({ source: 'wikimediaDish', query: 'Carbonara' })).toBeNull();
    }),
    repositoryOver(commonsVector),
  );
});

function anUnsplashResponse() {
  return {
    total: 1,
    results: [
      {
        id: 'kyoto-1',
        urls: {
          full: 'https://images.unsplash.com/kyoto-full',
          regular: 'https://images.unsplash.com/kyoto-regular',
          small: 'https://images.unsplash.com/kyoto-small',
          thumb: 'https://images.unsplash.com/kyoto-thumb',
        },
        blur_hash: 'LEHV6nWB2yk8',
      },
    ],
  };
}

function aCommonsPage(
  overrides: {
    pageid?: number;
    thumburl?: string;
    width?: number;
    height?: number;
    categories?: readonly { title: string }[];
  } = {},
) {
  return {
    pageid: overrides.pageid ?? 1,
    title: 'File:Spaghetti alla carbonara.jpg',
    categories: overrides.categories ?? [{ title: 'Category:Carbonara' }, { title: 'Category:Italian cuisine' }],
    imageinfo: [
      {
        thumburl: overrides.thumburl ?? 'https://upload.wikimedia.org/carbonara.jpg',
        width: overrides.width ?? 1200,
        height: overrides.height ?? 800,
        extmetadata: {},
      },
    ],
  };
}
