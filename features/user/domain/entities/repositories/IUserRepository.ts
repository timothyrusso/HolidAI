import type { Effect } from 'effect';
import type { UnexpectedError } from '@/features/core/error';

export interface IUserRepository {
  getUser():
    | { id: string; username: string | null; email: string | undefined; profileImageUrl: string | undefined }
    | undefined;
  /** Spends `amount` of the signed-in user's generation tokens; nothing when no one is signed in. */
  decrementTokens(amount: number): Effect.Effect<void, UnexpectedError>;
}
