import type { AiModels } from '@/configs/ai/AiModels';
import type { ZodType, z } from 'zod';

export interface IAiClient {
  generateObject<T extends ZodType>(prompt: string, schema: T, model: AiModels): Promise<z.infer<T> | undefined>;
}
