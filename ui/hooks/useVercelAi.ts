import { logger } from '@/di/resolve';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai';
import Constants from 'expo-constants';
import type { ZodSchema, z } from 'zod';

export const useVercelAi = () => {
  const apiKey = Constants.expoConfig?.extra?.googleGeminiApiKey;

  const google = createGoogleGenerativeAI({
    apiKey: apiKey,
  });

  const generateAiObject = async <T extends ZodSchema>(
    prompt: string,
    schema: T,
    model: string,
  ): Promise<z.infer<T>> => {
    try {
      return await generateObject({
        model: google(model),
        schema: schema,
        prompt: prompt,
      });
    } catch (error) {
      logger.error(error as Error);
      return null;
    }
  };

  return { generateAiObject };
};
