import { inject, injectable } from 'inversify';
import type { Result } from '@/features/core/error';
import { ok } from '@/features/core/error';
import type { FetchPhotoNamesUseCase } from '@/features/core/images';
import { IMAGES_TYPES } from '@/features/core/images';
import type { TripAiResp } from '@/features/trips';

const MAX_PHOTOS = 6;

@injectable()
export class EnrichTripWithPhotosUseCase {
  constructor(
    @inject(IMAGES_TYPES.FetchPhotoNamesUseCase) private readonly fetchPhotoNamesUseCase: FetchPhotoNamesUseCase,
  ) {}

  /**
   * Enriches each schedule item of a trip with Google Places photo resource names.
   * @param tripAiResp - The generated trip to enrich.
   * @returns A `Result` with the trip whose schedule items carry `photoResourceNames`
   * (empty arrays where lookup fails).
   */
  async execute(tripAiResp: TripAiResp): Promise<Result<TripAiResp>> {
    const location = tripAiResp.tripDetails.location.split(',')[0];

    const enrichedDayPlans = await Promise.all(
      tripAiResp.dayPlans.map(async dayPlan => ({
        ...dayPlan,
        schedule: await Promise.all(
          dayPlan.schedule.map(async item => {
            const result = await this.fetchPhotoNamesUseCase.execute(`${item.placeName}, ${location}`, MAX_PHOTOS);
            return { ...item, photoResourceNames: result.success ? result.data : [] };
          }),
        ),
      })),
    );

    return ok({ ...tripAiResp, dayPlans: enrichedDayPlans });
  }
}
