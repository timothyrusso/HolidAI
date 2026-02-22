import type { ZodType, z } from 'zod';

export interface IAiClient {
  generateObject<T extends ZodType>(prompt: string, schema: T, model: string): Promise<z.infer<T> | undefined>;
}
