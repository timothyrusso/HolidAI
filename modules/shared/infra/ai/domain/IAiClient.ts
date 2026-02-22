import type { GoogleGenerativeAIProvider } from '@ai-sdk/google';

export interface IAiClient {
  readonly provider: GoogleGenerativeAIProvider;
}
