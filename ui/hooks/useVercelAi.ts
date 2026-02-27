import type { ZodType, z } from 'zod';

import { aiClient } from '@/di/resolve';
import type { AiModels } from '@/modules/ai/domain/entities/AiModels';

export const useVercelAi = () => {
  const generateAiObject = <T extends ZodType>(
    prompt: string,
    schema: T,
    model: AiModels,
  ): Promise<z.infer<T> | undefined> => {
    return aiClient.generateObject(prompt, schema, model);
  };

  return { generateAiObject };
};
