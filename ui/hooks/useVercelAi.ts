import type { ZodType, z } from 'zod';

import type { AiModels } from '@/configs/ai/AiModels';
import { aiClient } from '@/di/resolve';

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
