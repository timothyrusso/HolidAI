import { type GoogleGenerativeAIProvider, createGoogleGenerativeAI } from '@ai-sdk/google';
import Constants from 'expo-constants';
import { singleton } from 'tsyringe';

import type { IAiClient } from '../domain';

@singleton()
export class GeminiClient implements IAiClient {
  readonly provider: GoogleGenerativeAIProvider;

  constructor() {
    const apiKey = Constants.expoConfig?.extra?.googleGeminiApiKey;
    this.provider = createGoogleGenerativeAI({ apiKey });
  }
}
