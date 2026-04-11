import type { AiModels } from '@/features/ai/domain/entities/AiModels';
import type { Result } from '@/features/core/error';
import type { ZodType, z } from 'zod';

export interface IAiClient {
  generateObject<T extends ZodType>(prompt: string, schema: T, model: AiModels): Promise<Result<z.infer<T>>>;
}
