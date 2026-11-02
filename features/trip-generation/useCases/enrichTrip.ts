import { Effect } from 'effect';
import type { GeneratedTrip } from '@/features/ai';
import { ImageRepository, UrlType } from '@/features/core/images';

/** How many Google Places photos an activity keeps. */
const MAX_ACTIVITY_PHOTOS = 6;

const NO_COVER = { url: '', blurHash: '' };

/**
 * `trip` with the pictures the image providers have for it: the Google Places photos of each
 * activity, a Wikimedia picture of each typical dish and an Unsplash cover of the destination, all
 * looked up at once. A lookup that fails or finds nothing leaves its field empty, for the trip
 * screens to retry: a missing picture never stops a trip being saved.
 */
export const enrichTrip = (trip: GeneratedTrip) =>
  Effect.gen(function* () {
    const images = yield* ImageRepository;
    const location = trip.tripDetails.location.split(',')[0];

    const withPhotos = (item: GeneratedTrip['dayPlans'][number]['schedule'][number]) =>
      images.getPlacePhotoNames(`${item.placeName}, ${location}`, MAX_ACTIVITY_PHOTOS).pipe(
        Effect.map(names => ({ ...item, photoResourceNames: [...names] })),
        Effect.orElseSucceed(() => ({ ...item, photoResourceNames: [] })),
      );

    const withImage = (dish: GeneratedTrip['food']['typicalDishes'][number]) =>
      images.getImage({ source: 'wikimediaDish', query: dish.searchTerm }).pipe(
        Effect.map(image => ({ ...dish, imageUrl: typeof image?.url === 'string' ? image.url : '' })),
        Effect.orElseSucceed(() => ({ ...dish, imageUrl: '' })),
      );

    const cover = images.getImage({ source: 'unsplash', query: location, urlType: UrlType.REGULAR }).pipe(
      Effect.map(image =>
        typeof image?.url === 'string' ? { url: image.url, blurHash: image.blurHash ?? '' } : NO_COVER,
      ),
      Effect.orElseSucceed(() => NO_COVER),
    );

    const [dayPlans, typicalDishes, coverImage] = yield* Effect.all(
      [
        Effect.forEach(
          trip.dayPlans,
          dayPlan =>
            Effect.map(Effect.forEach(dayPlan.schedule, withPhotos, { concurrency: 'unbounded' }), schedule => ({
              ...dayPlan,
              schedule,
            })),
          { concurrency: 'unbounded' },
        ),
        Effect.forEach(trip.food.typicalDishes, withImage, { concurrency: 'unbounded' }),
        cover,
      ],
      { concurrency: 'unbounded' },
    );

    return { ...trip, dayPlans, food: { ...trip.food, typicalDishes }, coverImage };
  });
