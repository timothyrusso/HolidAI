import type { ZodType, z } from 'zod';

import { type AiModels, geminiAiClient } from '@/features/ai';

export const useVercelAi = () => {
  const generateAiObject = <T extends ZodType>(
    prompt: string,
    schema: T,
    model: AiModels,
  ): Promise<z.infer<T> | undefined> => {
    return geminiAiClient.generateObject(prompt, schema, model);
  };

  return { generateAiObject };
};
