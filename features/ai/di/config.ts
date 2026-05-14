import { ContainerModule } from 'inversify';

import { GeminiClient } from '@/features/ai/data/services/GeminiClient';
import { geminiProvider } from '@/features/ai/di/factories/gemini';
import { AI_TYPES } from '@/features/ai/di/types';
import type { IAiClient } from '@/features/ai/domain/entities/services/IAiClient';
import { container } from '@/features/core/container';

const aiModule = new ContainerModule(({ bind }) => {
  bind(AI_TYPES.GeminiProvider).toConstantValue(geminiProvider);
  bind<IAiClient>(AI_TYPES.GeminiAiClient).to(GeminiClient).inSingletonScope();
});

container.load(aiModule);
