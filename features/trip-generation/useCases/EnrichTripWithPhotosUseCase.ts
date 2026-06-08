import { inject, injectable } from 'inversify';

import { ok } from '@/features/core/error';
import type { Result } from '@/features/core/error';
import { IMAGES_TYPES } from '@/features/core/images';
import type { FetchPhotoNamesUseCase } from '@/features/core/images';
import type { TripAiResp } from '@/features/trips';

const MAX_PHOTOS = 6;

@injectable()
export class EnrichTripWithPhotosUseCase {
  constructor(
    @inject(IMAGES_TYPES.FetchPhotoNamesUseCase) private readonly fetchPhotoNamesUseCase: FetchPhotoNamesUseCase,
  ) {}

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
