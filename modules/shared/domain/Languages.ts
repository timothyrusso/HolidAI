export const Languages = {
  IT: 'it',
  EN: 'en',
} as const;

export type Language = (typeof Languages)[keyof typeof Languages];
