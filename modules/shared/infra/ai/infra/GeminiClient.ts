import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Output, generateText } from 'ai';
import Constants from 'expo-constants';
import { singleton } from 'tsyringe';
import type { ZodType, z } from 'zod';

import type { IAiClient } from '../domain';

@singleton()
export class GeminiClient implements IAiClient {
  private readonly google: ReturnType<typeof createGoogleGenerativeAI>;

  constructor() {
    const apiKey = Constants.expoConfig?.extra?.googleGeminiApiKey;
    this.google = createGoogleGenerativeAI({ apiKey });
  }

  async generateObject<T extends ZodType>(prompt: string, schema: T, model: string): Promise<z.infer<T> | undefined> {
    try {
      // STEP 1: Gather Information (Search Enabled, No Schema)
      // We ask the model to answer the user's prompt using Google Search.
      const searchResult = await generateText({
        model: this.google(model),
        tools: {
          google_search: this.google.tools.googleSearch({}),
        },
        prompt: prompt,
      });

      if (!searchResult.text) throw new Error('No search results found for the query.');

      // STEP 2: Structure Data (Schema Enabled, No Search)
      // We feed the search results into a second call specifically for formatting.
      const { output } = await generateText({
        model: this.google(model),
        output: Output.object({
          schema: schema,
        }),
        prompt: `
          You are a data extraction assistant.
          Use the following context provided from a Google Search to populate the requested data structure.

          User Query: ${prompt}

          Search Context:
          ${searchResult.text}
        `,
      });

      return output as z.infer<T>;
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: <Needed for error logging>
      console.error('Error generating AI object: ', error);
      return undefined;
    }
  }
}
