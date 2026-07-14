import 'reflect-metadata';

import { inject, injectable } from 'inversify';
import type { IAiClient } from '@/features/ai';
import { AI_TYPES, AiModels, travelPlanPrompt } from '@/features/ai';
import { formatDateForPromptUseCase } from '@/features/core/dates';
import type { ILogger } from '@/features/core/error';
import { ERROR_TYPES, fail, ok, type Result } from '@/features/core/error';
import { generatedTripSchema } from '@/features/trip-generation/domain/schemas/GenerateTripSchema';
import type { TripAiResp } from '@/features/trips';

export type GenerateTripParams = {
  location: string;
  totalNoOfDays: number;
  travelersNumber: number;
  travelerType: string;
  budgetInfo: string;
  startDate: Date;
  endDate: Date;
  locale: string;
};

@injectable()
export class GenerateTripUseCase {
  constructor(
    @inject(AI_TYPES.GeminiAiClient) private readonly aiClient: IAiClient,
    @inject(ERROR_TYPES.Logger) private readonly logger: ILogger,
  ) {}

  /**
   * Generates a structured trip plan from the user's inputs via the AI client.
   * @param params - Trip generation inputs (location, dates, travelers, budget, locale).
   * @returns A `Result` with the generated `TripAiResp` on success, or a failure (logged) on error.
   */
  async execute(params: GenerateTripParams): Promise<Result<TripAiResp>> {
    const prompt = travelPlanPrompt
      .replaceAll('{location}', params.location)
      .replaceAll('{days}', params.totalNoOfDays.toString())
      .replaceAll('{nights}', (params.totalNoOfDays - 1).toString())
      .replaceAll('{travelersNumber}', params.travelersNumber.toString())
      .replaceAll('{travelersType}', params.travelerType)
      .replaceAll('{budget}', params.budgetInfo)
      .replaceAll('{startDate}', formatDateForPromptUseCase.execute(params.startDate))
      .replaceAll('{endDate}', formatDateForPromptUseCase.execute(params.endDate))
      .replaceAll('{locale}', params.locale);

    const result = await this.aiClient.generateObject(prompt, generatedTripSchema, AiModels.GEMINI_2_5_FLASH);

    if (!result.success) {
      this.logger.error(result.error, {
        location: params.location,
        totalNoOfDays: params.totalNoOfDays,
        travelerType: params.travelerType,
        budgetInfo: params.budgetInfo,
      });
      return fail(result.error);
    }

    return ok(result.data);
  }
}
