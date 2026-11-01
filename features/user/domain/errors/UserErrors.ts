import { AppErrorBase } from '@/features/core/error';

/** The user has no generation tokens left this month. */
export class TokensExhausted extends AppErrorBase('TokensExhausted', 'ERRORS.TOKENS_EXHAUSTED') {}

declare module '@/features/core/error' {
  interface AppErrorRegistry {
    user: TokensExhausted;
  }
}
