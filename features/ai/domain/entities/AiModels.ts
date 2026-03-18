export const AiModels = {
  GEMINI_2_0_FLASH: 'gemini-2.0-flash',
  GEMINI_2_5_FLASH: 'gemini-2.5-flash',
} as const;

export type AiModels = (typeof AiModels)[keyof typeof AiModels];
