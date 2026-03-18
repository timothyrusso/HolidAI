import type { createGoogleGenerativeAI } from '@ai-sdk/google';
import { Output, generateText } from 'ai';
import { inject, injectable } from 'tsyringe';
import type { ZodType, z } from 'zod';

import { AI_TYPES } from '@/features/ai/di/types';
import type { AiModels } from '@/features/ai/domain/entities/AiModels';
import type { IAiClient } from '@/features/ai/domain/entities/services/IAiClient';

@injectable()
export class GeminiClient implements IAiClient {
  constructor(@inject(AI_TYPES.GeminiProvider) private readonly google: ReturnType<typeof createGoogleGenerativeAI>) {}

  /**
   * Generates a structured object from a natural language prompt using a two-step pipeline:
   * 1. Gathers up-to-date information via Google Search grounding.
   * 2. Structures the search results into a typed object matching the provided Zod schema.
   *
   * Thinking tokens are disabled (`thinkingBudget: 0`) on both steps to keep latency
   * and cost equivalent to a standard (non-thinking) model call.
   *
   * Errors are not caught here — they propagate to the caller. Logging belongs in the
   * use case layer, not in `data/services/`.
   *
   * @param prompt - The natural language query describing what data to generate.
   * @param schema - A Zod schema that defines the shape of the returned object.
   * @param model - The model to use. Must be a value from the `AiModels` const (e.g. `AiModels.GEMINI_2_5_FLASH`).
   * @returns The generated object typed to the schema, or `undefined` if the output is empty.
   */
  async generateObject<T extends ZodType>(prompt: string, schema: T, model: AiModels): Promise<z.infer<T> | undefined> {
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
  }
}
