import 'reflect-metadata';

import { AiModels, travelPlanPrompt } from '@/features/ai';
import { AI_TYPES } from '@/features/ai/di/types';
import type { IAiClient } from '@/features/ai/domain/entities/services/IAiClient';
import { formatDateForPromptUseCase } from '@/features/core/dates';
import type { ILogger } from '@/features/core/error';
import { type Result, fail, ok } from '@/features/core/error';
import { ERROR_TYPES } from '@/features/core/error/di/types';
import { generatedTripSchema } from '@/features/trip-generation/domain/schemas/GenerateTripSchema';
import type { TripAiResp } from '@/features/trips';
import { inject, injectable } from 'tsyringe';

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

  async execute(params: GenerateTripParams): Promise<Result<TripAiResp>> {
    const prompt = travelPlanPrompt
      .replace('{location}', params.location)
      .replace('{days}', params.totalNoOfDays.toString())
      .replace('{nights}', (params.totalNoOfDays - 1).toString())
      .replace('{travelersNumber}', params.travelersNumber.toString())
      .replace('{travelersType}', params.travelerType)
      .replace('{budget}', params.budgetInfo)
      .replace('{startDate}', formatDateForPromptUseCase.execute(params.startDate))
      .replace('{endDate}', formatDateForPromptUseCase.execute(params.endDate))
      .replace('{locale}', params.locale);

    const result = await this.aiClient.generateObject(prompt, generatedTripSchema, AiModels.GEMINI_2_5_FLASH);

    if (!result.success) {
      this.logger.error(result.error, { location: params.location });
      return fail(result.error);
    }

    return ok(result.data);
  }
}
