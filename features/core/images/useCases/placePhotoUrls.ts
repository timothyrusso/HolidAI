import { Effect } from 'effect';
import { AppConfig, requireConfigKey } from '@/features/core/config';
import { buildGooglePlacesMediaUrl } from '@/features/core/images/domain/utils/buildGooglePlacesMediaUrl';

/** The media URL of each Google Places photo in `resourceNames`, `maxWidthPx` wide. */
export const placePhotoUrls = (resourceNames: readonly string[], maxWidthPx: number) =>
  Effect.gen(function* () {
    const apiKey = yield* requireConfigKey(yield* AppConfig.Config, 'googlePlacesApiKey');
    return resourceNames.map(name => buildGooglePlacesMediaUrl(name, apiKey, maxWidthPx));
  });
