import { itEffect } from '@timothyrusso/effect-core/testing';
import { Effect } from 'effect';
import { ImageRepositoryFake } from '@/features/core/testing';
import { aGeneratedTrip } from '@/features/trip-generation/__fixtures__/builders';
import {
  ImagesDownFake,
  KIYOMIZU_PHOTOS,
  KYOTO_COVER,
  KyotoImagesFake,
  YUDOFU_PICTURE,
} from '@/features/trip-generation/di/__tests__/tripImagesFake';
import { enrichTrip } from '@/features/trip-generation/useCases/enrichTrip';
import { saveTrip } from '@/features/trip-generation/useCases/saveTrip';

describe('enrichTrip', () => {
  itEffect(
    'adds the photos of each activity in its city',
    Effect.gen(function* () {
      const trip = yield* enrichTrip(aGeneratedTrip());

      expect(trip.dayPlans[0]?.schedule[0]?.photoResourceNames).toEqual(KIYOMIZU_PHOTOS);
    }),
    KyotoImagesFake(),
  );

  itEffect(
    'adds a picture of each typical dish',
    Effect.gen(function* () {
      const trip = yield* enrichTrip(aGeneratedTrip());

      expect(trip.food.typicalDishes[0]?.imageUrl).toBe(YUDOFU_PICTURE);
    }),
    KyotoImagesFake(),
  );

  itEffect(
    'adds a cover of the destination',
    Effect.gen(function* () {
      const trip = yield* enrichTrip(aGeneratedTrip());

      expect(trip.coverImage).toEqual(KYOTO_COVER);
    }),
    KyotoImagesFake(),
  );

  itEffect(
    'keeps the rest of the trip as generated',
    Effect.gen(function* () {
      const trip = yield* enrichTrip(aGeneratedTrip());

      expect(trip.tripDetails).toEqual(aGeneratedTrip().tripDetails);
      expect(trip.weather).toEqual(aGeneratedTrip().weather);
    }),
    KyotoImagesFake(),
  );

  itEffect(
    'leaves every picture empty when its provider has none',
    Effect.gen(function* () {
      const trip = yield* enrichTrip(aGeneratedTrip());

      expect(trip.dayPlans[0]?.schedule[0]?.photoResourceNames).toEqual([]);
      expect(trip.food.typicalDishes[0]?.imageUrl).toBe('');
      expect(trip.coverImage).toEqual({ url: '', blurHash: '' });
    }),
    ImageRepositoryFake(),
  );

  itEffect(
    'leaves every picture empty, and still returns the trip, when the providers fail',
    Effect.gen(function* () {
      const trip = yield* enrichTrip(aGeneratedTrip());

      expect(trip.dayPlans[0]?.schedule[0]?.photoResourceNames).toEqual([]);
      expect(trip.food.typicalDishes[0]?.imageUrl).toBe('');
      expect(trip.coverImage).toEqual({ url: '', blurHash: '' });
    }),
    ImagesDownFake(),
  );
});

describe('saveTrip', () => {
  itEffect(
    'saves the trip with its pictures and returns the new id',
    Effect.gen(function* () {
      const saved: unknown[] = [];

      const id = yield* saveTrip(aGeneratedTrip(), 'user_2qa', trip =>
        Effect.sync(() => saved.push(trip)).pipe(Effect.as('trip_1')),
      );

      expect(id).toBe('trip_1');
      expect(saved).toEqual([yield* enrichTrip(aGeneratedTrip())]);
    }),
    KyotoImagesFake(),
  );

  itEffect(
    'fails with the failure of the save',
    Effect.gen(function* () {
      const error = yield* Effect.flip(
        saveTrip(aGeneratedTrip(), 'user_2qa', () => Effect.fail('Convex is down' as const)),
      );

      expect(error).toBe('Convex is down');
    }),
    KyotoImagesFake(),
  );
});
