import type { GoogleGenerativeAIProvider } from '@ai-sdk/google';
import { Output, generateText } from 'ai';
import { inject, injectable } from 'tsyringe';
import type { ZodType, z } from 'zod';

import { AI_TYPES } from '@/features/ai/di/types';
import type { AiModels } from '@/features/ai/domain/entities/AiModels';
import type { IAiClient } from '@/features/ai/domain/entities/services/IAiClient';

@injectable()
export class GeminiClient implements IAiClient {
  private readonly providerOptions = {
    google: { thinkingConfig: { thinkingBudget: 0 } },
  } as const;

  constructor(@inject(AI_TYPES.GeminiProvider) private readonly google: GoogleGenerativeAIProvider) {}

  /**
   * Generates a structured object from a natural language prompt using a two-step pipeline:
   * 1. Gathers up-to-date information via Google Search grounding.
   * 2. Structures the search results into a typed object matching the provided Zod schema.
   *
   * @param prompt - The natural language query describing what data to generate.
   * @param schema - A Zod schema that defines the shape of the returned object.
   * @param model - The model to use. Must be a value from the `AiModels` const (e.g. `AiModels.GEMINI_2_5_FLASH`).
   * @returns The generated object typed and validated against the schema.
   */
  async generateObject<T extends ZodType>(prompt: string, schema: T, model: AiModels): Promise<z.infer<T>> {
    const context = await this.searchWithGrounding(prompt, model);
    return this.extractStructuredOutput(context, prompt, schema, model);
  }

  /**
   * Performs a grounded Google Search for the given prompt and returns the raw text result.
   * Errors are not caught here — they propagate to the caller. Logging belongs in the
   * use case layer, not in `data/services/`.
   *
   * @param prompt - The natural language query to search for.
   * @param model - The model to use for the search.
   * @returns The raw text result from the search.
   * @throws If the search returns no text.
   */
  private async searchWithGrounding(prompt: string, model: AiModels): Promise<string> {
    const result = await generateText({
      model: this.google(model),
      tools: {
        google_search: this.google.tools.googleSearch({}),
      },
      providerOptions: this.providerOptions,
      prompt,
    });

    if (!result.text) throw new Error('No search results found for the query.');

    return result.text;
  }

  /**
   * Extracts a structured object from search context using the provided Zod schema.
   *
   * @param context - The raw search text to extract data from.
   * @param prompt - The original user query, included for extraction accuracy.
   * @param schema - A Zod schema that defines the shape of the returned object.
   * @param model - The model to use for extraction.
   * @returns The extracted object typed and validated against the schema.
   */
  private async extractStructuredOutput<T extends ZodType>(
    context: string,
    prompt: string,
    schema: T,
    model: AiModels,
  ): Promise<z.infer<T>> {
    const { output } = await generateText({
      model: this.google(model),
      output: Output.object({ schema }),
      providerOptions: this.providerOptions,
      prompt: `
        You are a data extraction assistant.
        Use the following context provided from a Google Search to populate the requested data structure.

        User Query: ${prompt}

        Search Context:
        ${context}
      `,
    });

    return schema.parse(output);
  }
}
