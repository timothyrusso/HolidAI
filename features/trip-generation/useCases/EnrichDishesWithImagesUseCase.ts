import type { Result } from '@/features/core/error';
import { ok } from '@/features/core/error';
import type { FetchWikimediaDishImageUseCase } from '@/features/core/images';
import { IMAGES_TYPES } from '@/features/core/images';
import type { TripAiResp } from '@/features/trips';
import { inject, injectable } from 'inversify';

@injectable()
export class EnrichDishesWithImagesUseCase {
  constructor(
    @inject(IMAGES_TYPES.FetchWikimediaDishImageUseCase)
    private readonly fetchWikimediaDishImageUseCase: FetchWikimediaDishImageUseCase,
  ) {}

  /**
   * Enriches each typical dish of a trip with a Wikimedia image URL.
   * @param tripAiResp - The generated trip to enrich.
   * @returns A `Result` with the trip whose dishes carry `imageUrl` (empty string where lookup fails).
   */
  async execute(tripAiResp: TripAiResp): Promise<Result<TripAiResp>> {
    const enrichedDishes = await Promise.all(
      tripAiResp.food.typicalDishes.map(async dish => {
        const result = await this.fetchWikimediaDishImageUseCase.execute(dish.searchTerm);
        const url = result.success && result.data?.url;
        return { ...dish, imageUrl: typeof url === 'string' ? url : '' };
      }),
    );

    return ok({ ...tripAiResp, food: { ...tripAiResp.food, typicalDishes: enrichedDishes } });
  }
}
