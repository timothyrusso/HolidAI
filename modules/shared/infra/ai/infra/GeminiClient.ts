import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Output, generateText } from 'ai';
import Constants from 'expo-constants';
import { singleton } from 'tsyringe';
import type { ZodType, z } from 'zod';

import type { IAiClient } from '../domain';

/**
 * The `GeminiClient` class is an AI client implementation backed by Google Gemini via the Vercel AI SDK.
 * It implements the `IAiClient` interface and is designed to be used as a singleton.
 *
 * All Google-specific logic (provider setup, grounding tools, thinking config) is kept private
 * so that consumers remain provider-agnostic. Swapping to a different model or provider only
 * requires a new class implementing `IAiClient`.
 */
@singleton()
export class GeminiClient implements IAiClient {
  private readonly google: ReturnType<typeof createGoogleGenerativeAI>;

  constructor() {
    const apiKey = Constants.expoConfig?.extra?.googleGeminiApiKey;
    this.google = createGoogleGenerativeAI({ apiKey });
  }

  /**
   * Generates a structured object from a natural language prompt using a two-step pipeline:
   * 1. Gathers up-to-date information via Google Search grounding.
   * 2. Structures the search results into a typed object matching the provided Zod schema.
   *
   * Thinking tokens are disabled (`thinkingBudget: 0`) on both steps to keep latency
   * and cost equivalent to a standard (non-thinking) model call.
   *
   * @param prompt - The natural language query describing what data to generate.
   * @param schema - A Zod schema that defines the shape of the returned object.
   * @param model - The Gemini model identifier to use (e.g. `AiModels.GEMINI_2_5_FLASH`).
   * @returns The generated object typed to the schema, or `undefined` if generation fails.
   */
  async generateObject<T extends ZodType>(prompt: string, schema: T, model: string): Promise<z.infer<T> | undefined> {
    try {
      const searchResult = await generateText({
        model: this.google(model),
        tools: {
          google_search: this.google.tools.googleSearch({}),
        },
        providerOptions: {
          google: { thinkingConfig: { thinkingBudget: 0 } },
        },
        prompt: prompt,
      });

      if (!searchResult.text) throw new Error('No search results found for the query.');

      const { output } = await generateText({
        model: this.google(model),
        output: Output.object({
          schema: schema,
        }),
        providerOptions: {
          google: { thinkingConfig: { thinkingBudget: 0 } },
        },
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
