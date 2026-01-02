import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Output, generateText } from 'ai';
import Constants from 'expo-constants';
import type { ZodType, z } from 'zod';

export const useVercelAi = () => {
  const apiKey = Constants.expoConfig?.extra?.googleGeminiApiKey;

  const google = createGoogleGenerativeAI({
    apiKey: apiKey,
  });

  const generateAiObject = async <T extends ZodType>(
    prompt: string,
    schema: T,
    model: string,
  ): Promise<z.infer<T> | undefined> => {
    try {
      const { output } = await generateText({
        model: google(model),
        output: Output.object({
          schema: schema,
        }),
        tools: {
          google_search: google.tools.googleSearch({}),
        },
        prompt: prompt,
      });

      return output as z.infer<T>;
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <Needed for error logging>
      console.error('Error generating AI object: ', error);
      return undefined;
    }
  };

  return { generateAiObject };
};
